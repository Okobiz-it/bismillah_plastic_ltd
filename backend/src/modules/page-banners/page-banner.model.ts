import mongoose from 'mongoose';

export interface IPageBanner {
  page: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

const pageBannerSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PageBanner = mongoose.model<IPageBanner>('PageBanner', pageBannerSchema);
