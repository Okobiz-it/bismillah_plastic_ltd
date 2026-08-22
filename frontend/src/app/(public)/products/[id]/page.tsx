import ProductDetailsContent from "@/components/products/ProductDetailsContent";
import { API_BASE } from "@/lib/api";

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  try {
    const url = `${API_BASE}/products/${id}`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const result = await res.json();
    return result.data;
  } catch {
    return null;
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductDetailsContent product={product} />;
}
