/**
 * ============================================================================
 * DATABASE SEED SCRIPT FOR RECYCLED PLASTIC MANUFACTURER & EXPORTER
 * ============================================================================
 * 
 * Purpose:
 *   Creates a new database beside the existing "test" database on MongoDB Atlas
 *   and populates it with complete, realistic demo information for the single-purpose
 *   recycled plastic manufacturing & international export business model.
 * 
 * Safety:
 *   - Does NOT modify or overwrite your existing "test" database.
 *   - Connects to a dedicated database name (default: "maple_plastic_recycled_db").
 *   - You can customize the new database name via CLI argument or TARGET_DB_NAME env variable.
 * 
 * How to Run (AFTER MANUAL REVIEW):
 *   From the "backend" directory:
 *     npx tsx scripts/seed-recycled-plastic-db.ts
 * 
 *   Or with a custom database name:
 *     npx tsx scripts/seed-recycled-plastic-db.ts my_new_plastic_db
 * ============================================================================
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';

// Fix DNS resolution for Node/Atlas if required
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables from backend/.env or root/.env
const envPathBackend = path.resolve(process.cwd(), '.env');
const envPathRoot = path.resolve(process.cwd(), '../.env');

if (fs.existsSync(envPathBackend)) {
  dotenv.config({ path: envPathBackend });
} else if (fs.existsSync(envPathRoot)) {
  dotenv.config({ path: envPathRoot });
} else {
  dotenv.config();
}

// Target database name (default: "maple_plastic_recycled_db")
const CLI_DB_ARG = process.argv[2];
const TARGET_DB_NAME = CLI_DB_ARG || process.env.TARGET_DB_NAME || 'maple_plastic_recycled_db';

/**
 * Builds the MongoDB connection URI for the target database without modifying the cluster credentials.
 */
function getTargetMongoUri(baseUri: string, targetDb: string): string {
  if (!baseUri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  // Parse URI
  const url = new URL(baseUri.startsWith('mongodb+srv://') || baseUri.startsWith('mongodb://') ? baseUri : `mongodb://${baseUri}`);

  // Replace pathname with new database name
  url.pathname = `/${targetDb}`;

  return url.toString();
}

// ─── MODEL SCHEMAS ────────────────────────────────────────────────────────────

// 1. Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordOtp: String,
  resetPasswordExpires: Date,
  resetPasswordLastRequestedAt: Date,
  otpAttempts: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
}, { timestamps: true });

// 2. Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  description: { type: String, trim: true },
}, { timestamps: true });

// 3. Product Schema (Unified Recycled Plastic Specification Model)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  origin: { type: String, default: 'Bangladesh' },
  materialType: { type: String, default: '' },
  color: { type: String, default: '' },
  processingType: { type: String, default: '' },
  chipSize: { type: String, default: '' },
  gradeQuality: { type: String, default: '' },
  technicalSpecs: {
    iv: { type: String, default: '' },
    moisture: { type: String, default: '' },
    pvc: { type: String, default: '' },
    fines: { type: String, default: '' },
    contamination: { type: String, default: '' },
    bulkDensity: { type: String, default: '' },
    meltFlowIndex: { type: String, default: '' },
    otherParams: { type: String, default: '' },
  },
  sku: { type: String, default: '' },
  moq: { type: String, default: '' },
  leadTime: { type: String, default: '' },
  stockStatus: { type: String, default: 'Available' },
  packaging: { type: String, default: '' },
  paymentTerms: { type: String, default: '' },
  shippingTerms: { type: String, default: '' },
  monthlyProductionCapacity: { type: String, default: '' },
  availableCapacity: { type: String, default: '' },
  exportMarkets: { type: String, default: '' },
  applications: { type: String, default: '' },
  hsCode: { type: String, default: '' },
  certifications: { type: String, default: '' },
  specifications: { type: String, default: '' },
  tdsUrl: { type: String, default: '' },
  catalogueUrl: { type: String, default: '' },
}, { timestamps: true });

// 4. Page Settings & Service Models
const statSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['quality', 'manufacturing', 'sustainability', 'global-export'] },
  value: { type: String, required: true },
  label: { type: String, required: true },
}, { timestamps: true });

const headerSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true, enum: ['quality', 'manufacturing', 'sustainability', 'global-export'] },
  headline: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const categoryItemSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['quality', 'manufacturing', 'sustainability', 'global-export'] },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

// 5. Certification Schema
const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

// 6. Client Schema
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

// 7. Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorTitle: { type: String, required: true },
  quote: { type: String, required: true },
}, { timestamps: true });

// 8. Team Schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String },
  linkedin: { type: String },
  whatsapp: { type: String },
  twitter: { type: String },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

