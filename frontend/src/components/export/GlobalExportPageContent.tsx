"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABanner from "@/components/shared/CTABanner";
import SafeImage from "@/components/shared/SafeImage";
import { IMAGES } from "@/constants/images";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

interface GlobalExportPageContentProps {
  header?: { headline?: string; description?: string };
  exportRegions?: any[];
}

export default function GlobalExportPageContent({ header, exportRegions = [] }: GlobalExportPageContentProps) {
  const logisticsSteps = [
    { title: "Community Collection", description: "Plastic waste is recovered through 30 dedicated collection centers across the Dinajpur region, engaging waste workers and paddle-van drivers." },
    { title: "Aggregation & Transport", description: "Collected materials are aggregated at local centers and transported directly to our processing facilities at Chawliapotti, Baluadangga and Damail, Biral." },
    { title: "Mechanical Recycling", description: "Materials undergo sorting, cleaning (hot-wash and cold-wash), crushing, and drying through our industrial processing equipment." },
    { title: "Downstream Supply", description: "High-quality recycled plastic flakes are supplied to downstream manufacturers for fiber, pellet, and upcycled product production." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 min-h-[320px] sm:min-h-[380px] flex items-center bg-brand text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.HERO_GLOBAL_EXPORT}
            alt="Global Export Logistics"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/90 to-brand/80" />
        </div>
        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-emerald-400/80" />
            <span className="eyebrow text-emerald-300">Global Reach</span>
            <div className="h-px w-8 bg-emerald-400/80" />
          </div>
          <h1 className="font-serif fluid-h1 text-white font-bold leading-tight mb-4">
            {header?.headline || "Supplying Recycled Materials to Downstream Manufacturers"}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {header?.description || "From community-level collection to industrial-scale processing, we supply high-quality recycled plastic flakes to manufacturers across domestic and international markets."}
          </p>
        </div>
      </section>

      {/* Global Map Section */}
      {exportRegions.length > 0 && (
        <section className="section-padding bg-ivory">
          <div className="container-wide">
            <SectionHeader
              eyebrow="Distribution Network"
              title="Our Reach"
              description="Supplying recycled plastic flakes to downstream manufacturers across multiple markets."
            />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exportRegions.map((region, i) => (
                <div key={i} className="bg-white p-6 rounded border border-stone-200 shadow-sm">
                  <h3 className="text-xl font-bold text-brand font-serif mb-2">{region.name}</h3>
                  <p className="text-sm text-stone-500 mb-4">{region.countries}</p>
                  <div className="flex flex-col gap-1 text-xs font-semibold text-stone-700">
                    <span>Products: <span className="font-normal text-stone-500">{region.keyProducts}</span></span>
                    <span>Reach: <span className="font-normal text-stone-500">{region.stats}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Export Logistics Section */}
      <section className="section-padding bg-warm-white">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <div className="relative aspect-[4/3] w-full rounded-sm overflow-hidden shadow-lg border border-stone-200">
                  <SafeImage
                    src={IMAGES.HERO_PORT}
                    alt="Container shipping at port"
                    useNextImage={true}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-brand/10 mix-blend-multiply" />
                </div>
              </FadeIn>
            </div>
            
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="eyebrow text-accent">Logistics</span>
                </div>
                <h2 className="font-serif fluid-h3 text-brand font-bold mb-6">Integrated Supply Chain</h2>
                
                <div className="space-y-6">
                  {logisticsSteps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-brand mb-1">{step.title}</h4>
                        <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        headline="Partner With Our Supply Network"
        description="Whether you're a downstream manufacturer or a potential collection partner, we're ready to discuss opportunities."
        buttonText="Contact Us"
      />
    </>
  );
}
