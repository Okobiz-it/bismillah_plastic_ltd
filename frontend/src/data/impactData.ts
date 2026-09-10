export interface TrajectoryRow {
  year: string;
  capacity: string;
}

export interface EnvironmentalData {
  title: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  metricDiversionTitle: string;
  metricDiversionDescription: string;
  trajectory: TrajectoryRow[];
  ecosystemProtectionTitle: string;
  ecosystemProtectionDescription: string;
  closedLoopTitle: string;
  closedLoopDescription: string;
}

export interface SocialData {
  title: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  womensEmpowermentTitle: string;
  womensEmpowermentDescription: string;
  informalIntegrationTitle: string;
  informalIntegrationDescription: string;
  workerWelfareTitle: string;
  workerWelfareDescription: string;
  laborRightsTitle: string;
  laborRightsDescription: string;
}

export interface SdgItem {
  id: string;
  sdgNumbers: string;
  sdgTitles: string;
  badgeColor: string;
  narrative: string;
  proofPoint: string;
}

export interface ImpactData {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    imageUrl?: string;
  };
  stats: {
    value: string;
    label: string;
    sublabel?: string;
  }[];
  environmental: EnvironmentalData;
  social: SocialData;
  sdgs: {
    title: string;
    intro: string;
    items: SdgItem[];
  };
}

