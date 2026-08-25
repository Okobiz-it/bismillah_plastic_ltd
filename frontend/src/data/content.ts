

// ─── Team Members ─────────────────────────────────────────────
export interface TeamMember {
  name: string;
  title: string;
  bio: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Managing Director",
    title: "Chief Executive Officer",
    bio: "Oversees all operations of Bismillah Plastic, from community-level waste collection to industrial-scale mechanical recycling. Drives strategic partnerships and ensures operational consistency across all 30 collection centers and both processing units.",
  },
  {
    name: "Operations Head",
    title: "Director of Operations",
    bio: "Manages the end-to-end recycling pipeline — from collection and sorting to cleaning, mechanical recycling, and final quality control. Ensures that hot-wash and cold-wash processing meets purity and hygiene standards.",
  },
  {
    name: "Collection Network Manager",
    title: "Head of Waste Collection",
    bio: "Coordinates the decentralized network of 30 collection centers across the Dinajpur region. Integrates informal waste workers and paddle-van drivers into the formal supply chain to maximize material recovery.",
  },
  {
    name: "Processing Unit Supervisor",
    title: "Plant Manager — Unit 1 & Unit 2",
    bio: "Supervises daily operations at both processing facilities in Chawliapotti, Baluadangga and Damail, Biral. Oversees the operation of crushers, washers, dryers, and quality-control equipment.",
  },
  {
    name: "Quality Control Manager",
    title: "Head of Quality Assurance",
    bio: "Ensures all recycled plastic flakes meet the necessary purity, hygiene, and quality standards required for downstream manufacturing. Manages laboratory testing and batch documentation.",
  },
  {
    name: "Logistics Coordinator",
    title: "Transportation & Logistics Manager",
    bio: "Coordinates the transportation of aggregated plastic waste from collection centers to processing facilities. Manages logistics for the distribution of finished recycled materials to downstream manufacturers.",
  },
  {
    name: "Procurement Manager",
    title: "External Sourcing Manager",
    bio: "Manages procurement of additional plastic waste from external suppliers under formal, documented arrangements. Ensures consistent feedstock quality and supply volume to meet processing targets.",
  },
  {
    name: "Safety & Welfare Officer",
    title: "OHS & Worker Welfare Manager",
    bio: "Implements occupational health and safety protocols across all facilities. Manages PPE compliance, hazard identification, first-aid facilities, and coordinates healthcare access with the local hospital.",
  },
  {
    name: "Community Liaison",
    title: "Social Impact & Inclusion Manager",
    bio: "Operationalizes the company's commitment to gender equality and social inclusion through gender-neutral hiring practices and equal opportunity frameworks targeting underrepresented groups.",
  },
  {
    name: "Finance Manager",
    title: "Head of Finance & Administration",
    bio: "Manages financial operations, capital investments in processing infrastructure, and administrative functions across the enterprise. Ensures fiscal discipline and sustainable growth.",
  },
];

// ─── Company Values ───────────────────────────────────────────
export interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

export const companyValues: CompanyValue[] = [
  { title: "Circular Economy", description: "Transforming post-consumer plastic waste into reusable recycled materials, closing the loop in the plastics value chain and reducing reliance on virgin feedstocks.", icon: "leaf" },
  { title: "Community Integration", description: "Actively engaging informal waste workers and paddle-van drivers into a formal, structured supply chain — providing livelihood opportunities and employment.", icon: "users" },
  { title: "Worker Welfare", description: "Enforcing strict OHS protocols, mandatory PPE, on-site first-aid, hospital partnerships, and regular health check-ups to protect our entire workforce.", icon: "shield" },
  { title: "Quality Excellence", description: "Employing dual hot-wash and cold-wash processing techniques with industrial crushers, washers, dryers, and quality-control equipment to ensure material purity.", icon: "star" },
  { title: "Environmental Stewardship", description: "Intercepting plastic waste that poses documented risks to local land and water resources in the Dinajpur region, diverting it from improper disposal.", icon: "lightbulb" },
  { title: "Social Inclusion", description: "Implementing gender-neutral hiring practices and equal opportunity frameworks targeting underrepresented groups across all operations.", icon: "handshake" },
];

