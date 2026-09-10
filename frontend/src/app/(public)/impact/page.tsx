import { API_BASE } from "@/lib/api";
import ImpactPageContent from "@/components/impact/ImpactPageContent";
import { defaultImpactData, ImpactData } from "@/data/impactData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact & Sustainability — Environmental & Social Value | Bismillah Plastic",
  description:
    "Discover Bismillah Plastic's environmental and social impact across Dinajpur, Bangladesh — scaling circular recycling capacity from 15,000 MT to 24,000 MT, 30 women-led collection centers, and direct alignment with UN SDGs.",
};

export const dynamic = "force-dynamic";

async function getImpactData(): Promise<ImpactData> {
  try {
    const res = await fetch(`${API_BASE}/settings/impact_content`, {
      cache: "no-store",
    });
    if (!res.ok) return defaultImpactData;
    const json = await res.json();
    return json.data || defaultImpactData;
  } catch {
    return defaultImpactData;
  }
}

export default async function ImpactPage() {
  const impactData = await getImpactData();
  return <ImpactPageContent data={impactData} />;
}
