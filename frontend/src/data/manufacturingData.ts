import { IMAGES } from "@/constants/images";

// ─── Manufacturing Process Steps ──────────────────────────────
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export const manufacturingSteps: ProcessStep[] = [
  { step: 1, title: "Collection", icon: "🏘️", description: "Plastic waste is recovered through a decentralized network of 30 dedicated collection centers across the Dinajpur region, engaging community-level waste workers and paddle-van drivers." },
  { step: 2, title: "Sorting", icon: "🔍", description: "Collected materials are carefully sorted by polymer type — PET/PETE, HDPE, LDPE, PVC, PP, PS, sachets, mixed plastics, and tires — to ensure material purity for downstream processing." },
  { step: 3, title: "Aggregation", icon: "📦", description: "Sorted materials are consolidated and aggregated at local collection centers, with additional plastic waste procured from external suppliers under formal, documented arrangements." },
  { step: 4, title: "Transportation", icon: "🚛", description: "Aggregated materials are transported directly from collection centers to the company's processing facilities at Chawliapotti, Baluadangga and Damail, Biral." },
  { step: 5, title: "Cleaning & Processing", icon: "💧", description: "Materials undergo rigorous cleaning using both hot-wash and cold-wash processing techniques to ensure purity, hygiene, and quality standards are met before mechanical recycling." },
  { step: 6, title: "Mechanical Recycling", icon: "⚙️", description: "Cleaned materials are processed through industrial crushers, washers, and dryers to convert them into high-quality recycled plastic flakes meeting downstream manufacturing specifications." },
  { step: 7, title: "Recycled Plastic Flakes/Materials", icon: "✨", description: "The primary commercial output — high-quality recycled plastic flakes and materials — is prepared and quality-verified for distribution to downstream manufacturers domestically and internationally." },
  { step: 8, title: "Downstream Manufacturing", icon: "🏭", description: "Refined plastic flakes are supplied directly to downstream manufacturers, serving as crucial feedstock for the secondary manufacturing of fibers, plastic pellets, and various upcycled products." },
];

// ─── Quality Control Parameters ───────────────────────────────
export interface QualityParameter {
  title: string;
  description: string;
  icon?: string;
}

export const qualityParameters: QualityParameter[] = [
  { title: "Raw Material Inspection", description: "Incoming plastic waste is inspected for polymer type, contamination level, and suitability before entering the processing pipeline." },
  { title: "Sorting Control", description: "Manual sorting ensures each batch contains only the target polymer type — PET, HDPE, LDPE, PVC, PP, or PS — with minimal cross-contamination." },
  { title: "Hot-Wash Processing", description: "Hot-wash techniques remove adhesives, labels, organic contaminants, and residual impurities to achieve high-purity output materials." },
  { title: "Cold-Wash Processing", description: "Cold-wash processes complement hot-wash stages for materials requiring gentler treatment while maintaining quality standards." },
  { title: "Mechanical Processing", description: "Industrial crushers reduce sorted plastic into flakes, followed by washing and separation to ensure polymer purity." },
  { title: "Drying & Moisture Control", description: "Thermal and centrifugal drying reduces moisture content to specification levels required by downstream manufacturers." },
  { title: "Contamination Testing", description: "Each batch is tested for foreign material, PVC content, and non-target polymer contamination to ensure material purity." },
  { title: "Final Quality Inspection", description: "Complete quality check before packaging — visual inspection, weight verification, and documentation of material specifications." },
  { title: "Quality Documentation", description: "Comprehensive quality records are maintained for complete traceability across the entire processing pipeline." },
];

// ─── Sustainability Pillars ───────────────────────────────────
export interface SustainabilityPillar {
  title: string;
  description: string;
  icon?: string;
}

export const sustainabilityPillars: SustainabilityPillar[] = [
  { title: "Circular Economy", description: "Converting collected post-consumer waste into reusable recycled materials, directly supporting circular economy principles and creating a closed-loop pathway for recovered plastics." },
  { title: "Waste Diversion", description: "Intercepting plastic waste that poses documented environmental risks to local land and water resources in Dinajpur, where municipal capabilities have not kept pace with regional growth." },
  { title: "Resource Recovery", description: "Facilitating large-scale waste diversion and resource recovery, transforming materials that would otherwise be improperly discarded into valuable manufacturing feedstock." },
  { title: "Virgin Plastic Reduction", description: "Reducing the broader industrial reliance on virgin plastic feedstocks by providing a sustainable and closed-loop pathway for recovered plastics to re-enter productive economic use." },
  { title: "Community Livelihoods", description: "Generating measurable socio-economic impact by providing livelihood opportunities across the value chain — logistics, administration, collection, and mechanical processing." },
  { title: "Informal Sector Integration", description: "Actively improving working conditions for community collectors, waste pickers, and truck drivers by integrating them into a formal and structured supply chain." },
];

// ─── Product Categories ───────────────────────────────────────
export interface ProductCategoryInfo {
  name: string;
  description: string;
}

export const defaultProductCategories: ProductCategoryInfo[] = [
  { name: "PET/PETE Flakes", description: "Recycled polyethylene terephthalate flakes processed through hot-wash and cold-wash techniques for downstream fiber and pellet manufacturing." },
  { name: "HDPE Flakes", description: "Recycled high-density polyethylene flakes suitable for pipe, container, and packaging manufacturing applications." },
  { name: "LDPE Flakes", description: "Recycled low-density polyethylene material recovered from film and packaging waste sources." },
  { name: "PP Flakes", description: "Recycled polypropylene flakes from post-consumer and post-industrial sources for injection molding and extrusion." },
  { name: "PS Flakes", description: "Recycled polystyrene material processed from post-consumer waste for downstream manufacturing." },
  { name: "PVC Flakes", description: "Recycled polyvinyl chloride material processed through mechanical recycling for industrial applications." },
  { name: "Mixed Plastic Flakes", description: "Processed flakes from sachets, assorted mixed plastic waste, and miscellaneous plastics." },
];

// ─── Homepage Pillars ─────────────────────────────────────────
export const manufacturingPillars = [
  {
    title: "Waste Collection",
    description: "A decentralized network of 30 collection centers across Dinajpur, integrating community collectors and informal waste workers.",
    image: IMAGES.RECYCLING_PROCESS,
    link: "/business-operations",
    icon: "factory",
  },
  {
    title: "Mechanical Recycling",
    description: "Industrial-scale processing with crushers, washers, dryers, and dual hot-wash and cold-wash techniques for high-quality output.",
    image: IMAGES.QUALITY_LAB,
    link: "/products",
    icon: "quality",
  },
  {
    title: "Downstream Supply",
    description: "Supplying high-quality recycled plastic flakes to downstream manufacturers for fiber, pellet, and upcycled product production.",
    image: IMAGES.CONTAINER_LOADING,
    link: "/global-export",
    icon: "export",
  },
];

// ─── Homepage Process Steps ───────────────────────────────────
export const homeProcessSteps = [
  { step: 1, title: "Collect", description: "Plastic waste is recovered through 30 collection centers and informal waste worker networks across Dinajpur." },
  { step: 2, title: "Process", description: "Multi-stage sorting, cleaning with hot-wash and cold-wash techniques, and mechanical processing at our facilities." },
  { step: 3, title: "Recycle", description: "Industrial crushers, washers, and dryers convert cleaned plastics into high-quality recycled flakes." },
  { step: 4, title: "Supply", description: "Recycled plastic flakes are supplied to downstream manufacturers for fibers, pellets, and upcycled products." },
];
