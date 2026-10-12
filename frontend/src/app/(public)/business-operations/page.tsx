import BusinessOperationsPageContent from "@/components/manufacturing/ManufacturingPageContent";
import { fetchPageBanner } from "@/lib/pageBanners";
import { API_BASE } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Operations — Plastic Waste Collection & Mechanical Recycling | Bismillah Plastic",
  description:
    "Explore Bismillah Plastic's comprehensive business operations — from community-level waste collection through 30 centers to hot-wash and cold-wash processing, producing high-quality recycled plastic flakes.",
};

export const dynamic = "force-dynamic";

async function getBusinessOperationsData() {
  try {
    const res = await fetch(`${API_BASE}/settings/business_operations`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function BusinessOperationsPage() {
  const [banner, operationsData] = await Promise.all([
    fetchPageBanner("business-operations"),
    getBusinessOperationsData(),
  ]);

  return <BusinessOperationsPageContent banner={banner} operationsData={operationsData} />;
}
