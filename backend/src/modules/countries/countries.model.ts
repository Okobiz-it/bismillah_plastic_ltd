import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String },
  coordinates: {
    cx: { type: Number, required: true }, // x coordinate or longitude mapping for SVG
    cy: { type: Number, required: true }, // y coordinate or latitude mapping for SVG
  }
}, { timestamps: true });

export const Country = mongoose.model('Country', schema);
