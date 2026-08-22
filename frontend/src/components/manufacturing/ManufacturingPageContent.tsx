"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { manufacturingSteps, sustainabilityPillars } from "@/data/manufacturingData";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABanner from "@/components/shared/CTABanner";
import { IMAGES } from "@/constants/images";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

interface ManufacturingPageContentProps {
  header?: { headline?: string; description?: string };
}

export default function ManufacturingPageContent({ header }: ManufacturingPageContentProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 min-h-[320px] sm:min-h-[380px] flex items-center bg-brand text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.HERO_MANUFACTURING}
            alt="Manufacturing Process"
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
            <span className="eyebrow text-emerald-300">Manufacturing</span>
            <div className="h-px w-8 bg-emerald-400/80" />
          </div>
          <h1 className="font-serif fluid-h1 text-white font-bold leading-tight mb-4">
            {header?.headline || "From Plastic Waste to Premium Raw Material"}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {header?.description || "Our multi-stage manufacturing process transforms post-consumer plastic waste into high-quality recycled chips and flakes ready for industrial use."}
          </p>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section-padding bg-ivory">
        <div className="container-wide max-w-4xl">
          <SectionHeader
            eyebrow="The Process"
            title="How We Manufacture"
            description="A step-by-step look at our plastic recycling and material processing operations."
          />
          <div className="mt-12 relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone-300 md:-translate-x-1/2" />
            
            <div className="space-y-8 sm:space-y-12">
              {manufacturingSteps.map((step, i) => {
                const isEven = i % 2 === 0;
                return (
                  <FadeIn key={step.step} delay={i * 0.1}>
                    <div className={`relative flex items-start md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12`}>
                      {/* Step Number Circle */}
                      <div className="absolute left-4 md:left-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm md:text-base border-4 border-ivory -translate-x-1/2 mt-1 md:mt-0 z-10">
                        {step.step}
                      </div>

                      {/* Content Box */}
                      <div className="flex-1 w-full pl-12 md:pl-0">
                        <div className={`bg-white p-5 sm:p-6 rounded-sm border border-stone-200 shadow-sm ${isEven ? 'md:mr-auto' : 'md:ml-auto'} hover:shadow-md transition-shadow duration-300`}>
                          <h3 className="font-serif text-lg text-brand font-semibold mb-2">{step.title}</h3>
                          <p className="text-sm text-stone-600 leading-relaxed text-justify">{step.description}</p>
                        </div>
                      </div>
                      
                      {/* Spacer for alternating layout on desktop */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability & Environmental Impact */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Our Impact"
            title="Commitment to the Environment"
            description="How our manufacturing operations contribute to a more sustainable plastic value chain."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {sustainabilityPillars.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 0.1}>
                <div className="bg-stone-50 border-t-4 border-t-brand border-l border-r border-b border-stone-200 rounded-b-sm p-6 sm:p-8 h-full hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-serif text-xl text-brand font-semibold mb-3">{pillar.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed text-justify">{pillar.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        headline="Ready to Source From Us?"
        description="Contact our export team to discuss your material requirements and secure supply."
        buttonText="Contact Sales"
      />
    </>
  );
}