// 9. Contact Info Schema
const contactInfoSchema = new mongoose.Schema({
  offices: {
    headOffice: {
      name: { type: String, default: "Head Office" },
      address: { type: String, default: "" },
    },
    corporateOffice: {
      name: { type: String, default: "Factory Facility" },
      address: { type: String, default: "" },
    },
    portOffice: {
      name: { type: String, default: "Port Logistics Hub" },
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

// 10. Goals & Journey Schemas
const goalSchema = new mongoose.Schema({
  stepNo: { type: Number, default: 1 },
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const journeySchema = new mongoose.Schema({
  stepNo: { type: Number, required: true },
  year: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

// 11. Settings Schema
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

// 12. Inquiry Schema (RFQ Model)
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  companyWebsite: { type: String },
  companyAddress: { type: String },
  deliveryAddress: { type: String },
  country: { type: String },
  designation: { type: String },
  whatsapp: { type: String },
  wechat: { type: String },
  product: { type: String },
  quantity: { type: String },
  requiredSpecification: { type: String },
  targetDelivery: { type: String },
  destinationPort: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'in_review', 'responded', 'closed'], default: 'new' },
  inquiryType: { type: String, enum: ['General Inquiry', 'Export Quote Request', 'Partnership Request', 'Custom Processing RFQ'], default: 'Export Quote Request' },
}, { timestamps: true });

// ─── DEMO DATA DEFINITIONS ───────────────────────────────────────────────────

const CLOUDINARY_IMAGES = {
  PET_CLEAR: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
  HDPE_GRANULES: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  PP_CHIPS: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
  FACTORY_HERO: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
  LAB_TESTING: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
  PORT_EXPORT: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
  SUSTAINABILITY: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
  LOGO: "https://res.cloudinary.com/wpttnkjq/image/upload/v1787213139/BP_-1_hmnpuw.png",
  AVATAR_1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  AVATAR_2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  AVATAR_3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  AVATAR_4: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
};

export async function seedNewDatabase() {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) {
    console.error('❌ Error: MONGODB_URI is not set in your .env file.');
    process.exit(1);
  }

  const targetUri = getTargetMongoUri(baseUri, TARGET_DB_NAME);

  console.log('=================================================================');
  console.log('🌱 RECYCLED PLASTIC MANUFACTURING - DATABASE SEED SCRIPT');
  console.log('=================================================================');
  console.log(`📡 Cluster Base Host: ${new URL(baseUri.startsWith('mongodb') ? baseUri : `mongodb://${baseUri}`).host}`);
  console.log(`🎯 Target New Database: "${TARGET_DB_NAME}"`);
  console.log(`🛡️  Existing "test" DB will remain completely untouched.`);
  console.log('=================================================================\n');

  try {
    console.log(`⏳ Connecting to MongoDB database "${TARGET_DB_NAME}"...`);
    const conn = await mongoose.connect(targetUri);
    console.log(`✅ Connected successfully to: ${conn.connection.name}\n`);

    const db = conn.connection.db;
    if (!db) {
      throw new Error('Database connection object is undefined.');
    }

    // Register Models on this connection
    const AdminModel = mongoose.model('Admin', adminSchema);
    const CategoryModel = mongoose.model('Category', categorySchema);
    const ProductModel = mongoose.model('Product', productSchema);
    const ServiceStatModel = mongoose.model('ServiceStat', statSchema);
    const ServiceHeaderModel = mongoose.model('ServiceHeader', headerSchema);
    const ServiceCategoryItemModel = mongoose.model('ServiceCategoryItem', categoryItemSchema);
    const CertificationModel = mongoose.model('Certification', certificationSchema);
    const ClientModel = mongoose.model('Client', clientSchema);
    const TestimonialModel = mongoose.model('Testimonial', testimonialSchema);
    const TeamModel = mongoose.model('Team', teamSchema);
    const ContactInfoModel = mongoose.model('ContactInfo', contactInfoSchema);
    const GoalModel = mongoose.model('Goal', goalSchema);
    const JourneyModel = mongoose.model('Journey', journeySchema);
    const SettingsModel = mongoose.model('Settings', settingsSchema);
    const InquiryModel = mongoose.model('Inquiry', inquirySchema);

    // 1. ADMIN USER
    console.log('👤 Seeding Admin User...');
    await AdminModel.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123456', salt);
    await AdminModel.create({
      email: 'admin@bismillahplastic.com',
      password: hashedPassword,
    });
    console.log('   ✓ Admin user created: admin@mapleagglobal.com (Password: Admin@123456)');

    // 2. PRODUCT CATEGORIES
    console.log('📁 Seeding Product Categories...');
    await CategoryModel.deleteMany({});
    const categories = await CategoryModel.insertMany([
      {
        name: 'PET Flakes (Polyethylene Terephthalate)',
        description: 'Premium hot-washed recycled PET flakes for polyester staple fiber (PSF), strapping, and bottle-to-bottle applications.',
        imageUrl: CLOUDINARY_IMAGES.PET_CLEAR,
      },
      {
        name: 'HDPE Regrind & Granules (High-Density Polyethylene)',
        description: 'Rigid HDPE regrind and reprocessed pellets optimized for blow molding, extrusion pipes, and durable containers.',
        imageUrl: CLOUDINARY_IMAGES.HDPE_GRANULES,
      },
      {
        name: 'PP Chips & Pellets (Polypropylene)',
        description: 'High-purity recycled polypropylene chips and granules for injection molding, woven sacks, and automotive parts.',
        imageUrl: CLOUDINARY_IMAGES.PP_CHIPS,
      },
      {
        name: 'LDPE Reprocessed Granules (Low-Density Polyethylene)',
        description: 'Clean recycled LDPE granules suitable for agricultural film, liner extrusion, and flexible packaging.',
        imageUrl: CLOUDINARY_IMAGES.HDPE_GRANULES,
      }
    ]);
    console.log(`   ✓ Inserted ${categories.length} product categories.`);

    // 3. PRODUCTS (Material Specifications & Industrial Specs)
    console.log('📦 Seeding Products with Technical Specifications...');
    await ProductModel.deleteMany({});
    const products = await ProductModel.insertMany([
      {
        name: 'Hot Washed Clear PET Flakes',
        category: 'PET Flakes (Polyethylene Terephthalate)',
        description: 'Superior quality transparent clear PET flakes, processed with multi-stage caustic hot wash, friction wash, and flotation density separation. Ideal for spinning Polyester Staple Fiber (PSF) and filament yarn.',
        imageUrl: CLOUDINARY_IMAGES.PET_CLEAR,
        images: [CLOUDINARY_IMAGES.PET_CLEAR, CLOUDINARY_IMAGES.LAB_TESTING],
        featured: true,
        origin: 'Bangladesh',
        materialType: '100% Post-Consumer Recycled PET (rPET)',
        color: 'Clear / Transparent',
        processingType: 'Caustic Hot Washed & Flotation Separated',
        chipSize: '10 mm - 12 mm Flakes',
        gradeQuality: 'Grade A (Spinning & Filament Grade)',
        technicalSpecs: {
          iv: '0.74 - 0.78 dl/g',
          moisture: '< 1.0%',
          pvc: '< 50 ppm (0.005%)',
          fines: '< 0.5% (Size < 2mm)',
          contamination: 'Zero metal, glue residue < 30 ppm',
          bulkDensity: '0.35 - 0.40 g/cm³',
          meltFlowIndex: 'N/A (Intrinsic Viscosity Controlled)',
          otherParams: 'Melting Point: 250°C - 255°C, Flotation Floatables: < 10 ppm',
        },
        sku: 'PET-HW-CLR-01',
        moq: '25 Metric Tons (1 x 40ft HQ Container)',
        leadTime: '10 - 15 business days from L/C confirmation',
        stockStatus: 'Available / Active Production',
        packaging: '1,000 kg PP Woven Jumbo Bags with PE inner liner (Moisture-proof)',
        paymentTerms: '100% Irrevocable Confirmed L/C at sight, or T/T (30% deposit, 70% against B/L)',
        shippingTerms: 'FOB Chattogram Port, CFR, or CIF Global Destination Ports',
        monthlyProductionCapacity: '800 Metric Tons / Month',
        availableCapacity: '350 Metric Tons / Month',
        exportMarkets: 'Europe (Germany, Italy, Poland), Turkey, Vietnam, India, North America',
        applications: 'Polyester Staple Fiber (PSF), Filament Yarn, PET Strapping Bands, Thermoforming Sheets',
        hsCode: '3907.61.00',
        certifications: 'ISO 9001:2015, GRS (Global Recycled Standard), REACH Compliance',
        specifications: 'Consistent IV, low moisture, laboratory tested per batch.',
      },
      {
        name: 'Hot Washed Light Blue PET Flakes',
        category: 'PET Flakes (Polyethylene Terephthalate)',
        description: 'Clean, color-sorted light blue PET bottle flakes. Thoroughly decontaminated and dried to exact industrial standards for fiber and non-woven manufacturing.',
        imageUrl: CLOUDINARY_IMAGES.PET_CLEAR,
        images: [CLOUDINARY_IMAGES.PET_CLEAR],
        featured: true,
        origin: 'Bangladesh',
        materialType: 'Recycled PET (rPET)',
        color: 'Light Blue / Aqua',
        processingType: 'Hot Washed & Centrifugally Dried',
        chipSize: '8 mm - 12 mm Flakes',
        gradeQuality: 'Grade A (Fiber Grade)',
        technicalSpecs: {
          iv: '0.72 - 0.76 dl/g',
          moisture: '< 1.0%',
          pvc: '< 60 ppm',
          fines: '< 0.8%',
          contamination: 'No label paper, zero metal contamination',
          bulkDensity: '0.36 g/cm³',
          meltFlowIndex: 'Controlled Intrinsic Viscosity',
          otherParams: 'Melting Point: 248°C - 254°C',
        },
        sku: 'PET-HW-BLU-02',
        moq: '25 Metric Tons (1 x 40ft HQ)',
        leadTime: '12 - 18 business days',
        stockStatus: 'Available',
        packaging: '1,000 kg Jumbo Bags on Pallets',
        paymentTerms: 'L/C at Sight or T/T',
        shippingTerms: 'FOB Chattogram / CIF Worldwide',
        monthlyProductionCapacity: '400 Metric Tons / Month',
        availableCapacity: '180 Metric Tons / Month',
        exportMarkets: 'Turkey, South Korea, EU, Middle East',
        applications: 'Non-woven Geo-textiles, Polyester Staple Fiber, Fillings',
        hsCode: '3907.61.00',
        certifications: 'ISO 9001:2015, GRS',
      },
      {
        name: 'HDPE Regrind - Natural & Milky White',
        category: 'HDPE Regrind & Granules (High-Density Polyethylene)',
        description: 'Washed and granulator-crushed HDPE flakes sourced from clean post-consumer milk and detergent bottles. De-dusted with uniform particle size distribution.',
        imageUrl: CLOUDINARY_IMAGES.HDPE_GRANULES,
        images: [CLOUDINARY_IMAGES.HDPE_GRANULES],
        featured: true,
        origin: 'Bangladesh',
        materialType: 'High-Density Polyethylene (rHDPE)',
        color: 'Natural / Milky White',
        processingType: 'Cold Wash, Friction Cleaned & Multi-stage Aspirated',
        chipSize: '6 mm - 10 mm Regrind',
        gradeQuality: 'Blow Molding & Extrusion Grade',
        technicalSpecs: {
          iv: 'N/A',
          moisture: '< 0.5%',
          pvc: '0 ppm (PVC-Free Sourcing)',
          fines: '< 1.0%',
          contamination: 'Purity > 99.5%',
          bulkDensity: '0.45 - 0.50 g/cm³',
          meltFlowIndex: '0.8 - 1.2 g/10 min (190°C / 2.16 kg)',
          otherParams: 'Density: 0.952 - 0.958 g/cm³, Tensile Strength: 24 MPa',
        },
        sku: 'HDPE-REG-NAT-01',
        moq: '20 Metric Tons (1 x 20ft Container)',
        leadTime: '10 business days',
        stockStatus: 'Available',
        packaging: '25 kg PP Bags or 1,000 kg Bulk Jumbo Bags',
        paymentTerms: 'L/C at Sight, T/T',
        shippingTerms: 'FOB Chattogram / CIF Port',
        monthlyProductionCapacity: '300 Metric Tons / Month',
        availableCapacity: '120 Metric Tons / Month',
        exportMarkets: 'Vietnam, Malaysia, China, Germany',
        applications: 'Blow Molding Bottles, Jerry Cans, Corrugated Pipes, Drainage Conduits',
        hsCode: '3901.20.00',
        certifications: 'ISO 9001:2015, RoHS Compliant',
      },
      {
        name: 'HDPE Reprocessed Pellets - Blue & Mixed Colors',
        category: 'HDPE Regrind & Granules (High-Density Polyethylene)',
        description: 'Melt-filtered and strand-pelletized HDPE granules. Continuous dual-screen melt filtration removes microscopic impurities for smooth extrusion output.',
        imageUrl: CLOUDINARY_IMAGES.HDPE_GRANULES,
        images: [CLOUDINARY_IMAGES.HDPE_GRANULES],
        featured: false,
        origin: 'Bangladesh',
        materialType: 'Recycled HDPE Pellets',
        color: 'Ocean Blue / Uniform Color',
        processingType: 'Extruded & Die-Face Pelletized (Double Filtration 100 Mesh)',
        chipSize: '3 mm - 4 mm Cylindrical / Spherical Pellets',
        gradeQuality: 'Extrusion & Pipe Grade',
        technicalSpecs: {
          iv: 'N/A',
          moisture: '< 0.2%',
          pvc: '0 ppm',
          fines: 'Zero Fines (Pelletized)',
          contamination: 'Zero particulate contamination',
          bulkDensity: '0.55 g/cm³',
          meltFlowIndex: '0.4 - 0.7 g/10 min (190°C / 5.0 kg)',
          otherParams: 'Density: 0.955 g/cm³, Carbon Black dispersion available upon request',
        },
        sku: 'HDPE-PEL-BLU-02',
        moq: '20 Metric Tons',
        leadTime: '14 business days',
        stockStatus: 'Available',
        packaging: '25 kg PE/PP laminated bags on shrink-wrapped pallets',
        paymentTerms: 'L/C at Sight, T/T',
        shippingTerms: 'FOB / CIF',
        monthlyProductionCapacity: '250 Metric Tons / Month',
        availableCapacity: '100 Metric Tons / Month',
        exportMarkets: 'Middle East, Southeast Asia, South Asia',
        applications: 'HDPE Irrigation Pipes, Cable Ducting, Crates, Industrial Pallets',
        hsCode: '3901.20.00',
        certifications: 'ISO 9001:2015',
      },
      {
        name: 'Polypropylene (PP) Injection Grade Chips - Black',
        category: 'PP Chips & Pellets (Polypropylene)',
        description: 'Reprocessed black polypropylene chips and granules with high impact strength and excellent melt flow characteristics for fast-cycle injection molding.',
        imageUrl: CLOUDINARY_IMAGES.PP_CHIPS,
        images: [CLOUDINARY_IMAGES.PP_CHIPS],
        featured: false,
        origin: 'Bangladesh',
        materialType: 'Recycled Polypropylene (rPP)',
        color: 'Jet Black (Uniform Masterbatch Dispersion)',
        processingType: 'Melt Blended & Strand Pelletized',
        chipSize: '3 mm - 4 mm Granules',
        gradeQuality: 'High Impact Injection Grade',
        technicalSpecs: {
          iv: 'N/A',
          moisture: '< 0.3%',
          pvc: '0 ppm',
          fines: '< 0.2%',
          contamination: 'Ash Content < 1.8%',
          bulkDensity: '0.52 g/cm³',
          meltFlowIndex: '12 - 16 g/10 min (230°C / 2.16 kg)',
          otherParams: 'Flexural Modulus: 1250 MPa, Izod Impact: 5.2 kJ/m²',
        },
        sku: 'PP-INJ-BLK-01',
        moq: '20 Metric Tons',
        leadTime: '10 business days',
        stockStatus: 'Available',
        packaging: '25 kg valve bags, 40 bags per pallet (1 MT)',
        paymentTerms: 'L/C at Sight or T/T',
        shippingTerms: 'FOB Chattogram / CIF Global',
        monthlyProductionCapacity: '350 Metric Tons / Month',
        availableCapacity: '150 Metric Tons / Month',
        exportMarkets: 'Europe, South America, Asia',
        applications: 'Automotive Battery Casings, Furniture Parts, Crates, Household Buckets, Planter Pots',
        hsCode: '3902.10.00',
        certifications: 'ISO 9001:2015, RoHS',
      },
      {
        name: 'PP Extrusion Flakes & Chips - Natural',
        category: 'PP Chips & Pellets (Polypropylene)',
        description: 'Uncolored natural PP flakes from post-industrial and clean post-consumer sorting. High tensile elongation suitable for tape stretching and woven fabric.',
        imageUrl: CLOUDINARY_IMAGES.PP_CHIPS,
        images: [CLOUDINARY_IMAGES.PP_CHIPS],
        featured: false,
        origin: 'Bangladesh',
        materialType: 'Recycled Polypropylene (rPP)',
        color: 'Natural / Semi-Translucent',
        processingType: 'Aspiration & Friction Washed',
        chipSize: '6 mm - 10 mm Flakes',
        gradeQuality: 'Extrusion / Raffia Grade',
        technicalSpecs: {
          iv: 'N/A',
          moisture: '< 0.5%',
          pvc: '0 ppm',
          fines: '< 0.8%',
          contamination: 'Zero cross-polymer contamination',
          bulkDensity: '0.40 g/cm³',
          meltFlowIndex: '3.0 - 5.0 g/10 min (230°C / 2.16 kg)',
          otherParams: 'Tensile Strength: 32 MPa',
        },
        sku: 'PP-EXT-NAT-02',
        moq: '20 Metric Tons',
        leadTime: '12 business days',
        stockStatus: 'Available',
        packaging: '1,000 kg Jumbo Bags',
        paymentTerms: 'L/C at Sight, T/T',
        shippingTerms: 'FOB / CIF',
        monthlyProductionCapacity: '200 Metric Tons / Month',
        availableCapacity: '80 Metric Tons / Month',
        exportMarkets: 'India, Turkey, Egypt',
        applications: 'PP Woven Bags, Strapping, Geotextile Ribbons, Compounding Feedstock',
        hsCode: '3902.10.00',
        certifications: 'ISO 9001:2015',
      }
    ]);
    console.log(`   ✓ Inserted ${products.length} products with complete specs.`);

    // 4. PAGE SETTINGS (Quality, Manufacturing, Sustainability, Global Export)
    console.log('📑 Seeding Dynamic Page Settings (Headers, Stats & Category Items)...');
    await ServiceHeaderModel.deleteMany({});
    await ServiceStatModel.deleteMany({});
    await ServiceCategoryItemModel.deleteMany({});

    // Headers
    await ServiceHeaderModel.insertMany([
      {
        category: 'quality',
        headline: 'Rigorous Quality Control & Continuous Lab Testing',
        description: 'Every batch of recycled plastic flakes and chips is tested for Intrinsic Viscosity (IV), moisture content, PVC contamination, and particle purity before packing and container loading.',
      },
      {
        category: 'manufacturing',
        headline: 'Advanced Industrial Recycling & Processing Technology',
        description: 'Our factory in Gazipur operates European-standard hot washing systems, optical color sorters, and dual-filtration extrusion lines to turn post-consumer plastic into virgin-grade feedstock.',
      },
      {
        category: 'sustainability',
        headline: 'Driving the Circular Economy Across Global Supply Chains',
        description: 'By converting tons of discarded plastic bottles and rigid containers into industrial raw materials each month, we reduce carbon footprint and support global manufacturers committed to sustainable sourcing.',
      },
      {
        category: 'global-export',
        headline: 'Reliable Containerized Export from Chattogram Port to the World',
        description: 'We manage the complete export logistics pipeline, providing standardized moisture-proof packaging, strict inspection documentation, and flexible FOB / CIF shipping terms worldwide.',
      }
    ]);

    // Stats (4 per page)
    await ServiceStatModel.insertMany([
      // Quality stats
      { category: 'quality', value: '< 50 ppm', label: 'Max PVC Contamination' },
      { category: 'quality', value: '99.8%', label: 'Flake Purity Standard' },
      { category: 'quality', value: '100%', label: 'Batch Lab Certified' },
      { category: 'quality', value: 'ISO 9001', label: 'Quality Management System' },

      // Manufacturing stats
      { category: 'manufacturing', value: '1,200 MT', label: 'Monthly Production Capacity' },
      { category: 'manufacturing', value: '4-Stage', label: 'Hot Caustic Washing' },
      { category: 'manufacturing', value: 'Gazipur', label: 'Primary Manufacturing Facility' },
      { category: 'manufacturing', value: '24/7', label: 'Automated Continuous Lines' },

      // Sustainability stats
      { category: 'sustainability', value: '15,000 MT', label: 'Plastic Waste Diverted Annually' },
      { category: 'sustainability', value: '65%', label: 'CO2 Savings vs Virgin Resin' },
      { category: 'sustainability', value: '100%', label: 'Closed-Loop Circular Feedstock' },
      { category: 'sustainability', value: 'Zero', label: 'Chemical Wastewater Discharge (ETP)' },

      // Global Export stats
      { category: 'global-export', value: '25+', label: 'International Export Markets' },
      { category: 'global-export', value: 'FOB / CIF', label: 'Flexible Global Incoterms' },
      { category: 'global-export', value: '1,000 kg', label: 'Moisture-Barrier Jumbo Bags' },
      { category: 'global-export', value: 'Chattogram', label: 'Primary Deep-Sea Export Port' },
    ]);

    // Category Items (Highlights / Image cards)
    await ServiceCategoryItemModel.insertMany([
      { category: 'quality', title: 'Automated Optical Flake Sorters', imageUrl: CLOUDINARY_IMAGES.LAB_TESTING },
      { category: 'quality', title: 'Lab Viscometer & Moisture Analyzers', imageUrl: CLOUDINARY_IMAGES.LAB_TESTING },
      { category: 'quality', title: 'Density Separation Flotation Tanks', imageUrl: CLOUDINARY_IMAGES.FACTORY_HERO },
      { category: 'manufacturing', title: 'High-Temperature Caustic Hot Wash Line', imageUrl: CLOUDINARY_IMAGES.FACTORY_HERO },
      { category: 'manufacturing', title: 'Continuous Granulation & Centrifugal Dryers', imageUrl: CLOUDINARY_IMAGES.HDPE_GRANULES },
      { category: 'manufacturing', title: 'Dual-Screen Melt Extrusion & Pelletizing', imageUrl: CLOUDINARY_IMAGES.PP_CHIPS },
      { category: 'sustainability', title: 'Post-Consumer PET Bottle Collection Network', imageUrl: CLOUDINARY_IMAGES.SUSTAINABILITY },
      { category: 'sustainability', title: 'Biological & Chemical ETP Water Recycling', imageUrl: CLOUDINARY_IMAGES.SUSTAINABILITY },
      { category: 'global-export', title: 'Chattogram Port Container Loading Facility', imageUrl: CLOUDINARY_IMAGES.PORT_EXPORT },
      { category: 'global-export', title: 'Moisture-Proof 1 MT Jumbo Bag Packing Station', imageUrl: CLOUDINARY_IMAGES.PET_CLEAR },
    ]);
    console.log('   ✓ Inserted page headers, 16 key statistics, and 10 feature highlights.');

    // 5. CERTIFICATIONS
    console.log('📜 Seeding Certifications...');
    await CertificationModel.deleteMany({});
    await CertificationModel.insertMany([
      {
        title: 'ISO 9001:2015',
        description: 'Certified Quality Management System for recycled plastic material manufacturing and processing.',
        imageUrl: CLOUDINARY_IMAGES.LAB_TESTING,
      },
      {
        title: 'ISO 14001:2015',
        description: 'Environmental Management Certification ensuring sustainable manufacturing practices and zero untreated emissions.',
        imageUrl: CLOUDINARY_IMAGES.SUSTAINABILITY,
      },
      {
        title: 'GRS (Global Recycled Standard)',
        description: 'Track and trace chain of custody certification verifying 100% recycled content in finished flakes and pellets.',
        imageUrl: CLOUDINARY_IMAGES.PET_CLEAR,
      },
      {
        title: 'REACH & RoHS Compliant',
        description: 'Declared compliant with European chemical safety regulations and hazardous substances restrictions.',
        imageUrl: CLOUDINARY_IMAGES.LAB_TESTING,
      },
      {
        title: 'EPB Bangladesh Registered Exporter',
        description: 'Official registration with the Export Promotion Bureau of the Government of Bangladesh for global trade.',
        imageUrl: CLOUDINARY_IMAGES.PORT_EXPORT,
      }
    ]);
    console.log('   ✓ Inserted 5 industrial certifications.');

    // 6. CLIENTS & BUYER PARTNERS
    console.log('🤝 Seeding Client Partners...');
    await ClientModel.deleteMany({});
    await ClientModel.insertMany([
      { name: 'Polymer Solutions Global (Germany)', imageUrl: CLOUDINARY_IMAGES.LOGO },
      { name: 'TexFiber Industries (Turkey)', imageUrl: CLOUDINARY_IMAGES.LOGO },
      { name: 'EcoPlast Manufacturing (Vietnam)', imageUrl: CLOUDINARY_IMAGES.LOGO },
      { name: 'EuroStrap Packaging B.V. (Netherlands)', imageUrl: CLOUDINARY_IMAGES.LOGO },
      { name: 'Apex Polymer Compounds (India)', imageUrl: CLOUDINARY_IMAGES.LOGO },
      { name: 'Pacific Recycled Resins (USA)', imageUrl: CLOUDINARY_IMAGES.LOGO },
    ]);
    console.log('   ✓ Inserted 6 global manufacturing client partners.');

    // 7. TESTIMONIALS
    console.log('💬 Seeding Testimonials...');
    await TestimonialModel.deleteMany({});
    await TestimonialModel.insertMany([
      {
        authorName: 'Dr. Klaus Becker',
        authorTitle: 'Procurement Director, EuroFiber SpA (Italy)',
        quote: 'We have been importing clear PET flakes from Bangladesh for over 2 years for our polyester fiber spinning operations. The IV consistency and extremely low PVC contamination levels rival European recyclers.',
      },
      {
        authorName: 'Mehmet Yilmaz',
        authorTitle: 'Head of Sourcing, Anatolia Packaging Ltd (Turkey)',
        quote: 'Finding reliable HDPE regrind with controlled melt flow and moisture has always been a challenge. Their Gazipur plant produces clean, uniform material with flawless container packing on every shipment.',
      },
      {
        authorName: 'Nguyen Van Thanh',
        authorTitle: 'Operations Manager, Mekong Polymer Corp (Vietnam)',
        quote: 'The export documentation from Chattogram Port is handled seamlessly, and their technical datasheets match laboratory tests on arrival. A truly professional manufacturing partner.',
      }
    ]);
    console.log('   ✓ Inserted 3 verified industrial buyer testimonials.');

    // 8. TEAM & PLANT LEADERSHIP
    console.log('👥 Seeding Plant & Executive Leadership Team...');
    await TeamModel.deleteMany({});
    await TeamModel.insertMany([
      {
        name: 'Farhan Rahman',
        position: 'Managing Director & Founder',
        description: '20+ years of industrial leadership in Bangladesh manufacturing and international trade, spearheading modern plastic recycling technology and export market expansion.',
        email: 'farhan.rahman@mapleagglobal.com',
        linkedin: 'https://linkedin.com/in/farhanrahman',
        whatsapp: '+8801700000000',
        twitter: '',
        imageUrl: CLOUDINARY_IMAGES.AVATAR_1,
      },
      {
        name: 'Engr. Tanvir Ahmed',
        position: 'Head of Plant Operations & Quality Assurance',
        description: 'Polymer Chemical Engineer with 15 years experience supervising multi-stage hot washing lines, optical flake sorters, and industrial extrusion facilities.',
        email: 'tanvir.ahmed@mapleagglobal.com',
        linkedin: 'https://linkedin.com/in/tanvirahmed',
        whatsapp: '+8801800000000',
        twitter: '',
        imageUrl: CLOUDINARY_IMAGES.AVATAR_3,
      },
      {
        name: 'Sarah Jenkins',
        position: 'Director of International Export & Global Trade',
        description: 'Oversees ocean freight logistics, international customs compliance, and customer procurement relationships across Europe, the Americas, and Asia.',
        email: 'sarah.jenkins@mapleagglobal.com',
        linkedin: 'https://linkedin.com/in/sarahjenkins',
        whatsapp: '+8801900000000',
        twitter: '',
        imageUrl: CLOUDINARY_IMAGES.AVATAR_2,
      },
      {
        name: 'Md. Rafiqul Islam',
        position: 'Lead Polymer Chemist & Laboratory Manager',
        description: 'Directs the in-house quality control laboratory, managing viscometer calibration, ash testing, MFI analysis, and ISO compliance testing.',
        email: 'rafiqul.islam@mapleagglobal.com',
        linkedin: 'https://linkedin.com/in/rafiqulislam',
        whatsapp: '+8801600000000',
        twitter: '',
        imageUrl: CLOUDINARY_IMAGES.AVATAR_4,
      }
    ]);
    console.log('   ✓ Inserted 4 executive and plant leadership members.');

    // 9. CONTACT INFO
    console.log('📍 Seeding Official Contact Info...');
    await ContactInfoModel.deleteMany({});
    await ContactInfoModel.create({
      offices: {
        headOffice: {
          name: 'Main Location',
          address: 'Baluadangga, Chauliapotti, Dinajpur.',
        },
        corporateOffice: {
          name: '',
          address: '',
        },
        portOffice: {
          name: '',
          address: '',
        }
      },
      contactDetails: {
        directLinesTitle: 'Direct Inquiries',
        phones: ['+880 1842-084883'],
        emails: ['bismillahplastic76@gmail.com'],
      },
      socialMedia: {
        facebook: '',
        linkedin: '',
        youtube: '',
        whatsapp: 'https://wa.me/8801842084883',
      },
      location: {
        googleMapsUrl: 'https://maps.app.goo.gl/ykxLeK1hxsYVDpJ47',
      }
    });
    console.log('   ✓ Inserted contact info with Dinajpur location.');

    // 10. GOALS & MILESTONES
    console.log('🎯 Seeding Strategic Milestones & Company Journey...');
    await GoalModel.deleteMany({});
    await GoalModel.insertMany([
      { stepNo: 1, year: '2026', title: 'Plant Capacity Expansion', description: 'Scale Gazipur recycling line to 2,000 MT monthly capacity with automated robotic optical sorters.' },
      { stepNo: 2, year: '2027', title: 'Food-Grade rPET Line', description: 'Commission European solid-state polycondensation (SSP) unit for FDA/EFSA compliant bottle-to-bottle resin.' },
      { stepNo: 3, year: '2028', title: 'Direct European Logistics Hub', description: 'Establish regional bonded warehouse facilities in Rotterdam and Hamburg to shorten delivery lead times.' },
      { stepNo: 4, year: '2030', title: 'Full Circular Integration', description: 'Reach 50,000 MT annual plastic waste diversion, creating Bangladesh’s largest integrated recycling ecosystem.' },
    ]);

    await JourneyModel.deleteMany({});
    await JourneyModel.insertMany([
      { stepNo: 1, year: '2009', subject: 'Company Foundation', description: 'Founded as a dedicated recycling and industrial raw materials venture in Dhaka.' },
      { stepNo: 2, year: '2014', subject: 'First Hot-Wash Plant Commissioned', description: 'Invested in modern high-capacity caustic washing technology for clear PET flake production.' },
      { stepNo: 3, year: '2018', subject: 'Direct Export Milestone', description: 'Commenced direct international container exports of PET flakes to European and Asian fiber mills.' },
      { stepNo: 4, year: '2022', subject: 'Polyolefin Granulation Unit', description: 'Expanded Gazipur facility to include HDPE regrind and PP chip reprocessed pellet lines.' },
      { stepNo: 5, year: '2025', subject: 'ISO & GRS Certification', description: 'Attained ISO 9001:2015, ISO 14001:2015, and Global Recycled Standard accreditation.' },
    ]);
    console.log('   ✓ Inserted 4 future goals and 5 historical milestones.');

    // 11. GLOBAL SETTINGS
    console.log('⚙️  Seeding System Settings...');
    await SettingsModel.deleteMany({});
    await SettingsModel.insertMany([
      { key: 'companyName', value: 'Maple AG Global LTD' },
      { key: 'siteTagline', value: 'Recycled Plastic Materials — Manufactured in Bangladesh, Supplied Worldwide' },
      { key: 'rfqNotificationEmail', value: 'export@mapleagglobal.com' },
      { key: 'primaryCurrency', value: 'USD' },
    ]);
    console.log('   ✓ Inserted site settings.');

    // 12. SAMPLE INQUIRIES (RFQs)
    console.log('📩 Seeding Demo RFQ Inquiries...');
    await InquiryModel.deleteMany({});
    await InquiryModel.insertMany([
      {
        name: 'Hans Zimmer',
        email: 'hans.zimmer@eurofiber-textiles.de',
        phone: '+49 89 12345678',
        company: 'EuroFiber Textiles GmbH',
        companyWebsite: 'https://eurofiber-textiles.de',
        companyAddress: 'Industriestrasse 14, 80331 Munich, Germany',
        deliveryAddress: 'Hamburg Port Terminal (Warehouse 4B)',
        country: 'Germany',
        designation: 'Senior Procurement Manager',
        whatsapp: '+491711234567',
        product: 'Hot Washed Clear PET Flakes',
        quantity: '100 Metric Tons (4 x 40ft HQ Containers)',
        requiredSpecification: 'IV 0.76 dl/g, PVC < 50 ppm, Moisture < 1.0%',
        targetDelivery: '30 Days',
        destinationPort: 'Hamburg Port, Germany',
        message: 'We are looking for long-term monthly supply of hot washed clear PET flakes for our polyester spinning mill. Please send official FOB Chattogram and CIF Hamburg price quotations along with full TDS.',
        status: 'new',
        inquiryType: 'Export Quote Request',
      },
      {
        name: 'Le Thi Mai',
        email: 'mai.le@vietpolymer.vn',
        phone: '+84 28 3822 0000',
        company: 'VietPolymer Manufacturing JSC',
        companyWebsite: 'https://vietpolymer.vn',
        country: 'Vietnam',
        designation: 'Supply Chain Director',
        product: 'HDPE Regrind - Natural & Milky White',
        quantity: '50 Metric Tons',
        requiredSpecification: 'MFI 0.8 - 1.2, Density 0.955 g/cm³',
        targetDelivery: '15 - 20 Days',
        destinationPort: 'Cat Lai Port, Ho Chi Minh City',
        message: 'Interested in sourcing 50 MT/month of natural HDPE regrind for blow molding jerry cans. Requesting laboratory test certificates and 5 kg sample batch.',
        status: 'in_review',
        inquiryType: 'Export Quote Request',
      }
    ]);
    console.log('   ✓ Inserted 2 realistic demo RFQ inquiries.');

    console.log('\n=================================================================');
    console.log(`🎉 SUCCESS! All demo data has been populated into "${TARGET_DB_NAME}".`);
    console.log('=================================================================');
    console.log('Summary of Seeded Collections:');
    console.log('  • admins:                  1 Admin user (admin@mapleagglobal.com)');
    console.log('  • categories:              4 Recycled plastic categories');
    console.log('  • products:                6 Detailed products with lab specs');
    console.log('  • serviceheaders:          4 Page headers (Quality, Mfg, Sustainability, Export)');
    console.log('  • servicestats:            16 Key performance statistics');
    console.log('  • servicecategoryitems:    10 Facility and lab highlights');
    console.log('  • certifications:          5 Industrial certifications');
    console.log('  • clients:                 6 Global manufacturing clients');
    console.log('  • testimonials:            3 Verified buyer reviews');
    console.log('  • team:                    4 Plant and executive leaders');
    console.log('  • contactinfos:            1 Complete multi-office contact info');
    console.log('  • goals:                   4 Strategic milestones (2026-2030)');
    console.log('  • journeys:                5 Company growth milestones');
    console.log('  • settings:                Site configuration key-values');
    console.log('  • inquiries:               2 Realistic RFQ inquiries');
    console.log('=================================================================\n');

    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// If invoked directly from CLI, execute the seed process
if (process.argv[1] && process.argv[1].endsWith('seed-recycled-plastic-db.ts')) {
  seedNewDatabase();
}
