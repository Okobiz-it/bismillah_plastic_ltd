import { API_BASE } from "@/lib/api";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials & Recycled Products — PET, HDPE, PP, LDPE, PVC, PS | Bismillah Plastic",
  description: "Browse the range of plastic materials we collect and recycle — PET, HDPE, LDPE, PVC, PP, PS, sachets, mixed waste, and tires — processed into high-quality recycled flakes for downstream manufacturing.",
};

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getRawMaterials() {
  try {
    const res = await fetch(`${API_BASE}/raw-materials`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function ProductsPage() {
  const [products, categories, rawMaterials] = await Promise.all([
    getProducts(),
    getCategories(),
    getRawMaterials(),
  ]);

  return <ProductsPageContent initialProducts={products} categories={categories} rawMaterials={rawMaterials} />;
}
