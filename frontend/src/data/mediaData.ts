export type PhotoCategoryKey =
  | "plant-processing"
  | "community-empowerment"
  | "safety-training"
  | "circularity-recovery";

export type VideoCategoryKey =
  | "operational-walkthrough"
  | "impact-stories";

export interface PhotoCategoryMeta {
  key: PhotoCategoryKey;
  label: string;
  shortLabel: string;
  description: string;
  tagline: string;
}

export interface VideoCategoryMeta {
  key: VideoCategoryKey;
  label: string;
  shortLabel: string;
  description: string;
  tagline: string;
}

export interface PhotoItem {
  _id?: string;
  imageUrl: string;
  caption?: string;
  category: PhotoCategoryKey;
  order?: number;
}

export interface VideoItem {
  _id?: string;
  title: string;
  description: string;
  category: VideoCategoryKey;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  order?: number;
}

export interface MediaSettings {
  heading?: string;
  subheading?: string;
  heroImageUrl?: string;
}

export const PHOTO_CATEGORIES: PhotoCategoryMeta[] = [
  {
    key: "plant-processing",
    label: "Plant & Mechanical Processing",
    shortLabel: "Plant & Processing",
    tagline: "Industrial Infrastructure in Dinajpur",
    description:
      "Visuals showcasing Unit 1 (Chawliapotti) and Unit 2 (Damail), featuring industrial crushers, dual hot/cold washing lines, drying units, and quality-controlled flake packaging.",
  },
  {
    key: "community-empowerment",
    label: "Livelihood & Community Empowerment",
    shortLabel: "Community & Livelihood",
    tagline: "30 Women-Led Centers & Fair Wages",
    description:
      "Highlighting the decentralized network of 30 women-led collection centers, paddle-van drivers in transit, and informal waste collectors operating within a formalized structure.",
  },
  {
    key: "safety-training",
    label: "OHS, Safety & Workforce Training",
    shortLabel: "OHS & Safety",
    tagline: "Zero-Accident Culture & Worker Well-Being",
    description:
      "Documenting employee welfare protocols, including hazard-identification workshops, staff equipped with mandatory PPE, on-site first-aid stations, and routine medical check-ups.",
  },
  {
    key: "circularity-recovery",
    label: "Material Circularity & Recovery",
    shortLabel: "Circularity & Recovery",
    tagline: "Multi-Polymer Diversion to High-Purity Flakes",
    description:
      "Highlighting the diverse polymer waste streams intercepted (such as PET, HDPE, LDPE, and sachets) alongside finished, high-purity recycled flakes ready for downstream manufacturing.",
  },
];

export const VIDEO_CATEGORIES: VideoCategoryMeta[] = [
  {
    key: "operational-walkthrough",
    label: "Operational & Facility Walkthroughs",
    shortLabel: "Facility Walkthroughs",
    tagline: "B2B Technical Process Tours",
    description:
      "B2B-oriented video tours covering the end-to-end mechanical recycling process, washing line operations, purity verification, and supply chain logistics.",
  },
  {
    key: "impact-stories",
    label: "Human-Interest & Impact Stories",
    shortLabel: "Impact Stories",
    tagline: "Grassroots Transformation & Dignity",
    description:
      "Short documentary-style video vignettes spotlighting the socio-economic advancement of female center managers and waste collectors transitioning into secure employment.",
  },
];

