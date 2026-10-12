import MissionVisionContent from "@/components/about/MissionVisionContent";
import { API_BASE } from "@/lib/api";
import { fetchPageBanner } from "@/lib/pageBanners";

export const dynamic = "force-dynamic";

async function getGoals() {
  try {
    const res = await fetch(`${API_BASE}/goals`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getMissionVisionContent() {
  try {
    const res = await fetch(`${API_BASE}/settings/about_mission_vision`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function Page() {
  const [goals, banner, contentData] = await Promise.all([
    getGoals(),
    fetchPageBanner("about/mission-vision"),
    getMissionVisionContent(),
  ]);

  return <MissionVisionContent goals={goals} banner={banner} contentData={contentData} />;
}
