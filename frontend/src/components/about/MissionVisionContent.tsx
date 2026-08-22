"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABanner from "@/components/shared/CTABanner";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import { IMAGES } from "@/constants/images";

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

const defaultGoals = [
  { year: "2026", title: "Carbon Neutral", description: "Achieve carbon neutrality across our warehousing and domestic logistics operations." },
  { year: "2027", title: "Global Hubs", description: "Open direct liaison offices in Dubai and Frankfurt to shorten communication loops." },
  { year: "2028", title: "Blockchain Tracking", description: "Implement blockchain-backed tracking for all raw material sourcing and export shipments." },
  { year: "2030", title: "Market Expansion", description: "Expand our export footprint to 60+ countries, primarily penetrating Latin America." }
];

export default function MissionVisionContent({ goals = [] }: { goals?: any[] }) {
  const displayGoals = goals.length > 0 ? goals : defaultGoals;
  const { companyName } = useGlobalSettings();

  return (
    <>
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 min-h-[350px] sm:min-h-[400px] flex items-center bg-brand text-white">
        <div className="absolute inset-0">
          <Image src={IMAGES.CARGO_SHIP} alt="Mission and Vision" fill sizes="100vw" quality={80} className="object-cover" />
          <div className="absolute inset-0 bg-brand/80" />
        </div>
        <div className="container-wide relative z-10">
          <SectionHeader
            eyebrow="MISSION & VISION"
            title="Purpose-Driven Trade"
            description="Our foundational principles guide everything we do, from sourcing raw materials to delivering finished goods."
            light
            centered={false}
          />
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <FadeIn>
              <div className="bg-warm-white p-6 sm:p-8 md:p-10 lg:p-14 rounded-sm border border-stone/30 shadow-sm relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gold text-white flex items-center justify-center rounded-sm font-serif text-2xl font-bold">
                  M
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-brand mb-4 sm:mb-6">Our Mission</h3>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                  To serve as the most trusted bridge between Bangladeshi producers and international markets. We are committed to empowering local industries by providing seamless, compliant, and highly efficient import-export solutions, while maintaining uncompromising quality standards in every transaction.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="bg-brand p-6 sm:p-8 md:p-10 lg:p-14 rounded-sm border border-brand shadow-sm relative text-white">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gold text-brand flex items-center justify-center rounded-sm font-serif text-2xl font-bold">
                  V
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6">Our Vision</h3>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                  To position Bangladesh as a global benchmark for recycled plastic quality and export reliability. We envision a future where &apos;Manufactured in Bangladesh&apos; is universally recognized as a hallmark of premium materials, sustainability, and ethical industrial practices.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-warm-white border-t border-stone/20">
        <div className="container-wide max-w-4xl text-center">
          <FadeIn>
            <span className="eyebrow">BUSINESS PHILOSOPHY</span>
            <h2 className="font-serif text-brand font-semibold mt-4 mb-6 sm:mb-8" style={{ fontSize: 'clamp(1.625rem, 2vw + 0.75rem, 2.25rem)' }}>
              Partnership over Procurement
            </h2>
            <div className="space-y-4 sm:space-y-6 text-text-muted leading-relaxed text-base sm:text-lg text-justify">
              <p>
                In the world of international trade, transactions are easy to come by, but true partnerships are rare. At {companyName}, our philosophy is rooted in long-term collaboration. We do not view our clients merely as buyers, nor our suppliers merely as vendors. We are stakeholders in each other&apos;s success.
              </p>
              <p>
                When we export ready-made garments to Europe, we ensure the factory workers are treated ethically and the buyer receives flawless quality. When we import raw chemicals, we ensure the local manufacturer gets the exact purity they need to keep their production line running. Trade is an ecosystem, and our philosophy is to keep it healthy, transparent, and mutually beneficial.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-brand text-white">
        <div className="container-wide">
          <SectionHeader
            eyebrow="LOOKING FORWARD"
            title="Our Future Goals"
            description="Continuous improvement and expansion to better serve our global network."
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {displayGoals.map((goal: any, i: number) => (
              <FadeIn key={goal._id || goal.year || i} delay={i * 0.1}>
                <div className="border-l-2 border-gold pl-6 py-2">
                  <span className="text-sm font-bold tracking-wider text-gold uppercase">{goal.year}</span>
                  <h4 className="font-serif text-xl font-semibold text-white mt-2 mb-2">{goal.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{goal.description || goal.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        headline="Align with Our Vision"
        description="Partner with a trading company that shares your commitment to excellence."
      />
    </>
  );
}
