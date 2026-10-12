import { IMAGES } from "@/constants/images";

export interface FacilityUnit {
  unit: string;
  location: string;
}

export interface SafetyCard {
  title: string;
  description: string;
  imageUrl: string;
}

export interface AboutOverviewData {
  story: {
    badge: string;
    heading: string;
    paragraph: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
    imageUrl: string;
  };
  facilities: {
    heading: string;
    paragraph: string;
    imageUrl: string;
    units: FacilityUnit[];
  };
  socialImpact: {
    heading: string;
    paragraph: string;
    paragraph1?: string;
    paragraph2?: string;
    imageUrl: string;
  };
  safetyFocus: {
    heading: string;
    description: string;
    cards: SafetyCard[];
  };
  conclusion: {
    heading: string;
    paragraph: string;
  };
}

export const defaultAboutOverviewData: AboutOverviewData = {
  story: {
    badge: "Our Story",
    heading: "Addressing Regional Waste Management Challenges",
    paragraph:
      "<p>Bismillah Plastic is a Bangladesh-based enterprise specializing in plastic waste collection and mechanical recycling. Operating out of the Dinajpur region, the organization addresses localized waste management challenges by systematically transforming recovered post-consumer and industrial plastics into reusable materials.</p><p>The enterprise formally commenced operations on 02 January 2016 and functions through an integrated operational model that combines community-based waste collection with advanced mechanical processing capabilities. By managing the end-to-end recovery of assorted plastic materials, Bismillah Plastic serves as a critical infrastructural link within the domestic circular economy, providing essential raw material feedstocks for downstream manufacturing sectors.</p><p>Today, the enterprise operates two primary processing facilities, manages a decentralized collection infrastructure anchored by 30 dedicated collection centers, and projects processing capacity scaling from 15,000 MT in Year 1 to 24,000 MT by Year 5 — working in conjunction with iDEA TREE as the project's development consultant.</p>",
    imageUrl: IMAGES.FACTORY_STORY,
  },
  facilities: {
    heading: "Facilities & Operating Units",
    paragraph:
      "<p>To manage its processing volumes, Bismillah Plastic operates two primary processing locations within the Dinajpur region of Bangladesh.</p>",
    imageUrl: IMAGES.ABOUT_FACILITIES,
    units: [
      { unit: "Unit 1", location: "Chawliapotti, Baluadangga, Dinajpur, Bangladesh" },
      { unit: "Unit 2", location: "Damail, Biral, Dinajpur, Bangladesh" },
    ],
  },
  socialImpact: {
    heading: "Social Impact & Worker Welfare",
    paragraph:
      "<p>Beyond environmental mitigation, the operations generate measurable socio-economic impact by providing livelihood opportunities and employment. The enterprise creates direct and indirect employment across its value chain, including roles in logistics, administration, collection, and mechanical processing. The company actively improves working conditions for the informal waste sector—specifically community collectors, waste pickers, and truck drivers—by integrating them into a formal and structured supply chain. Furthermore, Bismillah Plastic implements documented commitments to gender equality and social inclusion, which are operationalized through gender-neutral hiring practices and equal opportunity frameworks targeting underrepresented groups.</p><p>Occupational health and safety (OHS) serves as a central pillar of the organizational framework. Bismillah Plastic enforces strict worker welfare protocols and standard operating procedures to protect its workforce.</p>",
    imageUrl: IMAGES.ABOUT_SOCIAL_IMPACT,
  },
  safetyFocus: {
    heading: "Safety & Welfare Focus",
    description:
      "Comprehensive protocols ensuring the health, safety, and dignity of every worker across the value chain.",
    cards: [
      {
        title: "Occupational Training",
        description:
          "Formal OHS training, hazard identification, and risk-control education are delivered to all employees through structured onboarding and recurring refresher programs. Workers receive hands-on instruction in safe equipment operation, chemical handling procedures, and emergency response protocols to maintain a consistently safe working environment.",
        imageUrl: IMAGES.ABOUT_SAFETY_TRAINING,
      },
      {
        title: "On-Site Safety",
        description:
          "Mandatory use of appropriate Personal Protective Equipment (PPE) alongside visible hazard pictograms and emergency contact displays is enforced across all operational areas. Regular safety audits and workplace inspections are conducted to identify and remediate potential hazards before they escalate, ensuring compliance with established safety standards.",
        imageUrl: IMAGES.ABOUT_SAFETY_ONSITE,
      },
      {
        title: "Healthcare Access",
        description:
          "First-aid facilities on-site, formalized arrangements with a local hospital for employee care, and regular employee health check-ups form the healthcare foundation. Preventive health screenings and wellness programs are implemented to proactively address occupational health risks and ensure that every worker has timely access to medical attention when needed.",
        imageUrl: IMAGES.ABOUT_SAFETY_HEALTHCARE,
      },
      {
        title: "Labor Compliance",
        description:
          "Strict policies prohibiting child labor and forced labor, with mandates legally extended to all subcontractors and supply chain partners, are rigorously enforced. The enterprise maintains comprehensive documentation and conducts periodic compliance audits to verify that all labor practices align with national regulations and international ethical standards.",
        imageUrl: IMAGES.ABOUT_SAFETY_COMPLIANCE,
      },
    ],
  },
  conclusion: {
    heading: "Conclusion",
    paragraph:
      "Bismillah Plastic functions as a vital industrial stakeholder within Bangladesh's regional waste recovery infrastructure. Operating continuously since 2016, the enterprise successfully merges community-level waste aggregation with industrial-scale mechanical processing to address systemic waste management deficits. By diverting tens of thousands of metric tons of diverse plastics from improper disposal and processing them into high-quality manufacturing feedstock, Bismillah Plastic delivers measurable environmental risk mitigation, economically supports the informal labor sector, and advances the regional transition toward a circular plastics economy.",
  },
};

