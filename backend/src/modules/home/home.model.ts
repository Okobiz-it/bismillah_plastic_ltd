import mongoose from 'mongoose';

const homeBannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const HomeBanner = mongoose.model('HomeBanner', homeBannerSchema);