// ─── Timeline / Milestones ────────────────────────────────────
export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const milestones: Milestone[] = [
  { year: "2016", title: "Operations Commenced", description: "Bismillah Plastic formally commenced operations on 02 January 2016 in the Dinajpur region of Bangladesh." },
  { year: "2017", title: "Collection Network Established", description: "Established a decentralized network of collection centers across Dinajpur, integrating informal waste workers into the formal supply chain." },
  { year: "2018", title: "Unit 1 — Full Operations", description: "Processing facility at Chawliapotti, Baluadangga achieved full operational capacity with industrial crushers, washers, and dryers." },
  { year: "2019", title: "Hot-Wash & Cold-Wash Lines", description: "Introduced dual hot-wash and cold-wash processing techniques to meet higher purity and hygiene standards for downstream manufacturers." },
  { year: "2020", title: "Unit 2 Commissioned", description: "Opened the second processing unit at Damail, Biral, Dinajpur to expand throughput and handle the growing volume of waste materials." },
  { year: "2021", title: "30 Collection Centers", description: "Expanded the collection infrastructure to 30 dedicated centers, each overseen by a designated manager for operational consistency." },
  { year: "2023", title: "iDEA TREE Partnership", description: "Partnered with iDEA TREE as the project's development consultant under the BIS-Community Collection framework." },
  { year: "2025", title: "Scaling to 24,000 MT", description: "Projected operational scaling to 24,000 metric tons annual processing capacity by Year 5, reinforcing commercial viability of recycled plastics." },
];

// ─── Client Logos ─────────────────────────────────────────────
export interface ClientLogo {
  name: string;
  id: string;
}

export const clientLogos: ClientLogo[] = [
  { name: "Downstream Fiber Manufacturer", id: "fiber-mfg" },
  { name: "Plastic Pellet Producer", id: "pellet-prod" },
  { name: "Upcycled Products Company", id: "upcycled-co" },
  { name: "Regional Packaging Firm", id: "packaging-firm" },
  { name: "Textile Recycler", id: "textile-recycler" },
  { name: "Industrial Plastics Ltd", id: "industrial-plastics" },
  { name: "Green Materials Corp", id: "green-materials" },
  { name: "Circular Economy Partners", id: "circular-partners" },
];

// ─── Case Studies ─────────────────────────────────────────────
export interface CaseStudy {
  id: string;
  client: string;
  region: string;
  challenge: string;
  solution: string;
  result: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "cs1",
    client: "Downstream Fiber Manufacturer",
    region: "Bangladesh",
    challenge:
      "Needed a reliable, consistent supply of high-quality recycled PET flakes for their polyester fiber production lines, but struggled with contamination and inconsistent quality from other suppliers.",
    solution:
      "Bismillah Plastic dedicated a specific hot-wash processing line to their orders, implemented rigorous quality-control testing at every stage, and established formal documentation for each batch.",
    result:
      "Achieved consistent supply of recycled PET flakes meeting purity standards, enabling uninterrupted fiber production and reducing the manufacturer's reliance on virgin plastic feedstocks.",
  },
  {
    id: "cs2",
    client: "Plastic Pellet Producer",
    region: "Dinajpur Region",
    challenge:
      "Required year-round supply of multiple polymer types (HDPE, PP, LDPE) in recycled flake form with consistent quality suitable for pelletization.",
    solution:
      "Leveraged the network of 30 collection centers to ensure consistent feedstock volume. Employed dual hot-wash and cold-wash processing to guarantee purity standards across all polymer types.",
    result:
      "Grew from an initial trial arrangement to a long-term supply partnership, with Bismillah Plastic becoming their primary recycled material supplier across multiple polymer categories.",
  },
  {
    id: "cs3",
    client: "Upcycled Products Company",
    region: "Bangladesh",
    challenge:
      "Sourcing mixed recycled plastics including sachets and flexible waste was proving difficult, with limited suppliers capable of processing such diverse material streams.",
    solution:
      "Bismillah Plastic's capability to process a highly diversified portfolio — including sachets, mixed waste, and miscellaneous plastics — provided the exact material mix needed. Quality-controlled processing ensured usable output.",
    result:
      "Established a consistent supply of processed mixed plastic materials, enabling the manufacturer to scale their upcycled product line and divert additional waste from improper disposal.",
  },
];

// ─── Global Network Regions ───────────────────────────────────
export interface TradeRegion {
  name: string;
  countries: string;
  keyProducts: string;
  stats: string;
}

export const tradeRegions: TradeRegion[] = [
  { name: "Dinajpur Region", countries: "Chawliapotti, Baluadangga, Damail, Biral", keyProducts: "PET, HDPE, PP, LDPE Flakes", stats: "2 processing units" },
  { name: "Domestic Markets", countries: "Bangladesh — fiber, pellet, and packaging manufacturers", keyProducts: "Recycled Plastic Flakes", stats: "Multiple downstream buyers" },
  { name: "International Markets", countries: "Global downstream manufacturers", keyProducts: "High-Quality Recycled Flakes", stats: "Domestic & international supply" },
];
