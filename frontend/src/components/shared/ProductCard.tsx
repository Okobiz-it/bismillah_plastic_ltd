"use client";

import Link from "next/link";
import SafeImage from "@/components/shared/SafeImage";
import { IMAGES } from "@/constants/images";

interface ProductCardProps {
  product: any;
  onRequestQuote?: (product: any) => void;
}

export default function ProductCard({ product, onRequestQuote }: ProductCardProps) {
  const imgSrc = product?.imageUrl || product?.image || IMAGES.PLACEHOLDER;
  const productUrl = product._id ? `/products/${product._id}` : "#";

  const formatName = (name?: string, maxChars = 45) => {
    if (!name) return "";
    const cleanText = name.trim();
    if (cleanText.length <= maxChars) return cleanText;
    return cleanText.slice(0, maxChars).trim() + "...";
  };

  const formatDescription = (desc?: string, maxChars = 140) => {
    if (!desc) return "";
    const cleanText = desc.replace(/<[^>]*>/g, "").trim();
    if (cleanText.length <= maxChars) return cleanText;
    return cleanText.slice(0, maxChars).trim() + "...";
  };

  // Determine resin code based on common polymer names, categories, or material types
  let resinCode = "";
  const nameUpper = `${product.name || ""} ${product.category || ""} ${product.materialType || ""}`.toUpperCase();
  if (nameUpper.includes("PET")) resinCode = "1";
  else if (nameUpper.includes("HDPE")) resinCode = "2";
  else if (nameUpper.includes("PVC")) resinCode = "3";
  else if (nameUpper.includes("LDPE")) resinCode = "4";
  else if (nameUpper.includes("PP")) resinCode = "5";
  else if (nameUpper.includes("PS")) resinCode = "6";

  // Dynamically select exactly 4 key specs to display
  const getSpecsList = () => {
    const specs: { label: string; value: string }[] = [];
    const ts = product.technicalSpecs || {};

    const isValid = (val: any) =>
      val && typeof val === "string" && val.trim() !== "" && val.toUpperCase() !== "N/A" && val !== "-";

    // 1. Flow property: IV for PET, or MFI for others
    if (isValid(ts.iv)) {
      specs.push({ label: "IV value", value: ts.iv });
    } else if (isValid(ts.meltFlowIndex) || isValid(ts.mfi)) {
      specs.push({ label: "MFI", value: ts.meltFlowIndex || ts.mfi });
    }

    // 2. Density
    const density = ts.bulkDensity || ts.density;
    if (isValid(density)) {
      specs.push({ label: "Density", value: density });
    }

    // 3. Moisture
    if (isValid(ts.moisture)) {
      specs.push({ label: "Moisture", value: ts.moisture });
    }

    // 4. Contamination or PVC content
    if (isValid(ts.contamination)) {
      specs.push({ label: "Contamination", value: ts.contamination });
    } else if (isValid(ts.pvc)) {
      specs.push({ label: "PVC content", value: ts.pvc });
    }

    // Fallback metrics if we don't have 3 items yet
    if (specs.length < 3 && isValid(ts.ashContent)) {
      specs.push({ label: "Ash Content", value: ts.ashContent });
    }
    if (specs.length < 3 && isValid(ts.meltingPoint)) {
      specs.push({ label: "Melting Point", value: ts.meltingPoint });
    }

    // Keep top 3 specs so Packing is always the 4th
    const finalSpecs = specs.slice(0, 3);

    // 4th row: Packing
    finalSpecs.push({
      label: "Packing",
      value: product.packaging || "25 kg bags / 1 MT jumbo",
    });

    return finalSpecs.slice(0, 4);
  };

  const CardContent = (
    <div className="group flex flex-col bg-white overflow-hidden h-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-[6/5] w-full bg-stone-100 overflow-hidden shrink-0">
        {imgSrc && (
          <SafeImage
            src={imgSrc}
            alt={product.name || "Product Image"}
            useNextImage={true}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white">
        {/* Resin Code */}
        {resinCode && (
          <div className="mb-1.5">
            <span className="text-[10px] font-bold text-stone-400 tracking-[0.15em] uppercase truncate block">
              RESIN CODE {resinCode}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className="font-sans text-xl sm:text-[22px] font-bold text-black mb-1 leading-snug line-clamp-2"
          title={product.name}
        >
          {formatName(product.name, 48)}
        </h3>
        
        {/* Subtitle (Category) */}
        <p className="text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-widest mb-3 line-clamp-1 leading-snug">
          {product.category || product.materialType || ""}
        </p>

        {/* Description */}
        <p className="text-[13px] sm:text-sm text-stone-600 mb-4 leading-relaxed line-clamp-3">
          {formatDescription(product.description, 160)}
        </p>

        {/* Technical Specs Table-like List (Exact 4 rows) */}
        <div className="mt-auto flex flex-col w-full text-[12px] sm:text-[13px]">
          {getSpecsList().map((spec, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-t border-stone-200"
            >
              <span className="text-stone-500 shrink-0 pr-2">{spec.label}</span>
              <span className="font-semibold text-black truncate text-right">
                {spec.value}
              </span>
            </div>
          ))}

          {/* View Specifications CTA (Green by default) */}
          <div className="mt-4 border-t border-stone-200/60 pt-3 flex justify-end">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand hover:text-brand-light transition-colors tracking-widest uppercase">
              View Specifications 
              <span className="transition-transform group-hover:translate-x-1 duration-300">
                →
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={productUrl} className="block w-full h-full cursor-pointer outline-none focus:ring-2 focus:ring-brand/50 rounded-sm">
      {CardContent}
    </Link>
  );
}
