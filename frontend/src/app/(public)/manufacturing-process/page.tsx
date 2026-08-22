import ManufacturingPageContent from "@/components/manufacturing/ManufacturingPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manufacturing Process — Recycled Plastic Manufacturer | Bangladesh",
  description: "Explore our multi-stage plastic recycling and manufacturing process. From raw material sorting and crushing to hot washing, separation, and quality control.",
};

export default function ManufacturingPage() {
  return <ManufacturingPageContent />;
}
