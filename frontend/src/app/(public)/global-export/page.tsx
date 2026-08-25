import { API_BASE } from "@/lib/api";
import GlobalExportPageContent from "@/components/export/GlobalExportPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downstream Supply & Distribution — Recycled Plastic Flakes | Bismillah Plastic",
  description: "Supplying high-quality recycled plastic flakes to downstream manufacturers for fiber, pellet, and upcycled product production from our Dinajpur-based operations.",
};

export const dynamic = 'force-dynamic';

async function getPageData() {
  try {
    const res = await fetch(`${API_BASE}/services/headers`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getExportRegions() {
  try {
    const res = await fetch(`${API_BASE}/settings/export_regions`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function GlobalExportPage() {
  const [headers, exportRegions] = await Promise.all([getPageData(), getExportRegions()]);
  const exportHeader = headers.find((h: any) => h.category === 'global-export');
  
  return <GlobalExportPageContent header={exportHeader} exportRegions={exportRegions} />;
}
