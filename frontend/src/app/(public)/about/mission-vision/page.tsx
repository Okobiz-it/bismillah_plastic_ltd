import MissionVisionContent from "@/components/about/MissionVisionContent";
import { API_BASE } from "@/lib/api";

export const dynamic = 'force-dynamic';

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

export default async function Page() {
  const goals = await getGoals();
  return <MissionVisionContent goals={goals} />;
}
