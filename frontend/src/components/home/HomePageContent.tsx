"use client";

import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/constants/images";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { heroStats } from "@/data/siteData";
import { manufacturingPillars, homeProcessSteps } from "@/data/manufacturingData";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import SectionHeader from "@/components/shared/SectionHeader";
import TestimonialCarousel from "@/components/shared/TestimonialCarousel";
import LogoMarquee from "@/components/shared/LogoMarquee";
import CTABanner from "@/components/shared/CTABanner";
import ProductCard from "@/components/shared/ProductCard";
import SafeImage from "@/components/shared/SafeImage";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import dynamic from "next/dynamic";

const QuoteModal = dynamic(() => import("@/components/shared/QuoteModal"), { ssr: false });
const ImageModal = dynamic(() => import("@/components/shared/ImageModal"), { ssr: false });

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HomePageContentProps {
  products: any[];
  homeSettings?: any;
  clients?: any[];
  certifications?: any[];
  exportRegions?: any[];
}

export default function HomePageContent({ products, homeSettings, clients = [], certifications = [], exportRegions = [] }: HomePageContentProps) {
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<any | null>(null);
  const [selectedCertForModal, setSelectedCertForModal] = useState<any | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

  const featuredProducts = products.filter((p: any) => p.featured).slice(0, 3);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={IMAGES.HERO_FACTORY}
            alt="Recycled plastic manufacturing facility"
            useNextImage={true}
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/75 to-charcoal/50" />
        </div>
        <div className="w-full container-wide relative z-10 py-20 sm:py-24">
          <FadeIn className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-emerald-400/80" />
              <span className="eyebrow text-emerald-400">Plastic Waste Collection & Mechanical Recycling</span>
            </div>
            <h1 className="font-serif fluid-h1 text-white font-bold leading-[1.1] tracking-tight mb-5">
              Plastic Waste Collection & Mechanical Recycling
            </h1>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
              Transforming post-consumer and industrial plastics into high-quality recycled flakes through community-based collection and advanced mechanical processing in Dinajpur, Bangladesh.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10">
              <Link href="/contact" className="px-6 sm:px-8 py-3 sm:py-3.5 bg-brand hover:bg-brand-light text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-sm transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl">
                Get a quote
              </Link>
              <Link href="/products" className="px-6 sm:px-8 py-3 sm:py-3.5 border border-white/30 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-white/10 transition-colors duration-200">
                Explore Products
              </Link>
            </div>

          </FadeIn>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-brand py-6 sm:py-8">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {heroStats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} className="text-white" />{stat.suffix}
                </div>
                <div className="text-xs sm:text-sm text-white/80 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────────────────────── */}
      {displayProducts.length > 0 && (
        <section className="section-padding bg-ivory">
          <div className="container-wide">
            <SectionHeader
              eyebrow="Our Products"
              title="Recycled Plastic Materials"
              description="High-quality recycled plastic flakes produced through mechanical recycling for downstream manufacturing."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-10">
              {displayProducts.map((product, i) => (
                <FadeIn key={product._id} delay={i * 0.08}>
                  <ProductCard product={product} onRequestQuote={(p) => setSelectedProductForQuote(p)} />
                </FadeIn>
              ))}
            </div>
            <FadeIn className="text-center mt-8">
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 border border-brand text-brand text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-brand hover:text-white transition-colors duration-200">
                View All Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ─── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Integrated Recycling Operations"
            description="From community-level waste collection to industrial-scale mechanical processing — an end-to-end plastic recycling value chain."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-10">
            {manufacturingPillars.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 0.1}>
                <Link
                  href={pillar.link}
                  className="group block h-full bg-stone-50 border border-stone-200 p-6 sm:p-7 rounded hover:border-brand hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-brand/10 text-brand rounded flex items-center justify-center mb-5 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-xs">
                    {pillar.title === "Manufacturing" || pillar.icon === "factory" ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                        <path d="M17 18h1" />
                        <path d="M12 18h1" />
                        <path d="M7 18h1" />
                      </svg>
                    ) : pillar.title === "Quality Control" || pillar.icon === "quality" ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-serif text-xl sm:text-xl text-charcoal font-semibold mb-2 group-hover:text-brand transition-colors duration-200">{pillar.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{pillar.description}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS OVERVIEW ─────────────────────────────────── */}
      <section className="section-padding bg-warm-white" ref={timelineRef}>
        <div className="container-wide">
          <SectionHeader
            eyebrow="Our Process"
            title="From Collection to Recycled Material"
            description="A systematic pipeline transforming plastic waste into reusable materials through mechanical recycling."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 sm:mt-10">
            {homeProcessSteps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="relative pl-12 border-l border-stone-200 pb-8 h-full">
                  <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold border-4 border-warm-white">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-lg text-brand font-semibold mb-1">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/business-operations" className="text-sm font-bold uppercase text-brand hover:text-brand-light flex items-center justify-center gap-2">
              Explore Full Process <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── OUR NETWORK ──────────────────────────────────────── */}
      <section className="section-padding bg-white border-y border-stone-light group">
        <div className="container-wide mb-10 text-center">
          <FadeIn>
            <span className="eyebrow text-brand">OUR NETWORK</span>
            <h2 className="font-serif text-brand font-semibold mt-4 mb-4" style={{ fontSize: 'clamp(1.625rem, 2vw + 0.75rem, 2.25rem)' }}>
              Our Collection Network & Partners
            </h2>
          </FadeIn>
        </div>
        <LogoMarquee clients={clients} />
      </section>

      {/* ─── STANDARDS & COMPLIANCE ───────────────────────────── */}
      <section className="section-padding bg-stone-light">
        <div className="container-wide">
          <SectionHeader
            eyebrow="STANDARDS & COMPLIANCE"
            title="Certifications & Compliance"
            description="We adhere to occupational health and safety standards, labor compliance regulations, and environmental best practices across all our recycling operations."
          />
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
            {certifications.map((cert: any, i: number) => (
              <FadeIn
                key={cert._id || cert.id || cert.title || cert.name}
                delay={i * 0.05}
                className="w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(20%-20px)] min-w-[140px] sm:min-w-[160px] max-w-[220px]"
              >
                <div
                  onClick={() => setSelectedCertForModal(cert)}
                  className="group cursor-pointer bg-ivory rounded-sm border border-stone/30 hover:border-gold/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between overflow-hidden min-h-[180px] sm:min-h-[220px]"
                >
                  <div className="h-32 sm:h-36 w-full relative flex items-center justify-center bg-white/60 p-3 overflow-hidden">
                    {cert.imageUrl ? (
                      <SafeImage
                        src={cert.imageUrl}
                        alt={cert.title || cert.name || "Certification"}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs tracking-wider group-hover:scale-110 transition-transform duration-300">
                        CERT
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center w-full flex-grow flex flex-col justify-center bg-ivory">
                    <p className="text-sm font-bold text-brand leading-tight mb-1 group-hover:text-gold transition-colors">{cert.title || cert.name}</p>
                    {cert.description && (
                      <p className="text-[11px] text-text-muted leading-tight line-clamp-2">{cert.description}</p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
            {certifications.length === 0 && (
              <div className="w-full text-center text-stone-500 italic text-sm py-4">
                No certifications found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── ALIGN WITH OUR VISION SECTION ────────────────────── */}
      <section className="bg-brand py-16 sm:py-20 md:py-24 text-white relative overflow-hidden">
        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto px-4">
          <FadeIn>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Partner in the Circular Economy
            </h2>
            <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Join our network as a downstream manufacturer, supplier, or collection partner.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-brand hover:bg-stone-100 px-8 py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Get a quote
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── MODALS ───────────────────────────────────────────── */}
      {selectedProductForQuote && (
        <QuoteModal
          isOpen={!!selectedProductForQuote}
          onClose={() => setSelectedProductForQuote(null)}
          product={selectedProductForQuote}
          defaultInquiryType="Export Quote Request"
        />
      )}
      {selectedCertForModal && (
        <ImageModal
          isOpen={!!selectedCertForModal}
          onClose={() => setSelectedCertForModal(null)}
          src={selectedCertForModal?.imageUrl}
          title={selectedCertForModal?.title || selectedCertForModal?.name}
          description={selectedCertForModal?.description}
        />
      )}
    </>
  );
}
