import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // define schema fields here based on requirements
}, { timestamps: true });

export const HomeContent = mongoose.model('HomeContent', schema);
