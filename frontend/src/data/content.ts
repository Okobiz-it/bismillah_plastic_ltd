

// ─── Team Members ─────────────────────────────────────────────
export interface TeamMember {
  name: string;
  title: string;
  bio: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Farhan Rahman",
    title: "Chief Executive Officer",
    bio: "25+ years in industrial manufacturing. Built Bismillah Plastic from a small recycling unit into a world-class recycled plastic manufacturing house.",
  },
  {
    name: "Nusrat Jahan",
    title: "Managing Director",
    bio: "Former logistics head at a major shipping line. Steers strategic partnerships and international joint ventures across 40+ countries.",
  },
  {
    name: "Kamal Hossain",
    title: "Director of Raw Materials",
    bio: "Specializes in sourcing post-consumer plastic waste. Manages a vast network of local collection hubs and material recovery facilities.",
  },
  {
    name: "Ayesha Siddiqua",
    title: "Director of Exports",
    bio: "Expert in European textile compliance. Oversees our flagship RMG and leather export divisions, ensuring strict EU REACH and BSCI adherence.",
  },
  {
    name: "Tariq Mahmud",
    title: "Logistics Manager",
    bio: "Master orchestrator of domestic and international logistics. Ensures just-in-time delivery for finished recycled materials to global factories.",
  },
  {
    name: "Dr. Sarah Ahmed",
    title: "Operations Manager",
    bio: "Ph.D. in Industrial Engineering. Optimizes warehouse throughput, cold-chain integrity, and port-to-plant distribution mechanics.",
  },
  {
    name: "Zayed Khan",
    title: "Finance Manager",
    bio: "Chartered Accountant with 15 years in industrial finance. Manages letters of credit, factory capital investments, and cross-border transactions.",
  },
  {
    name: "Elena Rostova",
    title: "Sales Manager (Europe)",
    bio: "Based in our Frankfurt liaison office. Bridges the gap between our Bangladesh manufacturing plant and European wholesale buyers.",
  },
  {
    name: "Rafiqul Islam",
    title: "Procurement Manager",
    bio: "On-the-ground sourcing expert. Audits domestic collection centers to ensure they meet our rigorous raw material quality standards.",
  },
  {
    name: "Hasan Chowdhury",
    title: "Warehouse Manager",
    bio: "Oversees our 50,000 sq. ft. Chattogram logistics hub. Maintains 99.9% inventory accuracy and manages strict cold-chain protocols.",
  },
];

// ─── Company Values ───────────────────────────────────────────
export interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

export const companyValues: CompanyValue[] = [
  { title: "Integrity", description: "We conduct business with absolute transparency, honoring our commitments to partners and clients worldwide.", icon: "shield" },
  { title: "Quality", description: "From raw materials to finished goods, we enforce uncompromising quality control at every stage of the manufacturing process.", icon: "star" },
  { title: "Commitment", description: "We are dedicated to the long-term success of our clients, ensuring reliable and continuous supply of premium flakes.", icon: "handshake" },
  { title: "Innovation", description: "Embracing advanced sorting technology and modern processing to optimize yield and material purity.", icon: "lightbulb" },
  { title: "Sustainability", description: "Promoting circular economy principles and ensuring our facility adheres to the highest environmental compliance standards.", icon: "leaf" },
  { title: "Customer Focus", description: "Tailoring our manufacturing and export solutions to meet the unique demands and technical specifications of each buyer.", icon: "users" },
];

// ─── Timeline / Milestones ────────────────────────────────────
export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const milestones: Milestone[] = [
  { year: "2009", title: "Founded in Dhaka", description: "Started as a small plastic recycling unit serving domestic manufacturers from a facility in Gazipur." },
  { year: "2012", title: "Expanded to Premium Flakes", description: "Upgraded our washing lines to produce hot-washed PET flakes, opening up export markets in East Asia." },
  { year: "2014", title: "Factory Expansion", description: "Tripled our production capacity with a new state-of-the-art facility featuring automated optical sorting." },
  { year: "2016", title: "ISO 9001 Certified", description: "Achieved ISO 9001:2015 certification, establishing quality management standards across all operations." },
  { year: "2018", title: "Warehousing & Logistics Hub", description: "Opened 50,000 sq. ft. of finished goods warehousing near Chattogram port for faster export fulfillment." },
  { year: "2020", title: "Global Reach", description: "Expanded our export network to over 40 countries across Europe, Middle East, East Asia, and North America." },
  { year: "2023", title: "Export Logistics Division", description: "Launched end-to-end export logistics management for seamless door-to-port delivery for international clients." },
  { year: "2024", title: "Digital Quality Tracking", description: "Implemented real-time batch tracking and digital specification documentation for all shipments." },
];

