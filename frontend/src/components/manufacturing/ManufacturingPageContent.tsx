"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CTABanner from "@/components/shared/CTABanner";
import { IMAGES } from "@/constants/images";
import { renderAppIcon } from "@/components/shared/IconRenderer";
import {
  BusinessOperationsData,
  defaultBusinessOperationsData,
} from "@/data/businessOperationsData";

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

interface ManufacturingPageContentProps {
  header?: { headline?: string; description?: string };
  banner?: any;
  operationsData?: BusinessOperationsData | null;
}

export default function ManufacturingPageContent({
  header,
  banner,
  operationsData,
}: ManufacturingPageContentProps) {
  const operations: BusinessOperationsData = {
    header: {
      ...defaultBusinessOperationsData.header,
      ...(operationsData?.header || {}),
    },
    steps:
      operationsData?.steps && operationsData.steps.length > 0
        ? operationsData.steps
        : defaultBusinessOperationsData.steps,
    sections:
      operationsData?.sections && operationsData.sections.length > 0
        ? operationsData.sections
        : defaultBusinessOperationsData.sections,
  };

  const heroImage = banner?.imageUrl || IMAGES.HERO_MANUFACTURING;
  const heroSubtitle =
    banner?.subtitle !== undefined && banner?.subtitle !== "" ? banner.subtitle : "The Process";
  const heroTitle =
    banner?.title !== undefined && banner?.title !== ""
      ? banner.title
      : (header?.headline || "Business Operations");
  const heroDescription =
    banner?.description !== undefined && banner?.description !== ""
      ? banner.description
      : (header?.description ||
        "A comprehensive look at how Bismillah Plastic manages its integrated value chain — from community-level waste collection to the delivery of high-quality recycled plastic materials.");

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 min-h-[320px] sm:min-h-[380px] flex items-center bg-brand text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={heroTitle || "Business Operations"}
            fill
            sizes="100vw"
            quality={85}
            priority
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

      {/* Intro / How It Works */}
      <section className="section-padding bg-ivory">
        <div className="container-wide max-w-5xl">
          {/* Section Header */}
          <FadeIn>
            <div className="text-center mb-14">
              {operations.header.badge && (
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-8 bg-emerald-500/60" />
                  <span className="eyebrow text-brand/70 uppercase tracking-widest text-xs font-semibold">
                    {operations.header.badge}
                  </span>
                  <div className="h-px w-8 bg-emerald-500/60" />
                </div>
              )}
              <h2 className="font-serif text-3xl sm:text-4xl text-brand font-bold leading-tight mb-5">
                {operations.header.headline}
              </h2>
              {operations.header.description && (
                <p className="text-stone-600 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg text-justify sm:text-center">
                  {operations.header.description}
                </p>
              )}
            </div>
          </FadeIn>

          {/* Process Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone-300 md:-translate-x-1/2" />

            <div className="space-y-8 sm:space-y-12">
              {operations.steps.map((step, i) => {
                const isEven = i % 2 === 0;
                return (
                  <FadeIn key={step.id || step.step || i} delay={i * 0.08}>
                    <div
                      className={`relative flex items-start md:items-center ${
                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Step Icon Circle */}
                      <div className="absolute left-4 md:left-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-brand text-white flex items-center justify-center border-2 border-ivory -translate-x-1/2 mt-1 md:mt-0 z-10 shadow-sm">
                        {renderAppIcon(step.icon, "w-3.5 h-3.5")}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`flex-1 w-full pl-14 md:pl-0 ${
                          isEven ? "md:pr-12" : "md:pl-12"
                        }`}
                      >
                        <div className="bg-white p-5 sm:p-6 rounded-sm border border-stone-200 shadow-sm hover:shadow-md hover:border-brand/20 transition-all duration-300">
                          <h3 className="font-serif text-lg sm:text-xl text-brand font-semibold mb-2">
                            {step.title}
                          </h3>
                          <p className="text-sm sm:text-base text-stone-600 leading-relaxed text-justify">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Spacer for alternating desktop layout */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Detail Sections — alternating image left/right */}
      {operations.sections.map((section, i) => (
        <section
          key={section.id || section.title || i}
          className={`section-padding ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
        >
          <div className="container-wide">
            <FadeIn>
              <div
                className={`flex flex-col ${
                  section.imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-10 lg:gap-16 items-center`}
              >
                {/* Image */}
                {section.imageUrl && (
                  <div className="w-full lg:w-[45%] flex-shrink-0">
                    <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={section.imageUrl}
                        alt={section.imageAlt || section.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className={`w-full ${section.imageUrl ? "lg:w-[55%]" : "max-w-4xl mx-auto"}`}>
                  <h2 className="font-serif text-2xl sm:text-3xl text-brand font-bold leading-tight mb-5">
                    {section.title}
                  </h2>

                  <div className="space-y-4 text-stone-600 leading-relaxed text-justify text-[15px]">
                    {section.content.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Operating Period vs Estimated Processing Capacity Table */}
                  {section.hasCapacityTable &&
                    section.capacityTable &&
                    section.capacityTable.length > 0 && (
                      <div className="overflow-x-auto mt-6">
                        <div className="border-2 border-brand rounded-sm overflow-hidden shadow-sm bg-white">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-brand text-white">
                                <th className="px-4 py-3 text-left font-semibold">
                                  Operating Period
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                  Estimated Processing Capacity
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.capacityTable.map((row, rIdx) => (
                                <tr
                                  key={row.year || rIdx}
                                  className={rIdx % 2 === 0 ? "bg-stone-50" : "bg-white"}
                                >
                                  <td
                                    className={`px-4 py-3 font-medium text-stone-700 ${
                                      rIdx !== section.capacityTable!.length - 1
                                        ? "border-b border-stone-200"
                                        : ""
                                    }`}
                                  >
                                    {row.year}
                                  </td>
                                  <td
                                    className={`px-4 py-3 text-brand font-bold ${
                                      rIdx !== section.capacityTable!.length - 1
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
                    )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      ))}

      <CTABanner
        headline="Partner With Our Recycling Operations"
        description="Contact our team to discuss material supply requirements or collection partnership opportunities."
        buttonText="Contact Us"
      />
    </>
  );
}
