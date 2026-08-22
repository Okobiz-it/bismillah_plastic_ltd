import type { Request, Response, NextFunction } from 'express';
import { Inquiry } from './inquiries.model.js';
import { sendResponse } from '../../core/utils/response.js';
import { escapeHtml } from '../../core/utils/xssUtils.js';
import nodemailer from 'nodemailer';
import { Admin } from '../auth/auth.model.js';
import cloudinary from '../../core/config/cloudinary.js';

export const createInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, email, phone, company, type, category, inquiryType,
      product, quantity, details, message,
      // New RFQ fields
      country, companyWebsite, companyAddress, deliveryAddress,
      designation, whatsapp, wechat,
      requiredSpecification, targetDelivery, destinationPort,
    } = req.body;

    let parsedDetails = details;
    if (typeof details === 'string') {
      try {
        parsedDetails = JSON.parse(details);
      } catch (e) {
        parsedDetails = details;
      }
    }

    let brochureUrl = '';
    let brochureName = '';

    if (req.file) {
      brochureName = req.file.originalname;
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'maple_ag_global/brochures',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file!.buffer);
        });
        brochureUrl = uploadResult?.secure_url || '';
      } catch (cloudErr) {
        console.error('Cloudinary file upload error:', cloudErr);
      }
    }

    const inquiryData: any = {
      name, email, phone, company,
      type: type || 'quote',
      category: category || 'export',
      inquiryType: inquiryType || 'Export Quote Request',
      product, quantity, details: parsedDetails, message,
      country, companyWebsite, companyAddress, deliveryAddress,
      designation, whatsapp, wechat,
      requiredSpecification, targetDelivery, destinationPort,
    };

    if (brochureUrl) inquiryData.brochureUrl = brochureUrl;
    if (brochureName) inquiryData.brochureName = brochureName;

    const inquiry = await Inquiry.create(inquiryData);

    // Send email notification via nodemailer to Admin Email
    try {
      const admin = await Admin.findOne({});
      const recipientEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || admin?.email;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS?.replace(/"/g, ''),
        },
      });

      const actualInquiryType = inquiryData.inquiryType;
      const isImage = brochureName && /\.(jpg|jpeg|png|webp|avif)$/i.test(brochureName);

      // Attachment section HTML
      let attachmentHtml = '';
      if (brochureName || brochureUrl) {
        attachmentHtml = `
          <div style="margin: 20px 0; background-color: #F0FDFA; border: 1px solid #99F6E4; border-radius: 8px; padding: 16px;">
            <h4 style="margin: 0 0 8px 0; color: #0A4D48; font-size: 14px; font-weight: bold; text-transform: uppercase;">
              📎 Specification / Document Attachment
            </h4>
            <p style="margin: 0 0 10px 0; color: #333; font-size: 13px;">
              <strong>File Name:</strong> ${escapeHtml(brochureName) || 'Submitted Document'}
            </p>
            ${isImage ? `
              <div style="margin-bottom: 12px;">
                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; font-weight: bold; text-transform: uppercase;">Image Preview:</p>
                <a href="${escapeHtml(brochureUrl) || '#'}" target="_blank" style="display: block;">
                  <img src="${escapeHtml(brochureUrl) || 'cid:brochure_image'}" alt="${escapeHtml(brochureName)}" style="max-width: 100%; max-height: 350px; border-radius: 6px; border: 1px solid #d0d0d0; object-fit: contain; background: #ffffff;" />
                </a>
              </div>
            ` : ''}
            ${brochureUrl ? `
              <div style="margin-top: 10px;">
                <a href="${escapeHtml(brochureUrl)}" target="_blank" style="display: inline-block; background-color: #0A4D48; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 5px; font-size: 13px; font-weight: bold; letter-spacing: 0.3px;">
                  ⬇ View / Download Document
                </a>
              </div>
            ` : `
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666; font-style: italic;">
                (File is attached directly to this email)
              </p>
            `}
          </div>
        `;
      }

      // Unified Export Product Quote Request email
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0A4D48 0%, #0E6B63 100%); padding: 24px 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">${escapeHtml(actualInquiryType)}</h2>
            <p style="color: #99F6E4; margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">Recycled Plastic Materials</p>
          </div>
          
          <div style="padding: 20px;">
            <h4 style="color: #1A2332; border-bottom: 2px solid #2E86AB; padding-bottom: 5px; margin-top: 0;">Product Information</h4>
            <p style="margin: 4px 0;"><strong>Product:</strong> ${escapeHtml(product) || 'N/A'}</p>
            ${requiredSpecification ? `<p style="margin: 4px 0;"><strong>Required Specification:</strong> ${escapeHtml(requiredSpecification)}</p>` : ''}

            <h4 style="color: #1A2332; border-bottom: 2px solid #2E86AB; padding-bottom: 5px; margin-top: 20px;">Company Information</h4>
            <p style="margin: 4px 0;"><strong>Country:</strong> ${escapeHtml(country) || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>Company Name:</strong> ${escapeHtml(company) || 'N/A'}</p>
            ${companyWebsite ? `<p style="margin: 4px 0;"><strong>Company Website:</strong> <a href="${escapeHtml(companyWebsite)}">${escapeHtml(companyWebsite)}</a></p>` : ''}
            ${companyAddress ? `<p style="margin: 4px 0;"><strong>Company Address:</strong> ${escapeHtml(companyAddress)}</p>` : ''}
            ${deliveryAddress ? `<p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${escapeHtml(deliveryAddress)}</p>` : ''}

            <h4 style="color: #1A2332; border-bottom: 2px solid #2E86AB; padding-bottom: 5px; margin-top: 20px;">Representative Information</h4>
            <p style="margin: 4px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            ${designation ? `<p style="margin: 4px 0;"><strong>Designation:</strong> ${escapeHtml(designation)}</p>` : ''}
            <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            ${phone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
            ${whatsapp ? `<p style="margin: 4px 0;"><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>` : ''}
            ${wechat ? `<p style="margin: 4px 0;"><strong>WeChat:</strong> ${escapeHtml(wechat)}</p>` : ''}

            ${attachmentHtml}

            <h4 style="color: #1A2332; border-bottom: 2px solid #2E86AB; padding-bottom: 5px; margin-top: 20px;">Quote Requirements</h4>
            ${quantity ? `<p style="margin: 4px 0;"><strong>Estimated Quantity / Volume:</strong> ${escapeHtml(quantity)}</p>` : ''}
            ${targetDelivery ? `<p style="margin: 4px 0;"><strong>Target Delivery:</strong> ${escapeHtml(targetDelivery)}</p>` : ''}
            ${destinationPort ? `<p style="margin: 4px 0;"><strong>Destination Port:</strong> ${escapeHtml(destinationPort)}</p>` : ''}
            <p style="margin: 4px 0;"><strong>Message / Enquiry:</strong></p>
            <div style="background: #F5F7F8; padding: 12px; border-left: 3px solid #0A4D48; border-radius: 4px; margin-top: 4px;">${message}</div>

            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 11px; color: #888; text-align: center;">Received via Export Quote Portal</p>
          </div>
        </div>
      `;

      const attachments: any[] = [];
      if (req.file) {
        const attachmentObj: any = {
          filename: req.file.originalname,
          content: req.file.buffer,
        };
        if (isImage) {
          attachmentObj.cid = 'brochure_image';
        }
        attachments.push(attachmentObj);
      } else if (brochureUrl) {
        attachments.push({
          filename: brochureName || 'document',
          path: brochureUrl,
        });
      }

      const mailOptions: any = {
        from: `"${escapeHtml(name)}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `Export Quote Request – ${escapeHtml(product) || escapeHtml(name)}`,
        text: `Export Quote Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nCompany: ${company || 'N/A'}\nCountry: ${country || 'N/A'}\nProduct: ${product || 'N/A'}\nQuantity: ${quantity || 'N/A'}\nDestination Port: ${destinationPort || 'N/A'}\nMessage: ${message}`,
        html: htmlContent,
      };

      if (attachments.length > 0) {
        mailOptions.attachments = attachments;
      }

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    sendResponse(res, 201, inquiry, 'Quote request submitted successfully');
  } catch (error) {
    next(error);
  }
};

