import BusinessOperationsPageContent from "@/components/manufacturing/ManufacturingPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Operations — Plastic Waste Collection & Mechanical Recycling | Bismillah Plastic",
  description: "Explore Bismillah Plastic's comprehensive business operations — from community-level waste collection through 30 centers to hot-wash and cold-wash processing, producing high-quality recycled plastic flakes.",
};

export default function BusinessOperationsPage() {
  return <BusinessOperationsPageContent />;
}
