"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shared/ProductCard";
import QuoteModal from "@/components/shared/QuoteModal";
import CTABanner from "@/components/shared/CTABanner";
import SectionHeader from "@/components/shared/SectionHeader";
import Pagination from "@/components/shared/Pagination";
import SafeImage from "@/components/shared/SafeImage";
import { IMAGES } from "@/constants/images";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const ITEMS_PER_PAGE = 9;

interface ProductsPageContentProps {
  initialProducts: any[];
  categories: any[];
  rawMaterials?: any[];
  banner?: any;
}

export default function ProductsPageContent({ initialProducts, categories, rawMaterials = [], banner }: ProductsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<any | null>(null);
  const [productsPage, setProductsPage] = useState(1);
  const [rawMaterialsPage, setRawMaterialsPage] = useState(1);

  const heroImage = banner?.imageUrl || IMAGES.HERO_PRODUCTS;
  const heroSubtitle = banner?.subtitle !== undefined && banner?.subtitle !== "" ? banner.subtitle : "Our Products";
  const heroTitle = banner?.title !== undefined && banner?.title !== "" ? banner.title : "Premium Recycled Plastic Materials";
  const heroDescription = banner?.description !== undefined && banner?.description !== "" ? banner.description : "High-quality PET, HDPE, LDPE, and PP recycled materials engineered for consistency and reliability across industrial manufacturing applications globally.";

  const filteredProducts = selectedCategory === "All"
    ? initialProducts
    : initialProducts.filter(p => p.category === selectedCategory);

  // Paginate products
  const totalProducts = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(
    (productsPage - 1) * ITEMS_PER_PAGE,
    productsPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setProductsPage(1);
  };

  // Paginate raw materials
  const totalRawMaterials = rawMaterials.length;
  const paginatedRawMaterials = rawMaterials.slice(
    (rawMaterialsPage - 1) * ITEMS_PER_PAGE,
    rawMaterialsPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 min-h-[320px] sm:min-h-[380px] flex items-center bg-brand text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={heroTitle || "Premium Recycled Plastic Materials"}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/90 to-brand/80" />
        </div>
        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto">
          {heroSubtitle && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-emerald-400/80" />
              <span className="eyebrow text-emerald-300">{heroSubtitle}</span>
              <div className="h-px w-8 bg-emerald-400/80" />
            </div>
          )}
          <h1 className="font-serif fluid-h1 text-white font-bold leading-tight mb-4">
            {heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* Materials & Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-wide">
          <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 block">
            Materials
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-brand leading-[1.1] max-w-3xl mb-12">
            Four polymer streams, one consistent specification.
          </h1>

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product, i) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex h-full"
                    >
                      <ProductCard
                        product={product}
                        onRequestQuote={(p) => setSelectedProductForQuote(p)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Pagination
                currentPage={productsPage}
                totalItems={totalProducts}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setProductsPage}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-stone-50 border border-stone-200 rounded-sm">
              <h3 className="text-lg font-serif text-brand mb-2">No products found</h3>
              <p className="text-sm text-stone-500">We currently don't have any products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Raw Materials */}
      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <SectionHeader
            eyebrow="RAW MATERIALS"
            title="Materials We Process"
            description="The incoming plastic materials we source, sort, and process into premium recycled products."
          />
          {paginatedRawMaterials.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-8 sm:mt-10">
                <AnimatePresence mode="popLayout">
                  {paginatedRawMaterials.map((material, i) => (
                    <motion.div
                      key={material._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                    >
                      <div className="group flex flex-col bg-white overflow-hidden h-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg rounded-xs">
                        {/* Image (0.80x smaller aspect ratio) */}
                        <div className="relative aspect-[3/2] w-full bg-stone-100 overflow-hidden shrink-0">
                          {material.imageUrl && (
                            <SafeImage
                              src={material.imageUrl}
                              alt={material.name || "Raw Material"}
                              useNextImage={true}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                            />
                          )}
                        </div>
                        {/* Content with reduced padding and full 250-character support */}
                        <div className="p-3.5 sm:p-4 flex flex-col flex-grow bg-white">
                          <h3
                            className="font-sans text-lg sm:text-[19px] font-bold text-black mb-1.5 leading-snug"
                            title={material.name}
                          >
                            {material.name}
                          </h3>
                          {material.description && (
                            <p className="text-[12.5px] sm:text-[13px] text-stone-600 leading-relaxed break-words">
                              {material.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Pagination
                currentPage={rawMaterialsPage}
                totalItems={totalRawMaterials}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setRawMaterialsPage}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-stone-50 border border-stone-200 rounded-sm mt-8">
              <h3 className="text-lg font-serif text-brand mb-2">No raw materials found</h3>
              <p className="text-sm text-stone-500">Raw materials will appear here once added.</p>
            </div>
          )}
        </div>
      </section>

      <CTABanner
        headline="Don't see what you're looking for?"
        description="We can manufacture custom grades and specifications based on your specific requirements."
        buttonText="Contact Sales"
      />

      {/* Quote Modal */}
      {selectedProductForQuote && (
        <QuoteModal
          isOpen={!!selectedProductForQuote}
          onClose={() => setSelectedProductForQuote(null)}
          product={selectedProductForQuote}
          defaultInquiryType="Export Quote Request"
        />
      )}
    </>
  );
}
