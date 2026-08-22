import mongoose, { Schema, Document } from 'mongoose';

export interface IMarker {
  name: string;
  type: string;
  description?: string;
  topProducts?: string;
}

export interface ICountry extends mongoose.Document {
  name: string;
  keyProducts?: string;
  region?: string;
  markers: mongoose.Types.DocumentArray<IMarker & mongoose.Document>;
}

export interface INetworkCategory extends Document {
  name: 'Export' | 'Import' | 'Supply';
  mapImage: string;
  countries: mongoose.Types.DocumentArray<ICountry>;
}

const markerSchema = new Schema<IMarker>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, default: '' },
  topProducts: { type: String, default: '' },
});

const countrySchema = new Schema<ICountry>({
  name: { type: String, required: true },
  keyProducts: { type: String, default: '' },
  region: { type: String, default: '' },
  markers: { type: [markerSchema], default: [] },
});

const categorySchema = new Schema<INetworkCategory>(
  {
    name: { type: String, required: true, enum: ['Export', 'Import', 'Supply'], unique: true },
    mapImage: { type: String, default: '' },
    countries: { type: [countrySchema], default: [] },
  },
  { timestamps: true }
);

export const NetworkCategory = mongoose.model<INetworkCategory>('NetworkCategory', categorySchema);
