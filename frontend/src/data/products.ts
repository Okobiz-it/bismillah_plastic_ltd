export type ProductCategory =
  | "All"
  | "Textiles & Garments"
  | "Agro & Food"
  | "Leather"
  | "Jute & Fiber"
  | "Handicrafts"
  | "Frozen Foods"
  | "Industrial Chemicals"
  | "Plastic Resins"
  | "Machinery & Equipment";

export type ProductType = "Import" | "Export" | "Supply";
import { IMAGES } from "@/constants/images";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  type?: "Import" | "Export" | "Supply" | string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  shortSpec?: string;
  description: string;
  origin?: string;
  applications?: string[];
  specs?: ProductSpec[];
  featured?: boolean;
}

export const productCategories = [
  "All Categories",
  "Textiles & Garments",
  "Agro & Food",
  "Industrial Chemicals",
  "Plastic Resins",
  "Leather",
  "Jute & Fiber",
  "Frozen Foods",
  "Machinery & Equipment",
];

export const importProducts: Product[] = [
  {
    id: "imp-industrial-chemicals",
    name: "Industrial Chemicals",
    category: "Industrial Chemicals",
    type: "Import",
    image: IMAGES.IMPORT_MACHINERY,
    shortSpec: "Bulk liquid & powder · ISO Certified",
    description: "High-grade industrial chemicals sourced globally for the textile, pharmaceutical, and manufacturing sectors. Ensuring continuous supply with rigorous quality checks.",
    origin: "China, Germany, India",
    applications: ["Textile Dyeing", "Water Treatment", "Pharmaceuticals", "Manufacturing"],
    specs: [
      { label: "Purity", value: "98% - 99.9%" },
      { label: "Packaging", value: "200L Drums, IBC Totes, 25kg Bags" },
      { label: "MOQ", value: "10 Metric Tons" },
    ],
  },
  {
    id: "imp-plastic-resins",
    name: "Plastic Resins & Polymers",
    category: "Plastic Resins",
    type: "Import",
    image: IMAGES.IMPORT_MACHINERY,
    shortSpec: "Prime Grade HDPE/LDPE/PP/PET",
    description: "Premium plastic resins and polymers essential for packaging, injection molding, and consumer goods manufacturing. Sourced from leading petrochemical complexes.",
    origin: "Middle East, South Korea",
    applications: ["Packaging", "Injection Molding", "Pipes", "Consumer Goods"],
    specs: [
      { label: "Grade", value: "Prime, Virgin" },
      { label: "Packaging", value: "25kg Bags, Jumbo Bags" },
      { label: "MOQ", value: "20 Metric Tons" },
    ],
  },
  {
    id: "imp-food-additives",
    name: "Food Grade Additives",
    category: "Agro & Food",
    type: "Import",
    image: IMAGES.IMPORT_MACHINERY,
    shortSpec: "HACCP & Halal Certified",
    description: "Safe, high-quality food additives including preservatives, flavor enhancers, and stabilizers for the rapidly growing domestic food processing industry.",
    origin: "Europe, Southeast Asia",
    applications: ["Beverages", "Processed Foods", "Dairy", "Bakery"],
    specs: [
      { label: "Certification", value: "HACCP, Halal, Kosher" },
      { label: "Packaging", value: "25kg Cartons/Bags" },
      { label: "MOQ", value: "5 Metric Tons" },
    ],
  },
  {
    id: "imp-textile-chemicals",
    name: "Specialty Textile Chemicals",
    category: "Industrial Chemicals",
    type: "Import",
    image: IMAGES.IMPORT_MACHINERY,
    shortSpec: "Oeko-Tex Standard Compliant",
    description: "Advanced textile auxiliaries, dyes, and finishing agents. We supply Bangladesh's massive RMG sector with eco-friendly chemicals that meet global standards.",
    origin: "Switzerland, Germany, China",
    applications: ["Dyeing", "Finishing", "Printing", "Washing"],
    specs: [
      { label: "Compliance", value: "ZDHC, Oeko-Tex, REACH" },
      { label: "Packaging", value: "120kg Drums, IBC Totes" },
      { label: "MOQ", value: "1 Metric Ton" },
    ],
  },
  {
    id: "imp-metal-raw",
    name: "Metal Raw Materials",
    category: "Machinery & Equipment",
    type: "Import",
    image: IMAGES.IMPORT_MACHINERY,
    shortSpec: "Steel Billets, Aluminum Ingots",
    description: "Essential metal raw materials feeding into the construction, automotive, and heavy industry sectors. Consistent quality and reliable delivery timelines.",
    origin: "Ukraine, UAE, India",
    applications: ["Construction", "Automotive", "Heavy Machinery", "Infrastructure"],
    specs: [
      { label: "Grade", value: "Various International Standards" },
      { label: "Form", value: "Billets, Ingots, Coils" },
      { label: "MOQ", value: "100 Metric Tons" },
    ],
  },
  {
    id: "imp-packaging-materials",
    name: "Advanced Packaging Materials",
    category: "Plastic Resins",
    type: "Import",
    image: IMAGES.IMPORT_MACHINERY,
    shortSpec: "BOPP Films, Specialized Foils",
    description: "High-barrier packaging materials ensuring product safety and extended shelf-life for food, pharmaceutical, and FMCG industries.",
    origin: "Taiwan, China, UAE",
    applications: ["Food Packaging", "Pharmaceuticals", "FMCG", "Labels"],
    specs: [
      { label: "Thickness", value: "12 - 50 Microns" },
      { label: "Format", value: "Rolls" },
      { label: "MOQ", value: "5 Metric Tons" },
    ],
  },
];

