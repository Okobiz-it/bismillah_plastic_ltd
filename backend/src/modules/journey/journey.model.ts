import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  stepNo: { type: Number, required: true },
  year: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const Journey = mongoose.model('Journey', journeySchema);
