export type ProductCategory =
  | "All"
  | "Standard Polymers"
  | "Mixed & Flexible Waste"
  | "Industrial / Automotive"
  | "Recycled Output";

export type ProductType = "Input" | "Output" | "Supply";
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
  type?: "Input" | "Output" | "Supply" | string;
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
  "Standard Polymers",
  "Mixed & Flexible Waste",
  "Industrial / Automotive",
  "Recycled Output",
];

export const importProducts: Product[] = [
  {
    id: "mat-pet-pete",
    name: "PET / PETE",
    category: "Standard Polymers",
    type: "Input",
    image: IMAGES.RECYCLING_PROCESS,
    shortSpec: "Post-consumer · Bottles & Containers",
    description: "Polyethylene terephthalate recovered from post-consumer bottles, containers, and packaging. Sorted, cleaned, and mechanically recycled into high-quality PET flakes through hot-wash and cold-wash processing.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Fiber Production", "Pellet Manufacturing", "Upcycled Products"],
    specs: [
      { label: "Polymer Type", value: "PET / PETE (Resin Code 1)" },
      { label: "Processing", value: "Hot-wash & Cold-wash" },
      { label: "Output", value: "Recycled PET Flakes" },
    ],
  },
  {
    id: "mat-hdpe",
    name: "HDPE",
    category: "Standard Polymers",
    type: "Input",
    image: IMAGES.RECYCLING_PROCESS,
    shortSpec: "Post-consumer & Industrial · Rigid Containers",
    description: "High-density polyethylene recovered from containers, bottles, and industrial packaging. Processed through mechanical recycling to produce HDPE flakes suitable for pipe, container, and packaging manufacturing.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Pipe Manufacturing", "Container Production", "Packaging"],
    specs: [
      { label: "Polymer Type", value: "HDPE (Resin Code 2)" },
      { label: "Processing", value: "Crushing, Washing, Drying" },
      { label: "Output", value: "Recycled HDPE Flakes" },
    ],
  },
  {
    id: "mat-ldpe",
    name: "LDPE",
    category: "Standard Polymers",
    type: "Input",
    image: IMAGES.RECYCLING_PROCESS,
    shortSpec: "Film & Flexible Packaging",
    description: "Low-density polyethylene recovered from film, bags, and flexible packaging waste. Mechanically recycled into LDPE flakes for downstream manufacturing applications.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Film Production", "Bag Manufacturing", "Packaging"],
    specs: [
      { label: "Polymer Type", value: "LDPE (Resin Code 4)" },
      { label: "Processing", value: "Hot-wash & Cold-wash" },
      { label: "Output", value: "Recycled LDPE Flakes" },
    ],
  },
  {
    id: "mat-pvc",
    name: "PVC",
    category: "Standard Polymers",
    type: "Input",
    image: IMAGES.RECYCLING_PROCESS,
    shortSpec: "Rigid & Flexible PVC Waste",
    description: "Polyvinyl chloride recovered from pipes, fittings, profiles, and packaging. Sorted and processed through mechanical recycling to produce PVC flakes for industrial reuse.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Pipe Manufacturing", "Profile Extrusion", "Industrial Applications"],
    specs: [
      { label: "Polymer Type", value: "PVC (Resin Code 3)" },
      { label: "Processing", value: "Crushing, Washing, Drying" },
      { label: "Output", value: "Recycled PVC Flakes" },
    ],
  },
  {
    id: "mat-pp",
    name: "PP",
    category: "Standard Polymers",
    type: "Input",
    image: IMAGES.RECYCLING_PROCESS,
    shortSpec: "Post-consumer · Packaging & Containers",
    description: "Polypropylene recovered from food containers, packaging, automotive parts, and industrial sources. Processed into PP flakes through rigorous sorting, cleaning, and mechanical recycling.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Injection Molding", "Extrusion", "Automotive Parts"],
    specs: [
      { label: "Polymer Type", value: "PP (Resin Code 5)" },
      { label: "Processing", value: "Hot-wash & Cold-wash" },
      { label: "Output", value: "Recycled PP Flakes" },
    ],
  },
  {
    id: "mat-ps",
    name: "PS",
    category: "Standard Polymers",
    type: "Input",
    image: IMAGES.RECYCLING_PROCESS,
    shortSpec: "Expanded & Rigid Polystyrene",
    description: "Polystyrene recovered from packaging, disposable containers, and insulation materials. Mechanically recycled into PS flakes for downstream manufacturing applications.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Packaging", "Insulation", "Consumer Goods"],
    specs: [
      { label: "Polymer Type", value: "PS (Resin Code 6)" },
      { label: "Processing", value: "Crushing, Washing, Drying" },
      { label: "Output", value: "Recycled PS Flakes" },
    ],
  },
];

