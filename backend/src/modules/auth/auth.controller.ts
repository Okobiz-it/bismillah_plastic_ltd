import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from './auth.model.js';
import { sendResponse, sendError } from '../../core/utils/response.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await (admin as any).comparePassword(password))) {
      sendError(res, 401, 'Invalid credentials');
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_key_123456789';
    const token = jwt.sign({ id: admin._id }, secret, {
      expiresIn: '1d',
    });

    sendResponse(res, 200, { token, email: admin.email }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const admin = await Admin.findOne({});
    
    if (!admin) {
      sendError(res, 404, 'Admin account not found');
      return;
    }

    // Rate limiting: Enforce 60-second cooldown period between OTP requests
    if (admin.resetPasswordLastRequestedAt) {
      const elapsedMs = Date.now() - admin.resetPasswordLastRequestedAt.getTime();
      const cooldownMs = 60 * 1000;
      if (elapsedMs < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
        sendError(res, 429, `Please wait ${remainingSeconds} seconds before requesting another OTP.`);
        return;
      }
    }

    // Generate 6 digit secure OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordOtp = otp;
    admin.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
    admin.resetPasswordLastRequestedAt = new Date();
    admin.otpAttempts = 0;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordTokenExpires = undefined;
    await admin.save();

    // Send email to configured SMTP_USER
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS?.replace(/"/g, ''),
        },
      });

      await transporter.sendMail({
        from: `"Admin Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: admin.email,
        subject: 'Admin Security - Password Reset OTP',
        text: `Your OTP for resetting your admin password is: ${otp}. It is valid for 10 minutes. If you did not request this, please secure your account immediately.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; rounded: 8px;">
            <h2 style="color: #1a365d;">Admin Password Reset Request</h2>
            <p>A password reset was requested for your administrator account.</p>
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #d69e2e;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #718096;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
            <p style="font-size: 12px; color: #a0aec0; margin-top: 30px;">If you did not request a password reset, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      admin.resetPasswordOtp = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      sendError(res, 500, 'Failed to send OTP email. Please verify SMTP settings.');
      return;
    }

    sendResponse(res, 200, { cooldownSeconds: 60 }, 'A verification OTP has been sent to the administrator email.');
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { otp } = req.body;

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      sendError(res, 400, 'Please enter a valid 6-digit OTP code.');
      return;
    }

    const admin = await Admin.findOne({});

    if (!admin || !admin.resetPasswordOtp || !admin.resetPasswordExpires) {
      sendError(res, 400, 'No active OTP request found. Please request a new OTP.');
      return;
    }

    // Check expiration
    if (new Date() > admin.resetPasswordExpires) {
      admin.resetPasswordOtp = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      sendError(res, 400, 'OTP has expired. Please request a new OTP.');
      return;
    }

    // Check max attempts
    if ((admin.otpAttempts || 0) >= 5) {
      admin.resetPasswordOtp = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      sendError(res, 400, 'Maximum failed verification attempts reached. Please request a new OTP.');
      return;
    }

    // Validate OTP
    if (admin.resetPasswordOtp !== otp.trim()) {
      admin.otpAttempts = (admin.otpAttempts || 0) + 1;
      await admin.save();
      const remainingAttempts = 5 - admin.otpAttempts;
      if (remainingAttempts <= 0) {
        admin.resetPasswordOtp = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();
        sendError(res, 400, 'Maximum failed verification attempts reached. Please request a new OTP.');
        return;
      }
      sendError(res, 400, `Invalid OTP code. You have ${remainingAttempts} attempt(s) remaining.`);
      return;
    }

    // Generate secure single-use reset token and invalidate OTP immediately
    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes to set new password
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordExpires = undefined;
    admin.otpAttempts = 0;
    await admin.save();

    sendResponse(res, 200, { resetToken }, 'OTP verified successfully.');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || typeof resetToken !== 'string') {
      sendError(res, 400, 'Invalid password reset session. Please verify OTP again.');
      return;
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      sendError(res, 400, 'Password must be at least 6 characters long.');
      return;
    }

    const admin = await Admin.findOne({
      resetPasswordToken: resetToken,
      resetPasswordTokenExpires: { $gt: new Date() },
    });

    if (!admin) {
      sendError(res, 400, 'Password reset session has expired or is invalid. Please request a new OTP.');
      return;
    }

    // Update password & invalidate tokens
    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordTokenExpires = undefined;
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    sendResponse(res, 200, null, 'Password reset successfully. You can now log in with your new password.');
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -resetPasswordOtp -resetPasswordToken');
    if (!admin) {
      sendError(res, 404, 'Admin not found');
      return;
    }
    sendResponse(res, 200, admin);
  } catch (error) {
    next(error);
  }
};

export const updateAdminEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, currentPassword } = req.body;

    if (!email || !currentPassword) {
      sendError(res, 400, 'Email and current password are required');
      return;
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      sendError(res, 404, 'Admin not found');
      return;
    }

    if (!(await (admin as any).comparePassword(currentPassword))) {
      sendError(res, 401, 'Invalid current password');
      return;
    }

    const existingEmail = await Admin.findOne({ email, _id: { $ne: admin._id } });
    if (existingEmail) {
      sendError(res, 400, 'Email is already in use');
      return;
    }

    admin.email = email;
    await admin.save();

    sendResponse(res, 200, { email: admin.email }, 'Email updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateAdminPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      sendError(res, 400, 'Current and new password are required');
      return;
    }

    if (newPassword.length < 6) {
      sendError(res, 400, 'New password must be at least 6 characters long');
      return;
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      sendError(res, 404, 'Admin not found');
      return;
    }

    if (!(await (admin as any).comparePassword(currentPassword))) {
      sendError(res, 401, 'Invalid current password');
      return;
    }

    admin.password = newPassword;
    await admin.save();

    sendResponse(res, 200, null, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};
