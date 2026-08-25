// ─── Navigation ───────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Company Overview", href: "/about" },
      { label: "Mission & Vision", href: "/about/mission-vision" },
      { label: "Management", href: "/about/management" }
    ]
  },
  { label: "Products", href: "/products" },
  { label: "Business Operations", href: "/business-operations" },
  { label: "Global Export", href: "/global-export" },
  { label: "Gallery", href: "/gallery" },
];

// ─── Stats ────────────────────────────────────────────────────
export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const heroStats: Stat[] = [
  { value: 15000, suffix: "+", label: "MT Year 1 Capacity" },
  { value: 30, suffix: "", label: "Collection Centers" },
  { value: 2, suffix: "", label: "Processing Units" },
  { value: 24000, suffix: "", label: "MT Year 5 Target" },
];

// ─── Certifications ───────────────────────────────────────────
export interface Certification {
  name: string;
  description: string;
}

export const certifications: Certification[] = [
  { name: "OHS Compliance", description: "Occupational Health & Safety Standards" },
  { name: "No Child Labor", description: "Strict Prohibition on Child & Forced Labor" },
  { name: "[CERTIFICATION]", description: "[DESCRIPTION]" },
];

// ─── Company Info ─────────────────────────────────────────────
export const companyInfo = {
  name: "Bismillah Plastic",
  tagline: "Plastic Waste Collection & Mechanical Recycling — Dinajpur, Bangladesh.",
  description:
    "A Bangladesh-based enterprise specializing in plastic waste collection and mechanical recycling. Operating out of the Dinajpur region, Bismillah Plastic systematically transforms recovered post-consumer and industrial plastics into high-quality recycled plastic flakes, serving as a critical infrastructural link within the domestic circular economy.",
  foundedYear: 2016,
  address: "Chawliapotti, Baluadangga, Dinajpur, Bangladesh",
  phone: "+880 1842-084883",
  email: "bismillahplastic76@gmail.com",
  exportEmail: "bismillahplastic76@gmail.com",
  socialLinks: {
    linkedin: "",
    twitter: "",
    facebook: "",
  },
};
