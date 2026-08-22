import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  offices: {
    headOffice: {
      name: { type: String, default: "Head Office" },
      address: { type: String, default: "" },
    },
    corporateOffice: {
      name: { type: String, default: "Corporate Office" },
      address: { type: String, default: "" },
    },
    portOffice: {
      name: { type: String, default: "Port Office" },
      address: { type: String, default: "" },
    }
  },
  contactDetails: {
    directLinesTitle: { type: String, default: "Direct Lines" },
    phones: [{ type: String }],
    emails: [{ type: String }],
  },
  socialMedia: {
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  location: {
    googleMapsUrl: { type: String, default: "" },
  }
}, { timestamps: true });

export const ContactInfo = mongoose.model('ContactInfo', schema);
