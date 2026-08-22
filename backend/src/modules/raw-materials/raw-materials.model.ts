import mongoose from 'mongoose';

const rawMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Raw material name is required'],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [250, 'Description cannot exceed 250 characters'],
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);
