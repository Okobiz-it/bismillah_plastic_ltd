"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import SafeImage from "@/components/shared/SafeImage";
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { IMAGES } from "@/constants/images";

interface ProductImageGalleryProps {
  images?: string[];
  mainImageUrl?: string;
  productName: string;
  productType?: string;
  isFeatured?: boolean;
}

export default function ProductImageGallery({
  images = [],
  mainImageUrl = "",
  productName,
  productType,
  isFeatured = false,
}: ProductImageGalleryProps) {
  // Filter only valid image strings (remove duplicates, empty strings, and placeholder SVGs)
  const validImages = Array.from(
    new Set([mainImageUrl, ...(images || [])].filter((url): url is string => {
      return Boolean(
        url &&
        typeof url === "string" &&
        url.trim() !== "" &&
        !url.includes("placeholder_") &&
        !url.endsWith(".svg")
      );
    }))
  );

  // If no valid uploaded images exist, fallback to mainImageUrl or placeholder
  const imageList = validImages.length > 0 ? validImages : [mainImageUrl || IMAGES.PLACEHOLDER];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSrc = imageList[activeIndex] || imageList[0];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeIndex, activeSrc]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePrev = (e?: MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    setIsLoading(true);
  };

  const handleNext = (e?: MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] max-h-[420px] rounded-lg overflow-hidden bg-stone-950/5 border border-stone-200/80 group cursor-zoom-in select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Ambient Blurred Background (Eliminates harsh letterboxing) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <SafeImage
            src={activeSrc}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-125 opacity-35 brightness-95 filter transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-900/10" />
        </div>

        {/* Skeleton Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-stone-100/90 backdrop-blur-xs animate-pulse z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-brand/20 border-t-brand rounded-full animate-spin" />
          </div>
        )}

        {/* Main Uncropped Product Image */}
        <div className="relative w-full h-full p-2 flex items-center justify-center z-0">
          <SafeImage
            src={activeSrc}
            alt={productName}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            className={`max-w-full max-h-full object-contain transition-all duration-300 ${
              isHovered ? "scale-125 opacity-0 md:opacity-100" : "scale-100 opacity-100"
            }`}
            style={
              isHovered
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
          {productType && (
            <span className="px-3 py-1 bg-brand/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider rounded shadow-md border border-white/10">
              {productType}
            </span>
          )}
          {isFeatured && (
            <span className="px-3 py-1 bg-gold text-white text-[11px] font-bold uppercase tracking-wider rounded shadow-md flex items-center gap-1 border border-white/20">
              <FaStar className="text-[10px]" /> Featured
            </span>
          )}
        </div>

        {/* Fullscreen Expand Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-stone-700 hover:text-brand hover:bg-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-105 cursor-pointer"
          title="View Fullscreen"
          aria-label="Expand image"
        >
          <FaExpand className="text-xs" />
        </button>

        {/* Gallery Navigation Overlay Arrows (If > 1 image) */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md text-stone-800 hover:bg-white hover:text-brand flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md text-stone-800 hover:bg-white hover:text-brand flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Gallery Strip (Only when multiple real images exist) */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-2.5 px-1 overflow-x-auto py-1 scrollbar-thin">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setIsLoading(true);
              }}
              className={`relative w-12 h-12 rounded-md border-2 overflow-hidden shrink-0 transition-all duration-200 cursor-pointer bg-stone-100 ${
                activeIndex === idx
                  ? "border-brand ring-2 ring-brand/25 shadow-sm scale-105"
                  : "border-stone-200/90 hover:border-brand/50 opacity-75 hover:opacity-100"
              }`}
            >
              <SafeImage
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="font-serif text-lg font-bold">{productName}</h3>
              <p className="text-xs text-stone-400">
                Image {activeIndex + 1} of {imageList.length}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Main Fullscreen Preview */}
          <div
            className="relative flex-1 w-full max-w-6xl flex items-center justify-center p-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={activeSrc}
              alt={productName}
              className="max-w-full max-h-[80vh] object-contain drop-shadow-2xl animate-fadeIn"
            />

            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                  aria-label="Previous"
                >
                  <FaChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                  aria-label="Next"
                >
                  <FaChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Footer Thumbnails (If > 1) */}
          {imageList.length > 1 && (
            <div
              className="w-full max-w-md flex justify-center items-center gap-2 pt-2 shrink-0 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-12 h-12 rounded border-2 overflow-hidden transition-all cursor-pointer ${
                    activeIndex === idx
                      ? "border-gold scale-110 shadow-lg"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <SafeImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
