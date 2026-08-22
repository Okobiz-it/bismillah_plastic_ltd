import { API_BASE } from "@/lib/api";
import GalleryPageContent from "@/components/gallery/GalleryPageContent";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery | Bismillah Plastic",
  description: "Explore our company gallery — a visual journey through our operations, logistics facilities, and global trade partnerships.",
};

async function getGalleryPhotos() {
  try {
    const res = await fetch(`${API_BASE}/network/infrastructure`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getGallerySettings() {
  try {
    const res = await fetch(`${API_BASE}/settings/gallery`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function GalleryPage() {
  const [photos, settings] = await Promise.all([
    getGalleryPhotos(),
    getGallerySettings(),
  ]);

  return <GalleryPageContent photos={photos} settings={settings} />;
}
