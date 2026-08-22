import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  certificateNumber: { type: String, default: '' },
  issuer: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  documentUrl: { type: String, default: '' },
}, { timestamps: true });

export const Certification = mongoose.model('Certification', schema);
