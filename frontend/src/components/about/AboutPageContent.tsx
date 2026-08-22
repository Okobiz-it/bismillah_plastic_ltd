"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABanner from "@/components/shared/CTABanner";
import { qualityParameters } from "@/data/manufacturingData";
import LogoMarquee from "@/components/shared/LogoMarquee";
import SafeImage from "@/components/shared/SafeImage";
import ImageModal from "@/components/shared/ImageModal";
import { useState } from "react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import { IMAGES } from "@/constants/images";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
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

// Quality control icon mapping
function getQualityIcon(index: number) {
  const cls = "text-brand group-hover:text-gold transition-colors";
  const icons = [
    // 0: Raw Material Inspection — magnifying glass / eye
    <svg key="qc0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    // 1: Sorting Control — layers
    <svg key="qc1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    // 2: Washing Control — droplet
    <svg key="qc2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
    // 3: Moisture Control — thermometer
    <svg key="qc3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
    // 4: Contamination Control — shield check
    <svg key="qc4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
    // 5: Batch Testing — flask / beaker
    <svg key="qc5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M9 3h6v7l5 8a2 2 0 0 1-1.7 3H5.7A2 2 0 0 1 4 18l5-8V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>,
    // 6: Final Inspection — clipboard check
    <svg key="qc6" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="9 14 11 16 15 12"/></svg>,
    // 7: Packaging Inspection — package / box
    <svg key="qc7" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    // 8: Quality Documentation — file-text
    <svg key="qc8" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  ];
  return icons[index] || icons[0];
}

interface AboutPageContentProps {
  journey?: any[];
  clients?: any[];
  certifications?: any[];
}

