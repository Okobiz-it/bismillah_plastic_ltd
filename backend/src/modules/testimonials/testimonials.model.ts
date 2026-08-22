import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorTitle: { type: String, required: true },
  quote: { type: String, required: true },
}, { timestamps: true });

export const Testimonial = mongoose.model('Testimonial', schema);
