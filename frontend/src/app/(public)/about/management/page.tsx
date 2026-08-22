import ManagementContent from "@/components/about/ManagementContent";
import { API_BASE } from "@/lib/api";

export const dynamic = 'force-dynamic';

async function getTeam() {
  try {
    const res = await fetch(`${API_BASE}/team`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const team = await getTeam();
  return <ManagementContent team={team} />;
}