export const defaultImpactData: ImpactData = {
  hero: {
    eyebrow: "Measurable ESG & Value Creation",
    headline: "Transforming Regional Waste Into Sustainable Circular Impact",
    description:
      "Bismillah Plastic operates at the intersection of environmental conservation and social equity in northern Bangladesh — converting post-consumer plastic waste into industrial feedstock while empowering grassroots communities.",
    imageUrl: "https://res.cloudinary.com/wpttnkjq/image/upload/v1787230422/www.beatsnoop.com-3000-YVZXGzd9UQ_bs8n0t.jpg",
  },
  stats: [
    { value: "15,000 MT → 24,000 MT", label: "5-Year Processing Trajectory", sublabel: "Scaling capacity across Year 1 to Year 5" },
    { value: "30 Centers", label: "Decentralized Collection", sublabel: "100% overseen by designated women-led managers" },
    { value: "Unit 1 & Unit 2", label: "Ecosystem Defense", sublabel: "Chawliapotti & Damail intercepting multi-category plastics" },
    { value: "4 UN SDGs", label: "Global Goal Alignment", sublabel: "Documented proof points across 6 UN targets" },
  ],
  environmental: {
    title: "Environmental & Circular Economy Contribution",
    intro:
      "Our operations act as a direct and measurable intervention against regional waste management deficits in Dinajpur, preventing severe degradation of land and water ecosystems while enabling closed-loop material cycles.",
    imageUrl: "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633414/www.beatsnoop.com-3000-H7qxWhOneT_pru67a.jpg",
    imageAlt: "Environmental and circular economy contribution",
    metricDiversionTitle: "Metric-Driven Diversion",
    metricDiversionDescription:
      "Highlighting our structured five-year trajectory scaling from 15,000 MT (Year 1) to a projected 24,000 MT (Year 5) in annual processing capacity. This systematic scale provides municipal-level diversion for post-consumer waste across northern Bangladesh.",
    trajectory: [
      { year: "Year 1", capacity: "15,000 MT" },
      { year: "Year 2", capacity: "17,000 MT" },
      { year: "Year 3", capacity: "20,000 MT" },
      { year: "Year 4", capacity: "20,000 MT" },
      { year: "Year 5", capacity: "24,000 MT" },
    ],
    ecosystemProtectionTitle: "Ecosystem Protection",
    ecosystemProtectionDescription:
      "Operations at Unit 1 (Chawliapotti) and Unit 2 (Damail) directly intercept multi-category plastics — including PET, HDPE, multi-layer sachets, and end-of-life tires — preventing them from polluting Dinajpur's vital arable lands, municipal drainage networks, and surrounding river water resources.",
    closedLoopTitle: "Closed-Loop Feedstock",
    closedLoopDescription:
      "Through advanced mechanical recycling leveraging hot and cold washing, industrial crushers, and centrifugal drying, we produce clean, uniform, high-quality recycled flakes. These refined materials provide critical raw feedstock for downstream manufacturers, actively reducing industrial reliance on virgin fossil plastics.",
  },
  social: {
    title: "Social Inclusion & Livelihood Development",
    intro:
      "Circular economy success requires human dignity at its foundation. Bismillah Plastic integrates marginalized grassroots workers into a safe, formalized, and legally compliant value chain.",
    imageUrl: "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633415/www.beatsnoop.com-3000-MJzN4BhWpk_xq8vlp.jpg",
    imageAlt: "Social inclusion and livelihood development",
    womensEmpowermentTitle: "Women’s Empowerment",
    womensEmpowermentDescription:
      "A flagship decentralization strategy anchored by 30 dedicated collection centers across the Dinajpur district, specifically structured such that each individual center is systematically overseen by a designated women-led manager. This delivers economic autonomy and leadership roles to women at the grassroots level.",
    informalIntegrationTitle: "Informal Sector Integration",
    informalIntegrationDescription:
      "Documented formalization transitioning marginalized community collectors, itinerant waste pickers, and paddle-van drivers out of unregulated vulnerability into a predictable, transparent, and structured supply chain with guaranteed fair off-take.",
    workerWelfareTitle: "Worker Welfare & Safety",
    workerWelfareDescription:
      "Rigorous Occupational Health and Safety (OHS) protocols implemented across all facilities: mandatory personal protective equipment (PPE), hazard identification drills, on-site first-aid facilities, periodic health screenings, and formalized healthcare partnerships with a local hospital.",
    laborRightsTitle: "Labor Rights Compliance",
    laborRightsDescription:
      "Uncompromising zero-tolerance policies prohibiting child labor and forced labor across the enterprise and its entire subcontractor network, governed by documented gender-neutral hiring and equal opportunity frameworks.",
  },
  sdgs: {
    title: "United Nations SDG Alignment",
    intro:
      "Bismillah Plastic aligns operational metrics and governance standards directly with the United Nations Sustainable Development Goals (SDGs), delivering validated proof points on the ground in Dinajpur, Bangladesh.",
    items: [
      {
        id: "sdg-1-8",
        sdgNumbers: "SDG 1 & SDG 8",
        sdgTitles: "No Poverty & Decent Work and Economic Growth",
        badgeColor: "#E5243B",
        narrative: "Formalizing the informal economy.",
        proofPoint:
          "The enterprise actively integrates marginalized community collectors, waste pickers, and paddle-van drivers into a structured, formal supply chain. Operations generate direct and indirect employment across logistics and mechanical processing, supported by strict occupational health and safety (OHS) protocols like mandatory PPE, first-aid facilities, and formal healthcare arrangements with a local hospital.",
      },
      {
        id: "sdg-5",
        sdgNumbers: "SDG 5",
        sdgTitles: "Gender Equality",
        badgeColor: "#FF3A21",
        narrative: "Empowering female leadership at the grassroots level.",
        proofPoint:
          "The decentralized collection infrastructure relies on a network of 30 dedicated centers, each systematically overseen by a designated women-led manager. This is reinforced by documented gender-neutral hiring practices and equal opportunity frameworks targeting underrepresented groups.",
      },
      {
        id: "sdg-9-12",
        sdgNumbers: "SDG 9 & SDG 12",
        sdgTitles: "Industry, Innovation & Infrastructure / Responsible Consumption",
        badgeColor: "#F36D25",
        narrative: "Building regional circularity through industrial capacity.",
        proofPoint:
          "Bismillah Plastic addresses the local waste management infrastructure deficit in Dinajpur by operating an integrated mechanical recycling pipeline utilizing industrial crushers, washers, and dryers. This infrastructure captures mixed plastics (including PET, PVC, sachets, and tires) and scales processing capacity toward a projected 24,000 MT by Year 5, actively reducing downstream manufacturing reliance on virgin feedstocks.",
      },
      {
        id: "sdg-17",
        sdgNumbers: "SDG 17",
        sdgTitles: "Partnerships for the Goals",
        badgeColor: "#19486A",
        narrative: "Collaborative frameworks for systemic change.",
        proofPoint:
          "The operation demonstrates multi-stakeholder success by merging community-level aggregation with formalized external supplier arrangements and institutional support, specifically operating in conjunction with iDEA TREE to manage its processing scale.",
      },
    ],
  },
};