export interface AboutMissionVisionData {
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  valueChain: {
    badge: string;
    heading: string;
    description: string;
    paragraph1?: string;
    paragraph2?: string;
  };
}

export const defaultAboutMissionVisionData: AboutMissionVisionData = {
  mission: {
    title: "Our Mission",
    description:
      "<p>To address localized waste management challenges in the Dinajpur region by systematically transforming recovered post-consumer and industrial plastics into reusable materials. We are committed to providing essential raw material feedstocks for downstream manufacturing sectors through an integrated operational model that combines community-based waste collection with advanced mechanical processing capabilities.</p>",
  },
  vision: {
    title: "Our Vision",
    description:
      "<p>To function as a vital industrial stakeholder within Bangladesh's regional waste recovery infrastructure — delivering measurable environmental risk mitigation, economically supporting the informal labor sector, and advancing the regional transition toward a circular plastics economy where recovered plastics re-enter productive economic use.</p>",
  },
  valueChain: {
    badge: "BUSINESS PHILOSOPHY",
    heading: "Integrated Value Chain",
    description:
      "<p>Bismillah Plastic manages a comprehensive and integrated value chain that spans the entire lifecycle of plastic recycling. The operational workflow is organized into a sequential pipeline that begins at the community level and concludes with the distribution of processed industrial materials: Collection → Sorting → Aggregation → Transportation → Cleaning & Processing → Mechanical Recycling → Recycled Plastic Flakes → Downstream Manufacturing.</p><p>To sustain this workflow, the enterprise has established a decentralized collection infrastructure anchored by a network of 30 dedicated collection centers. This formalized network is strategically supported by the integration of the informal waste sector, specifically engaging waste workers and paddle-van drivers to maximize material recovery. Beyond environmental mitigation, the operations generate measurable socio-economic impact by providing livelihood opportunities across the entire value chain.</p>",
  },
};
