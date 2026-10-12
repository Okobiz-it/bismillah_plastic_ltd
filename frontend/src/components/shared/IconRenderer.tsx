import React from "react";
import {
  FaLeaf,
  FaRecycle,
  FaTree,
  FaWater,
  FaSeedling,
  FaSun,
  FaWind,
  FaGlobeAmericas,
  FaGlobe,
  FaMountain,
  FaIndustry,
  FaCogs,
  FaCog,
  FaTools,
  FaWarehouse,
  FaFlask,
  FaFilter,
  FaWrench,
  FaBoxes,
  FaBox,
  FaTrashAlt,
  FaTruck,
  FaShippingFast,
  FaUsers,
  FaUserTie,
  FaFemale,
  FaHandsHelping,
  FaHeartbeat,
  FaHandshake,
  FaBalanceScale,
  FaMedkit,
  FaGraduationCap,
  FaAward,
  FaShieldAlt,
  FaSmile,
  FaHome,
  FaBuilding,
  FaChartLine,
  FaChartBar,
  FaBullseye,
  FaCheckCircle,
  FaStar,
  FaTag,
  FaSearch,
  FaBarcode,
  FaClipboardCheck,
} from "react-icons/fa";

export interface AvailableIcon {
  key: string;
  label: string;
  category: "Environmental" | "Industry & Process" | "Social & Welfare" | "Metrics & General";
  icon: React.ComponentType<{ className?: string }>;
}

export const AVAILABLE_ICONS: AvailableIcon[] = [
  // Environmental
  { key: "FaLeaf", label: "Leaf", category: "Environmental", icon: FaLeaf },
  { key: "FaRecycle", label: "Recycle", category: "Environmental", icon: FaRecycle },
  { key: "FaTree", label: "Tree", category: "Environmental", icon: FaTree },
  { key: "FaWater", label: "Water / Drops", category: "Environmental", icon: FaWater },
  { key: "FaSeedling", label: "Seedling", category: "Environmental", icon: FaSeedling },
  { key: "FaSun", label: "Sun Energy", category: "Environmental", icon: FaSun },
  { key: "FaWind", label: "Wind Clean", category: "Environmental", icon: FaWind },
  { key: "FaGlobeAmericas", label: "Earth Globe", category: "Environmental", icon: FaGlobeAmericas },
  { key: "FaGlobe", label: "Global Network", category: "Environmental", icon: FaGlobe },
  { key: "FaMountain", label: "Ecosystem Nature", category: "Environmental", icon: FaMountain },

  // Industry & Process
  { key: "FaIndustry", label: "Industrial Factory", category: "Industry & Process", icon: FaIndustry },
  { key: "FaCogs", label: "Machinery Gears", category: "Industry & Process", icon: FaCogs },
  { key: "FaCog", label: "Mechanical Cog", category: "Industry & Process", icon: FaCog },
  { key: "FaTools", label: "Processing Tools", category: "Industry & Process", icon: FaTools },
  { key: "FaWarehouse", label: "Storage Center", category: "Industry & Process", icon: FaWarehouse },
  { key: "FaFlask", label: "Quality Lab Flask", category: "Industry & Process", icon: FaFlask },
  { key: "FaFilter", label: "Washing Filter", category: "Industry & Process", icon: FaFilter },
  { key: "FaWrench", label: "Maintenance Wrench", category: "Industry & Process", icon: FaWrench },
  { key: "FaBoxes", label: "Aggregated Packages", category: "Industry & Process", icon: FaBoxes },
  { key: "FaBox", label: "Sorted Box", category: "Industry & Process", icon: FaBox },
  { key: "FaTrashAlt", label: "Waste Recovery", category: "Industry & Process", icon: FaTrashAlt },
  { key: "FaTruck", label: "Logistics Truck", category: "Industry & Process", icon: FaTruck },
  { key: "FaShippingFast", label: "Fast Transportation", category: "Industry & Process", icon: FaShippingFast },

  // Social & Welfare
  { key: "FaUsers", label: "Community Workers", category: "Social & Welfare", icon: FaUsers },
  { key: "FaUserTie", label: "Management Leadership", category: "Social & Welfare", icon: FaUserTie },
  { key: "FaFemale", label: "Women Empowerment", category: "Social & Welfare", icon: FaFemale },
  { key: "FaHandsHelping", label: "Grassroots Support", category: "Social & Welfare", icon: FaHandsHelping },
  { key: "FaHeartbeat", label: "Worker Health & OHS", category: "Social & Welfare", icon: FaHeartbeat },
  { key: "FaHandshake", label: "Partnership Agreement", category: "Social & Welfare", icon: FaHandshake },
  { key: "FaBalanceScale", label: "Labor Compliance", category: "Social & Welfare", icon: FaBalanceScale },
  { key: "FaMedkit", label: "First Aid & Health", category: "Social & Welfare", icon: FaMedkit },
  { key: "FaGraduationCap", label: "Safety Training", category: "Social & Welfare", icon: FaGraduationCap },
  { key: "FaAward", label: "Quality Credential", category: "Social & Welfare", icon: FaAward },
  { key: "FaShieldAlt", label: "Ecosystem Defense", category: "Social & Welfare", icon: FaShieldAlt },
  { key: "FaSmile", label: "Worker Welfare", category: "Social & Welfare", icon: FaSmile },
  { key: "FaHome", label: "Collection Center", category: "Social & Welfare", icon: FaHome },
  { key: "FaBuilding", label: "Operating Unit", category: "Social & Welfare", icon: FaBuilding },

  // Metrics & General
  { key: "FaChartLine", label: "Trajectory Growth", category: "Metrics & General", icon: FaChartLine },
  { key: "FaChartBar", label: "Capacity Metrics", category: "Metrics & General", icon: FaChartBar },
  { key: "FaBullseye", label: "Target Diversion", category: "Metrics & General", icon: FaBullseye },
  { key: "FaCheckCircle", label: "Verified Quality", category: "Metrics & General", icon: FaCheckCircle },
  { key: "FaStar", label: "Premium Output", category: "Metrics & General", icon: FaStar },
  { key: "FaTag", label: "Flake Specification", category: "Metrics & General", icon: FaTag },
  { key: "FaSearch", label: "Sorting Inspection", category: "Metrics & General", icon: FaSearch },
  { key: "FaBarcode", label: "Batch Traceability", category: "Metrics & General", icon: FaBarcode },
  { key: "FaClipboardCheck", label: "Audit Standards", category: "Metrics & General", icon: FaClipboardCheck },
];

const ICON_MAP = new Map<string, React.ComponentType<{ className?: string }>>(
  AVAILABLE_ICONS.map((i) => [i.key, i.icon])
);

/**
 * Render an icon component by its string identifier, or fallback to default
 */
export function renderAppIcon(
  iconKey?: string,
  className = "w-4 h-4",
  fallbackIcon?: React.ReactNode
): React.ReactNode {
  if (!iconKey) {
    return fallbackIcon || <FaLeaf className={className} />;
  }

  const FoundIcon = ICON_MAP.get(iconKey);
  if (FoundIcon) {
    return <FoundIcon className={className} />;
  }

  // If iconKey is an emoji or single char string
  if (iconKey.length <= 4) {
    return <span className={className}>{iconKey}</span>;
  }

  return fallbackIcon || <FaLeaf className={className} />;
}
