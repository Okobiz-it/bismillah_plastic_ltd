import { API_BASE } from "@/lib/api";
import { IMAGES } from "@/constants/images";

export interface PageBannerData {
  _id?: string;
  page: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
  isCustom?: boolean;
}

export interface PageBannerConfig {
  pageKey: string;
  label: string;
  adminTitle: string;
  adminDescription: string;
  publicPath: string;
  defaultData: {
    subtitle: string;
    title: string;
    description: string;
    imageUrl: string;
  };
}

export const PAGE_BANNER_CONFIGS: Record<string, PageBannerConfig> = {
  about: {
    pageKey: "about",
    label: "About Us",
    adminTitle: "About Us Banner",
    adminDescription: "Manage the hero banner image and overlay text displayed on the /about page.",
    publicPath: "/about",
    defaultData: {
      subtitle: "ABOUT US",
      title: "Driving the Circular Plastics Economy",
      description:
        "Since 2016, Bismillah Plastic has systematically transformed recovered post-consumer and industrial plastics into high-quality recycled materials — serving as a critical infrastructural link within the domestic circular economy.",
      imageUrl: IMAGES.HERO_ABOUT,
    },
  },
  "about/mission-vision": {
    pageKey: "about/mission-vision",
    label: "Mission & Vision",
    adminTitle: "Mission, Vision & History Banner",
    adminDescription:
      "Manage the hero banner image and overlay text displayed on the /about/mission-vision page.",
    publicPath: "/about/mission-vision",
    defaultData: {
      subtitle: "MISSION & VISION",
      title: "Purpose-Driven Recycling",
      description:
        "Our foundational principles guide everything we do, from community-level waste collection to industrial-scale mechanical processing.",
      imageUrl: IMAGES.CARGO_SHIP,
    },
  },
  "about/management": {
    pageKey: "about/management",
    label: "Management",
    adminTitle: "Leadership & Management Banner",
    adminDescription: "Manage the hero banner image and overlay text displayed on the /about/management page.",
    publicPath: "/about/management",
    defaultData: {
      subtitle: "EXECUTIVE TEAM",
      title: "Leadership & Management",
      description:
        "Our team combines experience in waste management, mechanical recycling, community collection networks, and processing operations across the Dinajpur region.",
      imageUrl: IMAGES.HERO_MANAGEMENT,
    },
  },
  products: {
    pageKey: "products",
    label: "Products",
    adminTitle: "Products & Materials Banner",
    adminDescription: "Manage the hero banner image and overlay text displayed on the /products page.",
    publicPath: "/products",
    defaultData: {
      subtitle: "Our Products",
      title: "Premium Recycled Plastic Materials",
      description:
        "High-quality PET, HDPE, LDPE, and PP recycled materials engineered for consistency and reliability across industrial manufacturing applications globally.",
      imageUrl: IMAGES.HERO_PRODUCTS,
    },
  },
  "business-operations": {
    pageKey: "business-operations",
    label: "Business Operations",
    adminTitle: "Business Operations Banner",
    adminDescription: "Manage the hero banner image and overlay text displayed on the /business-operations page.",
    publicPath: "/business-operations",
    defaultData: {
      subtitle: "The Process",
      title: "Business Operations",
      description:
        "A comprehensive look at how Bismillah Plastic manages its integrated value chain — from community-level waste collection to the delivery of high-quality recycled plastic materials.",
      imageUrl: IMAGES.HERO_MANUFACTURING,
    },
  },
  impact: {
    pageKey: "impact",
    label: "Impact",
    adminTitle: "Impact & Sustainability Banner",
    adminDescription: "Manage the hero banner image and overlay text displayed on the /impact page.",
    publicPath: "/impact",
    defaultData: {
      subtitle: "ESG & Sustainability",
      title: "Sustainability & Social Impact",
      description:
        "Transforming regional plastic recovery into structured socio-economic empowerment, verified environmental mitigation, and institutional ESG leadership across Bangladesh.",
      imageUrl: IMAGES.HERO_IMPACT,
    },
  },
  "photos-videos": {
    pageKey: "photos-videos",
    label: "Photos | Videos",
    adminTitle: "Photos & Videos Showcase Banner",
    adminDescription: "Manage the hero banner image and overlay text displayed on the /photos-videos page.",
    publicPath: "/photos-videos",
    defaultData: {
      subtitle: "Visual Media & Documentary Hub",
      title: "Photos & Videos Showcase",
      description:
        "A structured visual narrative illustrating our journey — from grassroots collection and women-led centers to industrial mechanical recycling and community impact.",
      imageUrl: IMAGES.HERO_GALLERY,
    },
  },
};

export async function fetchPageBanner(pageKey: string): Promise<PageBannerData | null> {
  try {
    const res = await fetch(`${API_BASE}/page-banners/${pageKey}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}