export const getAllInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    sendResponse(res, 200, inquiries);
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
    if (!inquiry) {
      return sendResponse(res, 404, null, 'Inquiry not found');
    }
    sendResponse(res, 200, inquiry, 'Inquiry status updated');
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return sendResponse(res, 404, null, 'Inquiry not found');
    }
    sendResponse(res, 200, null, 'Inquiry deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const replyToInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return sendResponse(res, 400, null, 'Reply message cannot be empty');
    }

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return sendResponse(res, 404, null, 'Inquiry not found');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/"/g, ''),
      },
    });

    const companyName = process.env.COMPANY_NAME || 'Bismillah Plastic';
    const mailOptions = {
      from: `"${companyName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: inquiry.email,
      subject: `Re: Quote Request regarding ${inquiry.product || 'your inquiry'}`,
      text: `Hello ${inquiry.name},\n\n${message}\n\nBest regards,\n${companyName} Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0A4D48 0%, #0E6B63 100%); padding: 20px; text-align: center;">
            <h3 style="color: #ffffff; margin: 0; font-size: 18px;">Response to Your Quote Request</h3>
          </div>
          <div style="padding: 20px;">
            <p style="color: #444; line-height: 1.6;">Dear <strong>${escapeHtml(inquiry.name)}</strong>,</p>
            <div style="background-color: #F5F7F8; padding: 15px; border-left: 4px solid #2E86AB; border-radius: 4px; margin: 20px 0; color: #333; line-height: 1.6;">${message}</div>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #888;">Thank you for contacting ${escapeHtml(companyName)}. If you have further questions, feel free to reply directly to this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    inquiry.status = 'replied';
    await inquiry.save();

    sendResponse(res, 200, inquiry, 'Reply sent successfully to customer email');
  } catch (error) {
    next(error);
  }
};
