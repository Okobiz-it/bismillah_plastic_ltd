import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Category image is required'],
  },
  description: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
