import HomePageContent from "@/components/home/HomePageContent";
import { API_BASE } from "@/lib/api";

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getSettings(key: string) {
  try {
    const res = await fetch(`${API_BASE}/settings/${key}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
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

async function getExportRegions() {
  try {
    const res = await fetch(`${API_BASE}/settings/export_regions`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getHomeBanners() {
  try {
    const res = await fetch(`${API_BASE}/home/banners`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const [products, homeSettings, clients, certifications, exportRegions, homeBanners] = await Promise.all([
    getProducts(),
    getSettings('home'),
    getClients(),
    getCertifications(),
    getExportRegions(),
    getHomeBanners(),
  ]);

  return (
    <HomePageContent
      products={products}
      homeSettings={homeSettings}
      clients={clients}
      certifications={certifications}
      exportRegions={exportRegions}
      homeBanners={homeBanners}
    />
  );
}
