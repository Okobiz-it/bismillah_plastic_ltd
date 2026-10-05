import { API_BASE } from "@/lib/api";
import PhotosVideosPageContent from "@/components/media/PhotosVideosPageContent";
import { defaultPhotos, defaultVideos } from "@/data/mediaData";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Photos & Videos — Operational & Impact Showcase | Bismillah Plastic",
  description:
    "Explore our operational photo gallery and video showcase — detailing plant mechanical processing at Unit 1 and Unit 2, 30 women-led collection centers, worker safety OHS protocols, and closed-loop material recovery in Dinajpur, Bangladesh.",
};

async function getPhotos() {
  try {
    const res = await fetch(`${API_BASE}/media/photos`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

async function getVideos() {
  try {
    const res = await fetch(`${API_BASE}/media/videos`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

async function getMediaSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings/gallery`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function PhotosVideosPage() {
  const [photos, videos, settings] = await Promise.all([
    getPhotos(),
    getVideos(),
    getMediaSettings(),
  ]);

  return (
    <PhotosVideosPageContent
      photos={photos}
      videos={videos}
      settings={settings}
    />
  );
}
