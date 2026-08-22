"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CTABanner from "@/components/shared/CTABanner";
import SafeImage from "@/components/shared/SafeImage";
import { IMAGES } from "@/constants/images";
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from "react-icons/fa";

interface GalleryPhoto {
  _id: string;
  imageUrl: string;
  caption?: string;
  order: number;
}

interface GallerySettings {
  heading?: string;
  subheading?: string;
}

interface Props {
  photos: GalleryPhoto[];
  settings: GallerySettings | null;
}

const PHOTOS_PER_PAGE = 20;

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function GalleryPageContent({ photos, settings }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const heading = settings?.heading || "Our Company Gallery";
  const subheading = settings?.subheading || "A visual journey through our operations, facilities, and global partnerships.";

  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PHOTOS_PER_PAGE;
  const paginatedPhotos = photos.slice(startIndex, startIndex + PHOTOS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handlePrev = useCallback(() => {
    setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, [photos.length]);

  const closeModal = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedPhotoIndex, handlePrev, handleNext, closeModal]);

  const currentPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 min-h-[350px] sm:min-h-[400px] md:min-h-[420px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.HERO_GALLERY}
            alt="Company operations"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand/90 via-brand/80 to-brand/75" />
        </div>
        <div className="container-wide relative z-10 text-center">
          <FadeIn>
            <span className="eyebrow text-white block mb-4">COMPANY GALLERY</span>
            <h1 className="font-serif text-white font-semibold mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight" style={{ fontSize: 'clamp(2rem, 3vw + 0.75rem, 3.75rem)' }}>
              {heading}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              {subheading}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="bg-ivory min-h-[400px] sm:min-h-[550px] md:min-h-[650px] py-16 md:py-24">
        <div className="container-wide">
          {photos.length === 0 ? (
            <FadeIn>
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-stone-500 text-lg font-medium">Gallery photos coming soon.</p>
                <p className="text-stone-400 text-sm mt-2">Check back later to see our latest operations and facilities.</p>
              </div>
            </FadeIn>
          ) : (
            <>
              {/* Header / Stats count bar */}
              <FadeIn>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-stone-200" />
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest px-3">
                    {photos.length} Photo{photos.length !== 1 ? "s" : ""} · Click any photo to expand
                  </span>
                  <div className="h-px flex-1 bg-stone-200" />
                </div>
              </FadeIn>

              {/* Uniform Grid with Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {paginatedPhotos.map((photo, i) => {
                  const globalIndex = startIndex + i;
                  return (
                    <motion.div
                      key={photo._id || globalIndex}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                      onClick={() => setSelectedPhotoIndex(globalIndex)}
                      className="group flex flex-col bg-white rounded-md shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/70 overflow-hidden cursor-pointer hover:-translate-y-1"
                    >
                      {/* Image Container with 4:3 Ratio */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.caption || `Gallery photo ${globalIndex + 1}`}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading={i < 4 ? "eager" : "lazy"}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          quality={80}
                        />

                        {/* Hover Overlay with Zoom Icon */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/95 text-brand shadow-lg flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                            <FaExpand size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Centered Green Bold Serif Label Box Below Image */}
                      {photo.caption ? (
                        <div className="p-2 bg-white text-center flex items-center justify-center min-h-[42px] border-t border-stone-100">
                          <h3 className="font-serif font-bold text-brand text-sm sm:text-base leading-snug tracking-tight">
                            {photo.caption}
                          </h3>
                        </div>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 pt-8 mt-12">
                  <p className="text-xs font-medium text-stone-500">
                    Showing <span className="font-bold text-brand">{startIndex + 1}</span> to{" "}
                    <span className="font-bold text-brand">
                      {Math.min(startIndex + PHOTOS_PER_PAGE, photos.length)}
                    </span>{" "}
                    of <span className="font-bold text-brand">{photos.length}</span> photos
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs font-bold rounded bg-white text-stone-700 border border-stone-300 hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <FaChevronLeft size={10} /> Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 text-xs font-bold rounded transition-all cursor-pointer ${currentPage === pageNum
                            ? "bg-brand text-white shadow-sm"
                            : "bg-white text-stone-600 border border-stone-200 hover:border-brand hover:text-brand"
                            }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs font-bold rounded bg-white text-stone-700 border border-stone-300 hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Next <FaChevronRight size={10} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── FULL-SCREEN INTERACTIVE SLIDER MODAL ────────────────── */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && currentPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 md:p-8 select-none"
            onClick={closeModal}
          >
            {/* Top Bar: Progress & Close Controller */}
            <div
              className="w-full flex items-center justify-between text-white z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold tracking-wider bg-white/15 px-3 py-1 rounded-full text-white/90 border border-white/20 backdrop-blur-md">
                  {selectedPhotoIndex + 1} / {photos.length}
                </span>
                <span className="hidden sm:inline-block text-xs text-white/50">
                  Use ← / → arrows to slide · ESC to close
                </span>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-105"
                title="Close (Esc)"
                aria-label="Close modal"
              >
                <FaTimes size={13} />
              </button>
            </div>

            {/* Central Slide Stage with Left / Right Controllers */}
            <div
              className="relative flex-1 w-full max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Arrow Controller */}
              <button
                onClick={handlePrev}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-emerald-500/80 text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 shadow-lg shrink-0 z-20"
                title="Previous photo (Left arrow)"
                aria-label="Previous photo"
              >
                <FaChevronLeft className="text-xs sm:text-sm" />
              </button>

              {/* Photo Display Frame */}
              <div className="relative w-full h-[62vh] sm:h-[72vh] max-h-[780px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPhotoIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="relative w-full h-full flex items-center justify-center p-1 sm:p-2"
                  >
                    <SafeImage
                      src={currentPhoto.imageUrl}
                      alt={currentPhoto.caption || "Gallery photo"}
                      className="max-w-full max-h-full object-contain rounded-md shadow-2xl drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Arrow Controller */}
              <button
                onClick={handleNext}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-emerald-500/80 text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 shadow-lg shrink-0 z-20"
                title="Next photo (Right arrow)"
                aria-label="Next photo"
              >
                <FaChevronRight className="text-xs sm:text-sm" />
              </button>
            </div>

            {/* Bottom Bar: Caption Box */}
            <div
              className="w-full text-center z-20 min-h-[48px] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentPhoto.caption ? (
                <motion.div
                  key={`caption-${selectedPhotoIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/60 backdrop-blur-md border border-white/15 py-2 px-5 rounded-full inline-block max-w-2xl shadow-lg"
                >
                  <p className="font-serif text-white font-semibold text-sm sm:text-base tracking-wide">
                    {currentPhoto.caption}
                  </p>
                </motion.div>
              ) : (
                <div className="text-xs text-white/40">
                  {selectedPhotoIndex + 1} of {photos.length}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <CTABanner 
        headline="Ready to source premium recycled materials?" 
        description="Contact our team to discuss custom manufacturing and global export solutions." 
        buttonText="Get in Touch" 
        buttonHref="/contact"
      />
    </>
  );
}

