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
  { label: "Manufacturing Process", href: "/manufacturing-process" },
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
  { value: 500, suffix: "+", label: "Tons Monthly Capacity" },
  { value: 15, suffix: "+", label: "Export Destinations" },
  { value: 99, suffix: "%", label: "Material Purity" },
  { value: 100, suffix: "%", label: "Quality Tested" },
];

// ─── Certifications ───────────────────────────────────────────
export interface Certification {
  name: string;
  description: string;
}

export const certifications: Certification[] = [
  { name: "ISO 9001:2015", description: "Quality Management System" },
  { name: "ISO 14001", description: "Environmental Management" },
  { name: "[CERTIFICATION]", description: "[DESCRIPTION]" },
];

// ─── Company Info ─────────────────────────────────────────────
export const companyInfo = {
  name: "Bismillah Plastic",
  tagline: "Recycled Plastic Materials — Manufactured in Bangladesh, Supplied Worldwide.",
  description:
    "A recycled plastic chips and flakes manufacturer based in Dinajpur, Bangladesh, producing high-quality PET, PP, HDPE, and LDPE recycled materials for international manufacturers and industrial buyers worldwide.",
  foundedYear: 2009,
  address: "Baluadangga, Chauliapotti, Dinajpur.",
  phone: "+880 1842-084883",
  email: "bismillahplastic76@gmail.com",
  exportEmail: "bismillahplastic76@gmail.com",
  socialLinks: {
    linkedin: "",
    twitter: "",
    facebook: "",
  },
};
