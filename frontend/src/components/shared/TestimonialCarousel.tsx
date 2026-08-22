"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import { API_BASE } from "@/lib/api";
import RichTextRenderer from "@/components/shared/RichTextRenderer";

interface Testimonial {
  _id: string;
  authorName: string;
  authorTitle: string;
  quote: string;
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        const data = await res.json();
        setTestimonials(data.data || []);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = testimonials.length;
  const totalSlides = Math.ceil(total / itemsPerSlide);

  // Ensure currentSlide is within bounds if resize changes totalSlides
  useEffect(() => {
    if (totalSlides > 0 && currentSlide >= totalSlides) {
      setCurrentSlide(Math.max(0, totalSlides - 1));
    }
  }, [totalSlides, currentSlide]);

  const next = useCallback(() => {
    if (totalSlides > 0) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  const prev = () => {
    if (totalSlides > 0) {
      setCurrentSlide((p) => (p - 1 + totalSlides) % totalSlides);
    }
  };

  // Auto-advance every 6s
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, totalSlides]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-brand text-2xl" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="text-center py-12 px-6 max-w-lg mx-auto bg-white/40 backdrop-blur-sm rounded-lg border border-brand/10 shadow-xs">
        <p className="font-serif text-lg text-brand font-medium">No testimonials found</p>
        <p className="text-xs text-text-muted mt-1">Client reviews and feedback will be displayed here.</p>
      </div>
    );
  }

  const getVisibleTestimonials = () => {
    const start = currentSlide * itemsPerSlide;
    return testimonials.slice(start, start + itemsPerSlide);
  };

  const visible = getVisibleTestimonials();

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentSlide}-${itemsPerSlide}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center md:text-left"
        >
          {visible.map((t) => (
            <div
              key={t._id}
              className="flex flex-col justify-between bg-white/40 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-sm border border-brand/10 shadow-xs hover:border-brand/30 hover:bg-white/60 transition-all duration-300"
            >
              <RichTextRenderer
                content={t.quote}
                className="font-serif text-base sm:text-lg md:text-xl text-brand italic leading-relaxed font-light"
              />

              <div className="mt-6">
                <p className="text-base font-semibold text-brand">{t.authorName}</p>
                <p className="text-sm text-text-muted mt-0.5">
                  {t.authorTitle}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-12">
          <button
            onClick={prev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-stone flex items-center justify-center text-brand/40 cursor-pointer hover:text-brand hover:border-brand/30 transition-colors"
            aria-label="Previous testimonials"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-brand w-6" : "bg-stone"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-stone flex items-center justify-center text-brand/40 cursor-pointer hover:text-brand hover:border-brand/30 transition-colors"
            aria-label="Next testimonials"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
