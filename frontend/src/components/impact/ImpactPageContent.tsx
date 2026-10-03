"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CTABanner from "@/components/shared/CTABanner";
import { ImpactData, defaultImpactData } from "@/data/impactData";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaHandsHelping,
  FaIndustry,
  FaHeartbeat,
  FaFemale,
  FaBalanceScale,
  FaRecycle,
  FaGlobeAmericas,
} from "react-icons/fa";

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

interface ImpactPageContentProps {
  data?: ImpactData | null;
}

export default function ImpactPageContent({ data }: ImpactPageContentProps) {
  const content = data || defaultImpactData;
  const { hero, stats, environmental, social, sdgs } = content;

  return (
    <>
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 min-h-[340px] sm:min-h-[400px] flex items-center bg-brand text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={hero.imageUrl || defaultImpactData.hero.imageUrl!}
            alt="Sustainability and ESG Impact"
            fill
            sizes="100vw"
            quality={85}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/90 to-brand/80" />
        </div>
        <div className="container-wide relative z-10 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-emerald-400/80" />
            <span className="eyebrow text-emerald-300">{hero.eyebrow}</span>
            <div className="h-px w-8 bg-emerald-400/80" />
          </div>
          <h1 className="font-serif fluid-h1 text-white font-bold leading-tight mb-4">
            {hero.headline}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed text-justify sm:text-center">
            {hero.description}
          </p>
        </div>
      </section>

      {/* ─── High-Level Impact Metrics Strip ───────────────────────── */}
      {stats && stats.length > 0 && (
        <section className="bg-white border-b border-stone-200 py-8">
          <div className="container-wide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <FadeIn key={idx} delay={idx * 0.08}>
                  <div className="p-4 rounded-sm border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-brand/30 hover:shadow-sm transition-all duration-300 h-full flex flex-col justify-center">
                    <span className="text-brand font-serif font-bold text-xl sm:text-2xl mb-1">
                      {stat.value}
                    </span>
                    <span className="text-sm font-semibold text-stone-800">
                      {stat.label}
                    </span>
                    {stat.sublabel && (
                      <span className="text-xs text-stone-500 mt-1">
                        {stat.sublabel}
                      </span>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Detail Section 1: Environmental & Circular Economy ───── */}
      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <FadeIn>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
              {/* Left Column: Visual Media & Highlights */}
              <div className="w-full lg:w-[46%] flex-shrink-0 lg:sticky lg:top-28">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={environmental.imageUrl}
                    alt={environmental.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
                </div>

                {/* Trajectory Table below image */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FaRecycle className="text-brand text-sm" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">
                      5-Year Processing Capacity Growth
                    </span>
                  </div>
                  <div className="border-2 border-brand rounded-sm overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-brand text-white">
                          <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wider">
                            Operating Period
                          </th>
                          <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wider">
                            Processing Capacity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {environmental.trajectory.map((row, i) => (
                          <tr
                            key={row.year}
                            className={i % 2 === 0 ? "bg-stone-50" : "bg-white"}
                          >
                            <td
                              className={`px-4 py-2.5 font-medium text-stone-700 text-xs sm:text-sm ${
                                i !== environmental.trajectory.length - 1
                                  ? "border-b border-stone-200"
                                  : ""
                              }`}
                            >
                              {row.year}
                            </td>
                            <td
                              className={`px-4 py-2.5 text-brand font-bold text-xs sm:text-sm ${
                                i !== environmental.trajectory.length - 1
                                  ? "border-b border-stone-200"
                                  : ""
                              }`}
                            >
                              {row.capacity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Environmental Pillars */}
              <div className="w-full lg:w-[54%]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-emerald-600" />
                  <span className="eyebrow text-emerald-800 font-semibold text-xs tracking-widest uppercase">
                    Environmental Stewardship
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand font-bold leading-tight mb-4">
                  {environmental.title}
                </h2>
                <p className="text-stone-600 leading-relaxed text-justify text-[15px] mb-8">
                  {environmental.intro}
                </p>

                <div className="space-y-6">
                  {/* Metric-Driven Diversion */}
                  <div className="bg-white p-5 sm:p-6 rounded-sm border border-stone-200 shadow-xs hover:border-brand/30 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand flex items-center justify-center shrink-0 mt-0.5">
                        <FaIndustry className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand mb-1.5">
                          {environmental.metricDiversionTitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">
                          {environmental.metricDiversionDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ecosystem Protection */}
                  <div className="bg-white p-5 sm:p-6 rounded-sm border border-stone-200 shadow-xs hover:border-brand/30 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand flex items-center justify-center shrink-0 mt-0.5">
                        <FaShieldAlt className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand mb-1.5">
                          {environmental.ecosystemProtectionTitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">
                          {environmental.ecosystemProtectionDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Closed-Loop Feedstock */}
                  <div className="bg-white p-5 sm:p-6 rounded-sm border border-stone-200 shadow-xs hover:border-brand/30 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand flex items-center justify-center shrink-0 mt-0.5">
                        <FaRecycle className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand mb-1.5">
                          {environmental.closedLoopTitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">
                          {environmental.closedLoopDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Detail Section 2: Social Inclusion & Livelihood ───────── */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <FadeIn>
            <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-start">
              {/* Right Column: Visual Media */}
              <div className="w-full lg:w-[46%] flex-shrink-0 lg:sticky lg:top-28">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={social.imageUrl}
                    alt={social.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
                </div>

                {/* Stat Highlight Card */}
                <div className="mt-6 bg-stone-50 p-5 rounded-sm border border-stone-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaFemale className="text-brand text-lg" />
                    <h4 className="font-serif font-bold text-brand text-base">
                      Women-Led Community Network
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed text-justify">
                    30 decentralized collection centers operated by designated female managers, creating grassroots financial autonomy and equitable leadership in Dinajpur.
                  </p>
                </div>
              </div>

              {/* Left Column: Social Pillars */}
              <div className="w-full lg:w-[54%]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-gold" />
                  <span className="eyebrow text-gold font-semibold text-xs tracking-widest uppercase">
                    Social Inclusion & Human Rights
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand font-bold leading-tight mb-4">
                  {social.title}
                </h2>
                <p className="text-stone-600 leading-relaxed text-justify text-[15px] mb-8">
                  {social.intro}
                </p>

                <div className="grid grid-cols-1 gap-5">
                  {/* Women’s Empowerment */}
                  <div className="bg-stone-50/70 p-5 sm:p-6 rounded-sm border border-stone-200 hover:border-brand/30 hover:bg-white transition-all shadow-xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FaFemale className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand mb-1.5">
                          {social.womensEmpowermentTitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">
                          {social.womensEmpowermentDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informal Sector Integration */}
                  <div className="bg-stone-50/70 p-5 sm:p-6 rounded-sm border border-stone-200 hover:border-brand/30 hover:bg-white transition-all shadow-xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FaHandsHelping className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand mb-1.5">
                          {social.informalIntegrationTitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">
                          {social.informalIntegrationDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Worker Welfare & Safety */}
                  <div className="bg-stone-50/70 p-5 sm:p-6 rounded-sm border border-stone-200 hover:border-brand/30 hover:bg-white transition-all shadow-xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FaHeartbeat className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand mb-1.5">
                          {social.workerWelfareTitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">
                          {social.workerWelfareDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Labor Rights Compliance */}
                  <div className="bg-stone-50/70 p-5 sm:p-6 rounded-sm border border-stone-200 hover:border-brand/30 hover:bg-white transition-all shadow-xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FaBalanceScale className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand mb-1.5">
                          {social.laborRightsTitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">
                          {social.laborRightsDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Detail Section 3: UN SDG Alignment ───────────────────── */}
      <section className="section-padding bg-stone-100/70 border-t border-stone-200">
        <div className="container-wide max-w-6xl">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-8 bg-brand/40" />
                <span className="eyebrow text-brand font-semibold text-xs tracking-widest uppercase">
                  Global Framework
                </span>
                <div className="h-px w-8 bg-brand/40" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand font-bold leading-tight mb-4">
                {sdgs.title}
              </h2>
              <p className="text-stone-600 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg text-justify sm:text-center">
                {sdgs.intro}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {sdgs.items.map((item, idx) => (
              <FadeIn key={item.id} delay={idx * 0.08} className="h-full flex flex-col">
                <div className="bg-white rounded-sm border border-stone-200 shadow-sm hover:shadow-md hover:border-brand/40 transition-all duration-300 flex flex-col h-full min-h-[460px] sm:min-h-[470px] md:min-h-[480px] overflow-hidden">
                  {/* SDG Card Header */}
                  <div
                    className="px-6 py-4 text-white flex items-center justify-between min-h-[96px] md:min-h-[104px]"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    <div className="flex-1 pr-3">
                      <span className="text-xs uppercase font-bold tracking-wider opacity-90 block mb-1">
                        {item.sdgNumbers}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                        {item.sdgTitles}
                      </h3>
                    </div>
                    <FaGlobeAmericas className="text-white/40 text-2xl shrink-0 ml-2" />
                  </div>

                  {/* SDG Card Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* The Narrative */}
                    <div className="min-h-[68px] sm:min-h-[76px] flex flex-col justify-start">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          The Narrative
                        </span>
                      </div>
                      <p className="font-serif text-base font-semibold text-brand italic leading-snug">
                        "{item.narrative}"
                      </p>
                    </div>

                    <div className="h-px w-full bg-stone-100 my-4" />

                    {/* The Proof Point */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCheckCircle className="text-brand text-xs shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider text-brand">
                          The Proof Point
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed text-justify">
                        {item.proofPoint}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <CTABanner
        headline="Partner With Our Circular Economy & Impact Initiatives"
        description="Collaborate with Bismillah Plastic to scale plastic waste diversion, champion grassroots women-led inclusion, and build high-integrity recycled supply chains."
        buttonText="Get in Touch"
      />
    </>
  );
}