export const defaultPhotos: PhotoItem[] = [
  {
    _id: "photo-1",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787229904/www.beatsnoop.com-3000-9kZPl3OjxS_mtz7rj.jpg",
    caption:
      "Unit 1 (Chawliapotti) mechanical recycling and primary flake granulation floor.",
    category: "plant-processing",
    order: 1,
  },
  {
    _id: "photo-2",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787229103/hero-facility_cluoha.jpg",
    caption:
      "Dual hot-wash and ambient cold-wash decontamination lines removing organic residues.",
    category: "plant-processing",
    order: 2,
  },
  {
    _id: "photo-3",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514997/import-machinery_r2eu3j.jpg",
    caption:
      "Unit 2 (Damail) industrial heavy-duty crushers and high-speed centrifugal drying units.",
    category: "plant-processing",
    order: 3,
  },
  {
    _id: "photo-4",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787231528/factory_iamge_bxnjhs.jpg",
    caption:
      "Automated packaging line preparing 1,000 kg moisture-proof jumbo bags for industrial dispatch.",
    category: "plant-processing",
    order: 4,
  },
  {
    _id: "photo-5",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633415/www.beatsnoop.com-3000-MJzN4BhWpk_xq8vlp.jpg",
    caption:
      "One of 30 dedicated collection centers systematically managed by a designated female manager.",
    category: "community-empowerment",
    order: 5,
  },
  {
    _id: "photo-6",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787230422/www.beatsnoop.com-3000-YVZXGzd9UQ_bs8n0t.jpg",
    caption:
      "Paddle-van drivers and itinerant waste pickers integrated into our structured logistics chain.",
    category: "community-empowerment",
    order: 6,
  },
  {
    _id: "photo-7",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633414/www.beatsnoop.com-3000-H7qxWhOneT_pru67a.jpg",
    caption:
      "Mandatory PPE compliance: workers equipped with puncture-resistant gloves, respirators, and boots.",
    category: "safety-training",
    order: 7,
  },
  {
    _id: "photo-8",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787230273/management-banner_zq6nlm.jpg",
    caption:
      "Weekly hazard identification drills and on-site first-aid station inspections in Dinajpur.",
    category: "safety-training",
    order: 8,
  },
  {
    _id: "photo-9",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514996/warehouse-interior_fw0vne.jpg",
    caption:
      "Facility safety walkthrough and routine medical health check-up arrangements with local hospital.",
    category: "safety-training",
    order: 9,
  },
  {
    _id: "photo-10",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633413/www.beatsnoop.com-3000-cXTuIajikM_pkzl8e.jpg",
    caption:
      "Refined, clear PET flakes verified at <1% moisture content ready for fiber spinning.",
    category: "circularity-recovery",
    order: 10,
  },
  {
    _id: "photo-11",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787230335/www.beatsnoop.com-3000-dg68Te34ty_vfohh2.jpg",
    caption:
      "Multi-category polymer recovery: separated HDPE regrind, LDPE film, and multi-layer sachets.",
    category: "circularity-recovery",
    order: 11,
  },
  {
    _id: "photo-12",
    imageUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787230580/www.beatsnoop.com-3000-zWBaYXgP7h_ypqeah.jpg",
    caption:
      "Quality assurance laboratory testing flake purity, contamination thresholds, and bulk density.",
    category: "circularity-recovery",
    order: 12,
  },
];

export const defaultVideos: VideoItem[] = [
  {
    _id: "video-1",
    title: "B2B Facility Tour: End-to-End Mechanical Recycling Pipeline",
    description:
      "An in-depth video walkthrough of Bismillah Plastic's operations across Unit 1 and Unit 2 in Dinajpur — covering automated crushing, washing lines, optical purity verification, and bulk bagging.",
    category: "operational-walkthrough",
    videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    thumbnailUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787229904/www.beatsnoop.com-3000-9kZPl3OjxS_mtz7rj.jpg",
    duration: "4:18",
    order: 1,
  },
  {
    _id: "video-2",
    title: "Dual Hot & Cold Washing Lines: Removing Organic Residues",
    description:
      "Technical demonstration of the temperature-controlled washing process designed to achieve <50ppm contamination for export-ready PET and polyolefin flakes.",
    category: "operational-walkthrough",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    thumbnailUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787229103/hero-facility_cluoha.jpg",
    duration: "3:45",
    order: 2,
  },
  {
    _id: "video-3",
    title: "Empowering Female Leadership: 30 Community Collection Centers",
    description:
      "Short documentary highlighting the socio-economic advancement of women-led center managers in Dinajpur, delivering financial autonomy and structured community leadership.",
    category: "impact-stories",
    videoUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    thumbnailUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633415/www.beatsnoop.com-3000-MJzN4BhWpk_xq8vlp.jpg",
    duration: "5:12",
    order: 3,
  },
  {
    _id: "video-4",
    title: "From Informal Waste Picker to Formalized Supply Chain Partner",
    description:
      "Vignette capturing the dignity of paddle-van drivers and marginalized community collectors transitioning out of vulnerability into safe, PPE-backed employment.",
    category: "impact-stories",
    videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    thumbnailUrl:
      "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633414/www.beatsnoop.com-3000-H7qxWhOneT_pru67a.jpg",
    duration: "3:50",
    order: 4,
  },
];
