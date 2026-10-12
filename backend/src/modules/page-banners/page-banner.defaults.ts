export interface PageBannerDefault {
  page: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  pageName: string;
}

export const PAGE_BANNER_DEFAULTS: Record<string, PageBannerDefault> = {
  about: {
    page: 'about',
    pageName: 'About Us',
    subtitle: 'ABOUT US',
    title: 'Driving the Circular Plastics Economy',
    description:
      'Since 2016, Bismillah Plastic has systematically transformed recovered post-consumer and industrial plastics into high-quality recycled materials — serving as a critical infrastructural link within the domestic circular economy.',
    imageUrl:
      'https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto,w_1920/v1791198150/DSC_0413_dnfdkc.jpg',
  },
  'about/mission-vision': {
    page: 'about/mission-vision',
    pageName: 'Mission, Vision & History',
    subtitle: 'MISSION & VISION',
    title: 'Purpose-Driven Recycling',
    description:
      'Our foundational principles guide everything we do, from community-level waste collection to industrial-scale mechanical processing.',
    imageUrl:
      'https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto,w_1920/v1786514996/cargo-ship_qffeko.jpg',
  },
  'about/management': {
    page: 'about/management',
    pageName: 'Executive Management',
    subtitle: 'EXECUTIVE TEAM',
    title: 'Leadership & Management',
    description:
      'Our team combines experience in waste management, mechanical recycling, community collection networks, and processing operations across the Dinajpur region.',
    imageUrl:
      'https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto,w_1920/v1791200098/management-banner_zq6nlm_pj0ert.jpg',
  },
  products: {
    page: 'products',
    pageName: 'Products & Materials',
    subtitle: 'Our Products',
    title: 'Premium Recycled Plastic Materials',
    description:
      'High-quality PET, HDPE, LDPE, and PP recycled materials engineered for consistency and reliability across industrial manufacturing applications globally.',
    imageUrl:
      'https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto,w_1920/v1791200099/www.beatsnoop.com-3000-dg68Te34ty_vfohh2_oqucfb.jpg',
  },
  'business-operations': {
    page: 'business-operations',
    pageName: 'Business Operations',
    subtitle: 'The Process',
    title: 'Business Operations',
    description:
      'A comprehensive look at how Bismillah Plastic manages its integrated value chain — from community-level waste collection to the delivery of high-quality recycled plastic materials.',
    imageUrl:
      'https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto,w_1920/v1791200105/www.beatsnoop.com-3000-YVZXGzd9UQ_bs8n0t_bveaoz.jpg',
  },
  impact: {
    page: 'impact',
    pageName: 'Impact & Sustainability',
    subtitle: 'ESG & Sustainability',
    title: 'Sustainability & Social Impact',
    description:
      'Transforming regional plastic recovery into structured socio-economic empowerment, verified environmental mitigation, and institutional ESG leadership across Bangladesh.',
    imageUrl:
      'https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto,w_1920/v1791200099/www.beatsnoop.com-3000-dg68Te34ty_vfohh2_oqucfb.jpg',
  },
  'photos-videos': {
    page: 'photos-videos',
    pageName: 'Photos & Videos Showcase',
    subtitle: 'Visual Media & Documentary Hub',
    title: 'Photos & Videos Showcase',
    description:
      'A structured visual narrative illustrating our journey — from grassroots collection and women-led centers to industrial mechanical recycling and community impact.',
    imageUrl:
      'https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto,w_1920/v1787230580/www.beatsnoop.com-3000-zWBaYXgP7h_ypqeah.jpg',
  },
};

export const normalizePageKey = (input: string): string => {
  if (!input) return '';
  let cleaned = input.trim().toLowerCase().replace(/^\/+|\/+$/g, '');

  // Aliases
  if (cleaned === 'mission-vision' || cleaned === 'about-mission-vision') {
    return 'about/mission-vision';
  }
  if (cleaned === 'management' || cleaned === 'about-management') {
    return 'about/management';
  }
  if (cleaned === 'manufacturing' || cleaned === 'operations' || cleaned === 'manufacturing-process') {
    return 'business-operations';
  }
  if (cleaned === 'gallery') {
    return 'photos-videos';
  }

  return cleaned;
};
