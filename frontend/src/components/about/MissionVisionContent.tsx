"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABanner from "@/components/shared/CTABanner";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import { IMAGES } from "@/constants/images";
import {
  AboutMissionVisionData,
  defaultAboutMissionVisionData,
} from "@/data/aboutData";
import RichTextRenderer from "@/components/shared/RichTextRenderer";

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

const defaultGoals = [
  { year: "Year 1", title: "15,000 MT Capacity", description: "Projected processing capacity of 15,000 metric tons of plastic waste in the first year of scaled operations." },
  { year: "Year 2", title: "17,000 MT Capacity", description: "Scaling operations to process 17,000 metric tons annually through expanded collection and processing capabilities." },
  { year: "Year 3", title: "20,000 MT Capacity", description: "Achieving 20,000 metric tons annual processing capacity through optimized operations across both processing units." },
  { year: "Year 5", title: "24,000 MT Capacity", description: "Target processing capacity of 24,000 metric tons per year, reinforcing the commercial viability of recycled plastics." },
];

interface MissionVisionContentProps {
  goals?: any[];
  banner?: any;
  contentData?: AboutMissionVisionData | null;
}

export default function MissionVisionContent({
  goals = [],
  banner,
  contentData,
}: MissionVisionContentProps) {
  const displayGoals = goals.length > 0 ? goals : defaultGoals;
  const { companyName } = useGlobalSettings();

  // Merge loaded dynamic mission/vision data with defaults
  const mv: AboutMissionVisionData = {
    mission: {
      ...defaultAboutMissionVisionData.mission,
      ...(contentData?.mission || {}),
    },
    vision: {
      ...defaultAboutMissionVisionData.vision,
      ...(contentData?.vision || {}),
    },
    valueChain: {
      ...defaultAboutMissionVisionData.valueChain,
      ...(contentData?.valueChain || {}),
    },
  };

  const heroImage = banner?.imageUrl || IMAGES.CARGO_SHIP;
  const heroSubtitle = banner?.subtitle !== undefined && banner?.subtitle !== "" ? banner.subtitle : "MISSION & VISION";
  const heroTitle = banner?.title !== undefined && banner?.title !== "" ? banner.title : "Purpose-Driven Recycling";
  const heroDescription =
    banner?.description !== undefined && banner?.description !== ""
      ? banner.description
      : "Our foundational principles guide everything we do, from community-level waste collection to industrial-scale mechanical processing.";

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 min-h-[350px] sm:min-h-[400px] flex items-center bg-brand text-white">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={heroTitle || "Mission and Vision"}
            fill
            sizes="100vw"
            quality={80}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand/80" />
        </div>
        <div className="container-wide relative z-10">
          <SectionHeader
            eyebrow={heroSubtitle}
            title={heroTitle}
            description={heroDescription}
            light
            centered={false}
          />
        </div>
      </section>

      {/* ── OUR MISSION & OUR VISION ── */}
      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-stretch">
            {/* Our Mission */}
            <FadeIn className="h-full">
              <div className="bg-warm-white p-6 sm:p-8 md:p-10 lg:p-14 rounded-sm border border-stone/30 shadow-sm relative h-full flex flex-col">
                <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-9 h-9 sm:w-12 sm:h-12 bg-gold text-white flex items-center justify-center rounded-sm font-serif text-lg sm:text-2xl font-bold shadow-xs">
                  M
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-brand mb-4 sm:mb-6">
                  {mv.mission.title}
                </h3>
                <div className="text-base sm:text-lg text-text-muted leading-relaxed flex-1 text-justify">
                  <RichTextRenderer content={mv.mission.description} />
                </div>
              </div>
            </FadeIn>

            {/* Our Vision */}
            <FadeIn delay={0.2} className="h-full">
              <div className="bg-brand p-6 sm:p-8 md:p-10 lg:p-14 rounded-sm border border-brand shadow-sm relative text-white h-full flex flex-col">
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-9 h-9 sm:w-12 sm:h-12 bg-gold text-brand flex items-center justify-center rounded-sm font-serif text-lg sm:text-2xl font-bold shadow-xs">
                  V
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6">
                  {mv.vision.title}
                </h3>
                <div className="text-base sm:text-lg text-white/80 leading-relaxed flex-1 text-justify">
                  <RichTextRenderer content={mv.vision.description} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── INTEGRATED VALUE CHAIN ── */}
      <section className="section-padding bg-warm-white border-t border-stone/20">
        <div className="container-wide max-w-4xl text-center">
          <FadeIn>
            {mv.valueChain.badge && (
              <span className="eyebrow">{mv.valueChain.badge}</span>
            )}
            <h2
              className="font-serif text-brand font-semibold mt-4 mb-6 sm:mb-8"
              style={{ fontSize: "clamp(1.625rem, 2vw + 0.75rem, 2.25rem)" }}
            >
              {mv.valueChain.heading}
            </h2>
            <div className="space-y-4 sm:space-y-6 text-text-muted leading-relaxed text-base sm:text-lg text-justify">
              {mv.valueChain.description ? (
                <RichTextRenderer content={mv.valueChain.description} />
              ) : (
                <>
                  {mv.valueChain.paragraph1 && <p>{mv.valueChain.paragraph1}</p>}
                  {mv.valueChain.paragraph2 && <p>{mv.valueChain.paragraph2}</p>}
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 5-YEAR CAPACITY / GOALS ── */}
      <section className="section-padding bg-brand text-white">
        <div className="container-wide">
          <SectionHeader
            eyebrow="OPERATIONAL SCALING"
            title="5-Year Processing Capacity"
            description="Projected throughput capabilities over a continuous five-year operational timeline."
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
        headline="Partner in the Circular Economy"
        description="Join our network as a downstream manufacturer, collection partner, or development collaborator."
      />
    </>
  );
}
