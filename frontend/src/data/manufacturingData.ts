import { IMAGES } from "@/constants/images";

// ─── Manufacturing Process Steps ──────────────────────────────
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export const manufacturingSteps: ProcessStep[] = [
  { step: 1, title: "Raw Material Selection", description: "Sourcing and selecting plastic waste materials suitable for recycling — PET bottles, HDPE containers, PP packaging, and LDPE films." },
  { step: 2, title: "Sorting", description: "Manual and automated sorting by polymer type, color, and contamination level to ensure material consistency." },
  { step: 3, title: "Crushing", description: "Size reduction of sorted plastic into small flakes using industrial crushers and granulators." },
  { step: 4, title: "Washing", description: "Multi-stage hot and cold washing to remove labels, adhesives, dirt, and organic contaminants." },
  { step: 5, title: "Separation", description: "Float-sink and density separation to remove non-target materials and ensure polymer purity." },
  { step: 6, title: "Drying", description: "Thermal and centrifugal drying to reduce moisture content to specification levels." },
  { step: 7, title: "Quality Control", description: "Laboratory testing for IV value, moisture, PVC contamination, color, bulk density, and particle size distribution." },
  { step: 8, title: "Packing", description: "Weighed and packed into jumbo bags or custom packaging per buyer specifications." },
  { step: 9, title: "Container Loading & Export", description: "Loaded into shipping containers at our facility, transported to Chattogram Port for international shipment." },
];

// ─── Quality Control Parameters ───────────────────────────────
export interface QualityParameter {
  title: string;
  description: string;
  icon?: string;
}

export const qualityParameters: QualityParameter[] = [
  { title: "Raw Material Inspection", description: "Incoming plastic waste is inspected for type, contamination level, and suitability before entering the production line." },
  { title: "Sorting Control", description: "Automated and manual sorting ensures each batch contains only the target polymer type and color grade." },
  { title: "Washing Control", description: "Multi-stage washing monitored for water temperature, detergent concentration, and contaminant removal efficiency." },
  { title: "Moisture Control", description: "Final moisture levels tested to ensure compliance with customer specifications, typically under 1%." },
  { title: "Contamination Control", description: "PVC content, metal, and foreign material testing performed on every batch to ensure material purity." },
  { title: "Batch Testing", description: "IV value, melt flow index, color measurement, and bulk density tested per production batch." },
  { title: "Final Inspection", description: "Complete quality check before packaging — visual inspection, weight verification, and documentation." },
  { title: "Packaging Inspection", description: "Packaging integrity verified to prevent moisture ingress and contamination during transport." },
  { title: "Quality Documentation", description: "Comprehensive Certificate of Analysis (COA) and Technical Data Sheets (TDS) issued for complete traceability." },
];

// ─── Sustainability Pillars ───────────────────────────────────
export interface SustainabilityPillar {
  title: string;
  description: string;
  icon?: string;
}

export const sustainabilityPillars: SustainabilityPillar[] = [
  { title: "Circular Economy", description: "Transforming post-consumer plastic waste into high-quality raw materials, closing the loop in the plastics value chain." },
  { title: "Plastic Waste Recovery", description: "Diverting plastic waste from landfills and waterways by sourcing and processing material that would otherwise be discarded." },
  { title: "Resource Efficiency", description: "Our manufacturing process is designed to minimize water usage, energy consumption, and material waste at every stage." },
  { title: "Waste Reduction", description: "Optimizing sorting and processing to maximize yield and minimize non-recyclable residue from each batch." },
  { title: "Responsible Sourcing", description: "Working with verified collection networks to ensure ethical and traceable material sourcing practices." },
  { title: "Environmental Impact", description: "Contributing to reduced virgin plastic production by supplying recycled alternatives to manufacturers worldwide." },
];

// ─── Product Categories ───────────────────────────────────────
export interface ProductCategoryInfo {
  name: string;
  description: string;
}

export const defaultProductCategories: ProductCategoryInfo[] = [
  { name: "PET Flakes", description: "Recycled polyethylene terephthalate flakes in various colors — clear, green, and brown." },
  { name: "PET Chips", description: "Recycled PET pellets and chips for direct use in manufacturing and extrusion processes." },
  { name: "PP Recycled Material", description: "Recycled polypropylene chips and flakes from post-consumer and post-industrial sources." },
  { name: "HDPE Recycled Material", description: "Recycled high-density polyethylene material suitable for pipe, container, and packaging manufacturing." },
  { name: "LDPE Recycled Material", description: "Recycled low-density polyethylene material from film and packaging waste sources." },
];

// ─── Homepage Pillars (replacing Import/Export/Supply) ─────────
export const manufacturingPillars = [
  {
    title: "Manufacturing",
    description: "State-of-the-art recycling and processing facilities producing high-quality plastic chips and flakes.",
    image: IMAGES.RECYCLING_PROCESS,
    link: "/manufacturing-process",
    icon: "factory",
  },
  {
    title: "Quality Control",
    description: "Rigorous testing and inspection to guarantee that all products meet international standards.",
    image: IMAGES.QUALITY_LAB,
    link: "/products",
    icon: "quality",
  },
  {
    title: "Global Export",
    description: "Reliable supply of recycled plastic materials to manufacturers across international markets.",
    image: IMAGES.CONTAINER_LOADING,
    link: "/global-export",
    icon: "export",
  },
];

// ─── Homepage Process Steps ───────────────────────────────────
export const homeProcessSteps = [
  { step: 1, title: "Source", description: "We source plastic waste from verified collection networks across Bangladesh." },
  { step: 2, title: "Process", description: "Multi-stage sorting, crushing, washing, and separation at our factory." },
  { step: 3, title: "Test", description: "Every batch is lab-tested for IV, moisture, contamination, and particle size." },
  { step: 4, title: "Export", description: "Packed and shipped via Chattogram Port to manufacturers worldwide." },
];