export const exportProducts: Product[] = [
  {
    id: "mat-sachets",
    name: "Sachets & Flexible Waste",
    category: "Mixed & Flexible Waste",
    type: "Input",
    image: IMAGES.PLACEHOLDER,
    shortSpec: "Multi-layer · Mixed Flexible Packaging",
    description: "Sachets and assorted flexible packaging waste recovered from post-consumer sources. Processed through specialized mechanical recycling to convert these challenging material streams into usable recycled flakes.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Mixed Plastic Products", "Upcycled Materials", "Industrial Feedstock"],
    specs: [
      { label: "Material Type", value: "Sachets, Flexible Films" },
      { label: "Processing", value: "Specialized Mechanical Recycling" },
      { label: "Output", value: "Mixed Recycled Flakes" },
    ],
  },
  {
    id: "mat-mixed-waste",
    name: "Assorted Mixed Plastic Waste",
    category: "Mixed & Flexible Waste",
    type: "Input",
    image: IMAGES.PLACEHOLDER,
    shortSpec: "Multi-polymer · Post-consumer Mix",
    description: "Assorted mixed plastic waste and miscellaneous plastics recovered from various post-consumer and post-industrial sources. Sorted by polymer type where possible and processed into recycled flakes.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Blended Plastic Products", "Construction Materials", "Industrial Uses"],
    specs: [
      { label: "Material Type", value: "Mixed Polymers, Miscellaneous" },
      { label: "Processing", value: "Sorting, Washing, Crushing" },
      { label: "Output", value: "Sorted & Mixed Recycled Flakes" },
    ],
  },
  {
    id: "mat-tires",
    name: "Tires",
    category: "Industrial / Automotive",
    type: "Input",
    image: IMAGES.PLACEHOLDER,
    shortSpec: "End-of-life · Automotive & Industrial",
    description: "End-of-life tires from automotive and industrial sources. Processed through mechanical recycling to recover rubber and other materials, diverting these bulky waste items from improper disposal.",
    origin: "Dinajpur Region, Bangladesh",
    applications: ["Rubber Recovery", "Construction Materials", "Industrial Applications"],
    specs: [
      { label: "Material Type", value: "End-of-Life Tires" },
      { label: "Processing", value: "Mechanical Processing" },
      { label: "Output", value: "Recovered Rubber & Materials" },
    ],
  },
];

export const supplyProducts: Product[] = [
  {
    id: "out-pet-flakes",
    name: "Recycled PET Flakes",
    category: "Recycled Output",
    type: "Output",
    image: IMAGES.PLASTIC_FLAKES,
    shortSpec: "Hot-washed · High Purity",
    description: "High-quality recycled PET flakes produced through hot-wash and cold-wash processing. The primary commercial output supplied to downstream manufacturers for fiber, pellet, and upcycled product production.",
    origin: "Bismillah Plastic — Dinajpur, Bangladesh",
    applications: ["Fiber Production", "Pellet Manufacturing", "Upcycled Products", "Packaging"],
    specs: [
      { label: "Material", value: "Recycled PET / PETE" },
      { label: "Processing", value: "Hot-wash & Cold-wash" },
      { label: "Form", value: "Flakes" },
    ],
    featured: true,
  },
  {
    id: "out-hdpe-flakes",
    name: "Recycled HDPE Flakes",
    category: "Recycled Output",
    type: "Output",
    image: IMAGES.PLASTIC_FLAKES,
    shortSpec: "Mechanically Recycled · Industrial Grade",
    description: "Recycled high-density polyethylene flakes processed through mechanical recycling. Suitable for pipe, container, and packaging manufacturing applications across domestic and international markets.",
    origin: "Bismillah Plastic — Dinajpur, Bangladesh",
    applications: ["Pipe Manufacturing", "Container Production", "Packaging", "Blow Molding"],
    specs: [
      { label: "Material", value: "Recycled HDPE" },
      { label: "Processing", value: "Crushing, Washing, Drying" },
      { label: "Form", value: "Flakes" },
    ],
    featured: true,
  },
  {
    id: "out-pp-flakes",
    name: "Recycled PP Flakes",
    category: "Recycled Output",
    type: "Output",
    image: IMAGES.PLASTIC_FLAKES,
    shortSpec: "Hot-washed · Manufacturing Grade",
    description: "Recycled polypropylene flakes from post-consumer and post-industrial sources. Processed to meet quality standards for injection molding, extrusion, and automotive component manufacturing.",
    origin: "Bismillah Plastic — Dinajpur, Bangladesh",
    applications: ["Injection Molding", "Extrusion", "Automotive Parts", "Consumer Goods"],
    specs: [
      { label: "Material", value: "Recycled PP" },
      { label: "Processing", value: "Hot-wash & Cold-wash" },
      { label: "Form", value: "Flakes" },
    ],
    featured: true,
  },
  {
    id: "out-ldpe-flakes",
    name: "Recycled LDPE Flakes",
    category: "Recycled Output",
    type: "Output",
    image: IMAGES.PLASTIC_FLAKES,
    shortSpec: "Film-grade · Recycled",
    description: "Recycled low-density polyethylene flakes recovered from film and flexible packaging waste. Processed for downstream film production, bag manufacturing, and packaging applications.",
    origin: "Bismillah Plastic — Dinajpur, Bangladesh",
    applications: ["Film Production", "Bag Manufacturing", "Packaging"],
    specs: [
      { label: "Material", value: "Recycled LDPE" },
      { label: "Processing", value: "Mechanical Recycling" },
      { label: "Form", value: "Flakes" },
    ],
  },
  {
    id: "out-mixed-flakes",
    name: "Mixed Recycled Plastic Flakes",
    category: "Recycled Output",
    type: "Output",
    image: IMAGES.PLASTIC_FLAKES,
    shortSpec: "Multi-polymer · Processed",
    description: "Mixed recycled plastic flakes processed from sachets, assorted mixed waste, and miscellaneous plastics. Supplied to manufacturers producing blended plastic products and construction materials.",
    origin: "Bismillah Plastic — Dinajpur, Bangladesh",
    applications: ["Blended Products", "Construction Materials", "Industrial Uses"],
    specs: [
      { label: "Material", value: "Mixed Recycled Polymers" },
      { label: "Processing", value: "Specialized Mechanical Recycling" },
      { label: "Form", value: "Flakes" },
    ],
  },
];

export const products: Product[] = [...importProducts, ...exportProducts, ...supplyProducts];
