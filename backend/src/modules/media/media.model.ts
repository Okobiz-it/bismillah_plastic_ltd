import mongoose, { Schema, Document } from 'mongoose';

export type PhotoCategoryType =
  | 'plant-processing'
  | 'community-empowerment'
  | 'safety-training'
  | 'circularity-recovery';

export type VideoCategoryType =
  | 'operational-walkthrough'
  | 'impact-stories';

export interface IPhotoItem extends Document {
  imageUrl: string;
  caption?: string;
  category: PhotoCategoryType;
  order: number;
}

export interface IVideoItem extends Document {
  title: string;
  description: string;
  category: VideoCategoryType;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  order: number;
}

const photoItemSchema = new Schema<IPhotoItem>(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'plant-processing',
        'community-empowerment',
        'safety-training',
        'circularity-recovery',
      ],
      default: 'plant-processing',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const videoItemSchema = new Schema<IVideoItem>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['operational-walkthrough', 'impact-stories'],
      default: 'operational-walkthrough',
    },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PhotoItem = mongoose.model<IPhotoItem>('PhotoItem', photoItemSchema);
export const VideoItem = mongoose.model<IVideoItem>('VideoItem', videoItemSchema);