export default function AboutPageContent({ journey = [], clients = [], certifications = [] }: AboutPageContentProps) {
  const [selectedCertForModal, setSelectedCertForModal] = useState<any | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const { companyName } = useGlobalSettings();

  return (
    <>
      {/* Page Header (Hero) */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image src={IMAGES.HERO_ABOUT} alt="Company Overview" fill sizes="100vw" quality={85} className="object-cover" />
          <div className="absolute inset-0 bg-brand/80" />
        </div>
        <div className="container-wide relative z-10 text-center">
          <FadeIn>
            <span className="eyebrow text-white block mb-4">ABOUT US</span>
            <h1 className="font-serif text-white font-semibold mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight" style={{ fontSize: 'clamp(2rem, 3vw + 0.75rem, 3.75rem)' }}>
              Built on Trust, Manufactured for the World
            </h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
              For over 15 years, {companyName} has transformed plastic waste into high-quality recycled raw materials — with integrity, compliance, and a relentless commitment to quality.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-warm-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div>
                <span className="eyebrow">Our Story</span>
                <h3 className="font-serif text-brand mt-3 mb-4 sm:mb-6 leading-tight" style={{ fontSize: 'clamp(1.5rem, 1.5vw + 0.75rem, 2.25rem)' }}>
                  From a Local Recycler to Global Exporter
                </h3>
                <div className="space-y-4 text-text-muted leading-relaxed">
                  <p>
                    {companyName} was founded in 2009 by Farhan Rahman, a veteran of
                    Bangladesh&rsquo;s industrial sector, with a simple conviction: that plastic 
                    waste could be transformed into high-quality, sustainable raw materials for 
                    global manufacturers.
                  </p>
                  <p>
                    What began as a small recycling unit serving a handful of domestic buyers has
                    grown into a world-class recycled plastic manufacturing facility. Today, we 
                    process over 10,000 tons of post-consumer plastic annually, maintain ISO-certified 
                    operations, and export premium PET, PP, and HDPE flakes to manufacturers across 
                    the globe from our headquarters in Dhaka and facility in Gazipur.
                  </p>
                  <p>
                    Our growth has been deliberate, not reckless. Every new product category, every
                    new market, every new warehouse has been added because our clients needed it —
                    and because we could deliver it to the standards they expect. That philosophy
                    of earned expansion, rooted in trust, defines who we are.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative rounded-sm overflow-hidden aspect-[3/4]">
                <Image
                  src={IMAGES.FACTORY_STORY}
                  alt={`${companyName} factory operations`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quality Control */}
      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <SectionHeader
            eyebrow="QUALITY CONTROL"
            title="Our Quality Standards"
            description="Each stage of production is monitored and tested to ensure material consistency and specification compliance."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {qualityParameters.map((param, i) => (
              <FadeIn key={param.title} delay={i * 0.06}>
                <div className="bg-white p-5 sm:p-6 md:p-8 rounded-sm shadow-sm border border-stone/30 hover:border-gold/40 hover:shadow-md transition-all duration-300 h-full group">
                  <div className="w-12 h-12 bg-stone/20 rounded-full flex items-center justify-center mb-6 group-cursor-pointer hover:bg-gold/10 transition-colors">
                    {getQualityIcon(i)}
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-semibold text-brand mb-3">{param.title}</h4>
                  <p className="text-sm text-text-muted leading-relaxed">{param.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Timeline */}
      <section className="section-padding bg-warm-white">
        <div className="container-wide">
          <SectionHeader
            eyebrow="OUR JOURNEY"
            title="Milestones That Define Us"
          />

          <div ref={timelineRef} className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-[1px] top-0 bottom-0 w-[2px] bg-stone">
              <motion.div
                initial={{ height: 0 }}
                animate={timelineInView ? { height: "100%" } : {}}
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-full bg-gold"
              />
            </div>

            <div className="space-y-8 sm:space-y-12">
              {journey.map((milestone, i) => (
                <FadeIn
                  key={milestone._id || milestone.year}
                  delay={i * 0.1}
                  className={`relative pl-12 md:pl-0 md:w-[calc(50%-24px)] ${i % 2 === 0 ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8"
                    }`}
                >
                  {/* Dot */}
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full bg-brand border-2 border-ivory z-10 ${i % 2 === 0
                        ? "left-[10px] md:left-auto md:-right-[30px]"
                        : "left-[10px] md:-left-[30px]"
                      }`}
                  />
                  <span className="text-sm font-bold text-gold">{milestone.year}</span>
                  <h4 className="font-serif text-lg font-semibold text-brand mt-1">
                    {milestone.subject}
                  </h4>
                  <p className="text-sm text-text-muted mt-1">{milestone.description}</p>
                </FadeIn>
              ))}
              {journey.length === 0 && (
                <div className="text-center text-stone-500 italic py-10 relative z-10 bg-warm-white">
                  Journey milestones will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Sister Concerns / Logo Marquee */}
      <section className="section-padding bg-white border-y border-stone-light group">
        <div className="container-wide mb-10 text-center">
          <FadeIn>
            <span className="eyebrow text-brand">OUR SISTER CONCERNS</span>
            <h2 className="font-serif text-brand font-semibold mt-4 mb-4" style={{ fontSize: 'clamp(1.625rem, 2vw + 0.75rem, 2.25rem)' }}>
              Our Sister Concerns & Business Entities
            </h2>
          </FadeIn>
        </div>
        <LogoMarquee clients={clients} />
      </section>

      {/* Leadership moved to /about/management */}

      {/* Certifications Strip */}
      <section className="section-padding bg-stone-light">
        <div className="container-wide">
          <SectionHeader
            eyebrow="STANDARDS & COMPLIANCE"
            title="Certifications & Compliance"
            description="We strictly adhere to global quality benchmarks, international trade compliance regulations, and sustainable sourcing practices across all our import and export operations."
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

      <CTABanner
        headline="Partner With Us"
        description={`Join the global manufacturers that trust ${companyName} for their raw material supply.`}
      />

      <ImageModal
        isOpen={!!selectedCertForModal}
        onClose={() => setSelectedCertForModal(null)}
        src={selectedCertForModal?.imageUrl}
        title={selectedCertForModal?.title || selectedCertForModal?.name}
        description={selectedCertForModal?.description}
      />
    </>
  );
}
