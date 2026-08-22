import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['quality', 'manufacturing', 'sustainability', 'global-export']
  },
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
}, { timestamps: true });

const headerSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    enum: ['quality', 'manufacturing', 'sustainability', 'global-export']
  },
  headline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const partnerSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['quality', 'manufacturing', 'sustainability', 'global-export']
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const categoryItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['quality', 'manufacturing', 'sustainability', 'global-export']
  },
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const ServiceStat = mongoose.model('ServiceStat', statSchema);
export const ServiceHeader = mongoose.model('ServiceHeader', headerSchema);
export const ServicePartner = mongoose.model('ServicePartner', partnerSchema);
export const ServiceCategoryItem = mongoose.model('ServiceCategoryItem', categoryItemSchema);