export const exportProducts: Product[] = [
  {
    id: "exp-rmg-cotton",
    name: "Cotton Knits & Ready-Made Garments",
    category: "Textiles & Garments",
    type: "Export",
    image: IMAGES.PLACEHOLDER,
    shortSpec: "BSCI-Compliant · Custom Labeling",
    description: "Premium quality cotton knit apparel manufactured in state-of-the-art facilities. Offering a full spectrum of styles for men, women, and children.",
    origin: "Dhaka & Gazipur, Bangladesh",
    applications: ["Retail Clothing", "Corporate Wear", "Promotional Merchandise"],
    specs: [
      { label: "Material", value: "100% Cotton, Blends, Organic Options" },
      { label: "Certifications", value: "Oeko-Tex, BSCI, GOTS" },
      { label: "MOQ", value: "3,000 pcs per style" },
    ],
  },
  {
    id: "exp-aromatic-rice",
    name: "Premium Aromatic Rice",
    category: "Agro & Food",
    type: "Export",
    image: IMAGES.AGRO_PRODUCTS,
    shortSpec: "Sortex Cleaned · Phytosanitary Certified",
    description: "World-renowned aromatic rice varieties (Kataribhog, Kalijira) known for their distinct fragrance and fine grain. Perfect for international ethnic markets.",
    origin: "Dinajpur, Bangladesh",
    applications: ["Culinary", "Retail Grocery", "Catering & Hospitality"],
    specs: [
      { label: "Grade", value: "Premium Grade A" },
      { label: "Packaging", value: "5kg, 10kg, 25kg PP bags" },
      { label: "MOQ", value: "20 Metric Tons" },
    ],
  },
  {
    id: "exp-finished-leather",
    name: "REACH-Compliant Finished Leather",
    category: "Leather",
    type: "Export",
    image: IMAGES.PLACEHOLDER,
    shortSpec: "LWG Silver Rated Tanneries",
    description: "High-quality finished bovine and goat leather exported for luxury goods manufacturing globally. Ensuring strict environmental compliance.",
    origin: "Savar Tannery Estate, Bangladesh",
    applications: ["Footwear", "Handbags", "Apparel", "Upholstery"],
    specs: [
      { label: "Compliance", value: "EU REACH, LWG Silver" },
      { label: "Type", value: "Full Grain, Corrected, Suede" },
      { label: "MOQ", value: "5,000 sq. ft." },
    ],
  },
  {
    id: "exp-jute-products",
    name: "Eco-Friendly Jute Products",
    category: "Jute & Fiber",
    type: "Export",
    image: IMAGES.PLACEHOLDER,
    shortSpec: "100% Biodegradable · Custom Prints",
    description: "Sustainable packaging solutions including jute shopping bags, sacks, and geo-textiles. Bangladesh is the global hub for premium 'Golden Fiber'.",
    origin: "Narayanganj & Faridpur, Bangladesh",
    applications: ["Retail Packaging", "Agriculture", "Construction", "Promotional"],
    specs: [
      { label: "Material", value: "100% Natural Jute" },
      { label: "Format", value: "Bags, Rolls, Twine" },
      { label: "MOQ", value: "5,000 pcs (Bags) / 10 MT (Raw)" },
    ],
  },
  {
    id: "exp-frozen-seafood",
    name: "Frozen Black Tiger Shrimp",
    category: "Frozen Foods",
    type: "Export",
    image: IMAGES.PLACEHOLDER,
    shortSpec: "IQF & Block Frozen · ASC Certified",
    description: "Premium Black Tiger Shrimp sourced from coastal aquaculture farms. Processed in EU-approved, HACCP-certified facilities for international markets.",
    origin: "Khulna & Cox's Bazar, Bangladesh",
    applications: ["Restaurants", "Supermarkets", "Food Service"],
    specs: [
      { label: "Species", value: "Penaeus monodon" },
      { label: "Certifications", value: "HACCP, ASC, BAP" },
      { label: "MOQ", value: "1x20ft Reefer Container" },
    ],
  },
  {
    id: "exp-processed-foods",
    name: "Processed Foods & Snacks",
    category: "Agro & Food",
    type: "Export",
    image: IMAGES.AGRO_PRODUCTS,
    shortSpec: "Ready-to-eat · Halal Certified",
    description: "A diverse range of processed foods including biscuits, spices, frozen parathas, and juices, serving the global South Asian diaspora.",
    origin: "Dhaka & Chittagong, Bangladesh",
    applications: ["Retail Grocery", "Convenience Stores", "Ethnic Markets"],
    specs: [
      { label: "Certifications", value: "Halal, ISO 22000" },
      { label: "Shelf Life", value: "12 - 24 Months" },
      { label: "MOQ", value: "Mixed 20ft Container" },
    ],
  },
];

