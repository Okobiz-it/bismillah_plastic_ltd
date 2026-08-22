import AboutPageContent from "@/components/about/AboutPageContent";
import { API_BASE } from "@/lib/api";

export const dynamic = 'force-dynamic';

async function getJourney() {
  try {
    const res = await fetch(`${API_BASE}/journey`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getClients() {
  try {
    const res = await fetch(`${API_BASE}/clients`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getCertifications() {
  try {
    const res = await fetch(`${API_BASE}/certifications`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const [journey, clients, certifications] = await Promise.all([
    getJourney(),
    getClients(),
    getCertifications()
  ]);

  return <AboutPageContent journey={journey} clients={clients} certifications={certifications} />;
}
