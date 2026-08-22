import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordOtp: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  resetPasswordLastRequestedAt: {
    type: Date,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpires: {
    type: Date,
  },
}, { timestamps: true });

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Admin = mongoose.model('Admin', adminSchema);

// Schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