export const supplyProducts: Product[] = [
  {
    id: "sup-textile-yarn",
    name: "Cotton & Synthetic Yarn",
    category: "Textiles & Garments",
    type: "Supply",
    image: IMAGES.CONTAINER_TRUCKS,
    shortSpec: "Carded & Combed · Ring Spun",
    description: "Providing continuous raw material supply to knitting and weaving mills across Bangladesh. Consistent quality to keep production lines running smoothly.",
    origin: "Local Mills & Imported",
    applications: ["Knitting", "Weaving", "Denim Production"],
    specs: [
      { label: "Counts", value: "10s to 60s" },
      { label: "Packaging", value: "Cones in Cartons/Bags" },
      { label: "MOQ", value: "5 Metric Tons" },
    ],
  },
  {
    id: "sup-dyes-chemicals",
    name: "Textile Dyes & Auxiliaries",
    category: "Industrial Chemicals",
    type: "Supply",
    image: IMAGES.CONTAINER_TRUCKS,
    shortSpec: "Reactive & Disperse Dyes",
    description: "Just-in-time delivery of essential textile dyes and chemicals to dyeing factories, ensuring uninterrupted operations for export-oriented factories.",
    origin: "Global Partner Brands",
    applications: ["Textile Dyeing", "Garment Washing", "Finishing"],
    specs: [
      { label: "Compliance", value: "Oeko-Tex Standard 100" },
      { label: "Delivery", value: "Ex-stock Dhaka/Chittagong" },
      { label: "MOQ", value: "500 Kg" },
    ],
  },
  {
    id: "sup-packaging-cartons",
    name: "Corrugated Cartons & Trims",
    category: "Jute & Fiber",
    type: "Supply",
    image: IMAGES.CONTAINER_TRUCKS,
    shortSpec: "3-Ply & 5-Ply · Custom Prints",
    description: "Reliable supply of packaging materials, master cartons, and garment accessories delivered directly to manufacturing floors.",
    origin: "Local Manufacturing",
    applications: ["Export Packaging", "Retail Packaging", "Logistics"],
    specs: [
      { label: "Material", value: "Kraft Paper, Recycled Blends" },
      { label: "Strength", value: "High ECT / Burst Strength" },
      { label: "MOQ", value: "10,000 Pcs" },
    ],
  },
  {
    id: "sup-plastic-granules",
    name: "Recycled & Virgin Plastic Granules",
    category: "Plastic Resins",
    type: "Supply",
    image: IMAGES.CONTAINER_TRUCKS,
    shortSpec: "PP, PE, PET Grades",
    description: "Supplying the domestic plastics industry with a steady stream of raw materials for manufacturing household items, pipes, and furniture.",
    origin: "Imported & Locally Recycled",
    applications: ["Injection Molding", "Blow Molding", "Extrusion"],
    specs: [
      { label: "Grade", value: "Virgin & High-Quality Recycled" },
      { label: "Packaging", value: "25kg PP Woven Bags" },
      { label: "MOQ", value: "5 Metric Tons" },
    ],
  },
  {
    id: "sup-food-ingredients",
    name: "Bulk Food Ingredients",
    category: "Agro & Food",
    type: "Supply",
    image: IMAGES.CONTAINER_TRUCKS,
    shortSpec: "Sugar, Wheat, Edible Oils",
    description: "Distributing essential bulk food commodities to large-scale food processors, bakeries, and consumer brands nationwide.",
    origin: "Global & Domestic",
    applications: ["Food Processing", "Bakery", "Beverage Production"],
    specs: [
      { label: "Quality", value: "Food Grade, BSTI Approved" },
      { label: "Delivery", value: "Bulk Trucks & ISO Tanks" },
      { label: "MOQ", value: "20 Metric Tons" },
    ],
  },
  {
    id: "sup-industrial-minerals",
    name: "Industrial Minerals & Cement Raw",
    category: "Machinery & Equipment",
    type: "Supply",
    image: IMAGES.CONTAINER_TRUCKS,
    shortSpec: "Clinker, Limestone, Gypsum",
    description: "Supplying heavy industries, particularly the cement manufacturing sector, with critical raw materials transported efficiently from ports to plants.",
    origin: "Middle East, SE Asia",
    applications: ["Cement Production", "Construction", "Ceramics"],
    specs: [
      { label: "Format", value: "Bulk Carrier / Breakbulk" },
      { label: "Logistics", value: "River Barges & Heavy Trucks" },
      { label: "MOQ", value: "1,000 Metric Tons" },
    ],
  },
];

export const products: Product[] = [...importProducts, ...exportProducts, ...supplyProducts];