// ─── Client Logos ─────────────────────────────────────────────
export interface ClientLogo {
  name: string;
  id: string;
}

export const clientLogos: ClientLogo[] = [
  { name: "Rheinland Textilgruppe", id: "rheinland" },
  { name: "Gulf Packaging Industries", id: "gulf-pack" },
  { name: "Mariscos del Atlántico", id: "mariscos" },
  { name: "Pelletteria Toscana", id: "pelletteria" },
  { name: "Al-Khaleej Foods", id: "alkhaleej" },
  { name: "Nordic Home Textiles", id: "nordic" },
  { name: "Apex Industrial Group", id: "apex" },
  { name: "Istanbul Deri Ltd", id: "istanbul-deri" },
  { name: "Pacific Rim Trading", id: "pacific-rim" },
  { name: "Sahara Distribution", id: "sahara" },
  { name: "EuroAgri Partners", id: "euroagri" },
  { name: "Bengal Bay Logistics", id: "bengal-bay" },
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
    client: "Rheinland Textilgruppe",
    region: "Germany",
    challenge:
      "Needed a reliable sourcing partner who could consistently provide 100% clear hot-washed PET flakes for their recycled polyester fiber production lines.",
    solution:
      "We dedicated a specific high-purity optical sorting line to their orders, established a customized contamination testing protocol, and provided digital batch analysis reports.",
    result:
      "Zero contamination rejections over three years, 98.5% on-time delivery rate, and improved their fiber yield by 12% compared to their previous supplier.",
  },
  {
    id: "cs2",
    client: "Al-Khaleej Packaging",
    region: "Saudi Arabia",
    challenge:
      "Required a year-round supply of high-grade PP recycled chips with consistent melt flow index (MFI) for injection molding applications.",
    solution:
      "We established a dedicated PP processing unit, implemented strict melt flow testing, and set up a custom bulk bag packaging line for their specific silos.",
    result:
      "Grew from an initial 200-ton trial order to a 2,000-ton annual contract within two years. Now their primary PP recycled material supplier.",
  },
  {
    id: "cs3",
    client: "Pelletteria Toscana",
    region: "Italy",
    challenge:
      "Sourcing REACH-compliant recycled HDPE from South Asia was proving unreliable, with frequent color inconsistencies and high moisture content.",
    solution:
      "We upgraded our drying centrifuges to guarantee <1% moisture, implemented strict color-sorting protocols, and standardized all documentation per EU import requirements.",
    result:
      "Established a consistent supply delivering 500+ MT of HDPE quarterly, with full REACH compliance and zero rejected shipments due to moisture.",
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
  { name: "Europe", countries: "Germany, Italy, Spain, UK, Netherlands, France", keyProducts: "Clear PET Flakes, PP Chips", stats: "15 countries served" },
  { name: "Middle East", countries: "UAE, Saudi Arabia, Qatar, Kuwait, Oman", keyProducts: "HDPE, LDPE, Colored PET", stats: "8 countries served" },
  { name: "East Asia", countries: "Japan, South Korea, China, Vietnam", keyProducts: "Premium PET Flakes, PP", stats: "6 countries served" },
  { name: "North America", countries: "USA, Canada", keyProducts: "Recycled Plastic Resins", stats: "2 countries served" },
  { name: "South Asia", countries: "India, Sri Lanka, Nepal", keyProducts: "HDPE Flakes, PP Chips", stats: "4 countries served" },
  { name: "Africa", countries: "Egypt, Kenya, South Africa, Nigeria", keyProducts: "Mixed Plastic Flakes, LDPE", stats: "5 countries served" },
];
