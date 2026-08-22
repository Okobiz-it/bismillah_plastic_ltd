import { API_BASE } from "@/lib/api";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recycled Plastic Products — PET, PP, HDPE, LDPE | Bangladesh",
  description: "Browse our range of high-quality recycled plastic chips and flakes. We manufacture and export PET, PP, HDPE, and LDPE materials for industrial use.",
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
