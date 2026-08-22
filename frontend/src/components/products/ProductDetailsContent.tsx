"use client";

import { useState } from "react";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import QuoteModal from "@/components/shared/QuoteModal";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import Link from "next/link";
import { FaArrowLeft, FaDownload } from "react-icons/fa";

interface ProductDetailsContentProps {
  product: any;
}

export default function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 text-center">
        <h1 className="text-3xl text-brand font-serif font-bold">Product Not Found</h1>
        <Link href="/products" className="mt-4 inline-block text-brand hover:underline">
          Return to Products
        </Link>
      </div>
    );
  }

  // Collect technical specs for display
  const technicalSpecs = product.technicalSpecs || {};
  const techSpecEntries = Object.entries(technicalSpecs).filter(
    ([key, val]) => val && key !== '_id' && key !== 'otherParams'
  );

  // Collect commercial details
  const commercialDetails: [string, string][] = [];
  if (product.moq) commercialDetails.push(["MOQ", product.moq]);
  if (product.leadTime) commercialDetails.push(["Lead Time", product.leadTime]);
  if (product.stockStatus) commercialDetails.push(["Availability", product.stockStatus]);
  if (product.packaging) commercialDetails.push(["Packaging", product.packaging]);
  if (product.paymentTerms) commercialDetails.push(["Payment Terms", product.paymentTerms]);
  if (product.shippingTerms) commercialDetails.push(["Shipping Terms", product.shippingTerms]);
  if (product.monthlyProductionCapacity) commercialDetails.push(["Monthly Capacity", product.monthlyProductionCapacity]);
  if (product.availableCapacity) commercialDetails.push(["Available Capacity", product.availableCapacity]);
  if (product.exportMarkets) commercialDetails.push(["Export Markets", product.exportMarkets]);
  if (product.hsCode) commercialDetails.push(["HS Code", product.hsCode]);

  // Material details
  const materialDetails: [string, string][] = [];
  if (product.materialType) materialDetails.push(["Material Type", product.materialType]);
  if (product.color) materialDetails.push(["Color", product.color]);
  if (product.processingType) materialDetails.push(["Processing Type", product.processingType]);
  if (product.chipSize) materialDetails.push(["Chip / Pellet Size", product.chipSize]);
  if (product.gradeQuality) materialDetails.push(["Grade / Quality", product.gradeQuality]);

  return (
    <>
      <div className="bg-warm-white min-h-screen pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 md:pb-16">
        <div className="container-wide">
          {/* Breadcrumb */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-brand mb-3 transition-colors text-xs font-semibold"
          >
            <FaArrowLeft /> Back to Products
          </Link>

          <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Product Image Gallery */}
            <div className="w-full md:w-1/2 lg:w-1/2 p-3 md:p-4 flex flex-col justify-start bg-stone-50/40 border-b md:border-b-0 md:border-r border-stone-200/60">
              <ProductImageGallery
                mainImageUrl={product.imageUrl}
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 lg:w-1/2 p-4 md:p-6 flex flex-col">
              <span className="text-xs font-bold text-brand uppercase tracking-wider mb-0.5 block">
                {product.category}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-brand font-semibold mb-2">
                {product.name}
              </h1>

              {/* SKU */}
              {product.sku && (
                <p className="text-xs text-text-muted mb-3">SKU: {product.sku}</p>
              )}

              {/* Description */}
              <div className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 text-justify">
                <RichTextRenderer content={product.description} />
                
                {product.specifications && (
                  <div className="mt-4">
                    <strong className="font-bold text-brand block mb-1">Specifications:</strong> 
                    <RichTextRenderer content={product.specifications} />
                  </div>
                )}
              </div>

              {/* Material Information */}
              {materialDetails.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-serif text-base text-brand font-semibold mb-2 border-b border-stone-200 pb-1">
                    What We Provide
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                    {materialDetails.map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {key}
                        </span>
                        <span className="text-xs font-medium text-stone-800 mt-0.5">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              <div className="mb-4">
                <h3 className="font-serif text-base text-brand font-semibold mb-3 border-b border-stone-200 pb-1">
                  Technical Specifications
                </h3>
                <div className="overflow-hidden rounded border border-stone-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <tbody className="divide-y divide-stone-200">
                      {[
                        ['Intrinsic Viscosity (IV)', technicalSpecs.iv || '-'],
                        ['Moisture Content', technicalSpecs.moisture || '-'],
                        ['PVC Content', technicalSpecs.pvc || '-'],
                        ['Fines', technicalSpecs.fines || '-'],
                        ['Other Contamination', technicalSpecs.contamination || '-'],
                        ['Bulk Density', technicalSpecs.bulkDensity || '-'],
                        ['Melt Flow Index (MFI)', technicalSpecs.meltFlowIndex || '-'],
                      ].map(([label, value], idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                          <td className="py-2.5 px-4 font-semibold text-stone-600 w-1/2">{label}</td>
                          <td className="py-2.5 px-4 text-charcoal">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commercial Details */}
              {commercialDetails.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-serif text-base text-brand font-semibold mb-2 border-b border-stone-200 pb-1">
                    Commercial Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                    {commercialDetails.map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {key}
                        </span>
                        <span className="text-xs font-medium text-stone-800 mt-0.5">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {product.applications && (
                <div className="mb-4">
                  <h3 className="font-serif text-base text-brand font-semibold mb-2 border-b border-stone-200 pb-1">
                    Applications
                  </h3>
                  <div className="text-xs sm:text-sm text-stone-600">
                    <RichTextRenderer content={product.applications} />
                  </div>
                </div>
              )}

              {/* Certifications */}
              {product.certifications && (
                <div className="mb-4">
                  <h3 className="font-serif text-base text-brand font-semibold mb-2 border-b border-stone-200 pb-1">
                    Certifications
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">{product.certifications}</p>
                </div>
              )}

              {/* Origin */}
              {product.origin && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Origin:
                  </span>
                  <span className="text-xs font-semibold text-brand">
                    {product.origin}
                  </span>
                </div>
              )}

              {/* Product CTAs */}
              <div className="mt-auto pt-4 border-t border-stone-100 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="bg-brand hover:bg-brand-light text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                >
                  Get a quote
                </button>

                {product.tdsUrl && (
                  <a
                    href={product.tdsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-stone-300 hover:bg-stone-50 text-brand px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
                  >
                    <FaDownload className="w-3 h-3" />
                    Technical Data Sheet
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={product}
        defaultInquiryType="Export Quote Request"
      />
    </>
  );
}
