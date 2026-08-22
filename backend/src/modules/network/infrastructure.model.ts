import mongoose, { Schema, Document } from 'mongoose';

export interface IInfrastructureItem extends Document {
  imageUrl: string;
  caption?: string;
  order: number;
}

const infrastructureSchema = new Schema<IInfrastructureItem>(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const InfrastructureItem = mongoose.model<IInfrastructureItem>('InfrastructureItem', infrastructureSchema);
