import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  stepNo: { type: Number, default: 1 },
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const Goal = mongoose.model('Goal', schema);
