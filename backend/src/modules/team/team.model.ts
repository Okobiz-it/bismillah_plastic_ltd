import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String },
  linkedin: { type: String },
  whatsapp: { type: String },
  twitter: { type: String },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export const Team = mongoose.model('Team', schema);
