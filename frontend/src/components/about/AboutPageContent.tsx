"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABanner from "@/components/shared/CTABanner";
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
              Driving the Circular Plastics Economy
            </h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
              Since 2016, {companyName} has systematically transformed recovered post-consumer and industrial plastics into high-quality recycled materials — serving as a critical infrastructural link within the domestic circular economy.
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
                  Addressing Regional Waste Management Challenges
                </h3>
                <div className="space-y-4 text-text-muted leading-relaxed">
                  <p>
                    {companyName} is a Bangladesh-based enterprise specializing in plastic waste
                    collection and mechanical recycling. Operating out of the Dinajpur region, the
                    organization addresses localized waste management challenges by systematically
                    transforming recovered post-consumer and industrial plastics into reusable materials.
                  </p>
                  <p>
                    The enterprise formally commenced operations on 02 January 2016 and functions
                    through an integrated operational model that combines community-based waste
                    collection with advanced mechanical processing capabilities. By managing the
                    end-to-end recovery of assorted plastic materials, {companyName} serves as a
                    critical infrastructural link within the domestic circular economy, providing
                    essential raw material feedstocks for downstream manufacturing sectors.
                  </p>
                  <p>
                    Today, the enterprise operates two primary processing facilities, manages a
                    decentralized collection infrastructure anchored by 30 dedicated collection centers,
                    and projects processing capacity scaling from 15,000 MT in Year 1 to 24,000 MT
                    by Year 5 — working in conjunction with iDEA TREE as the project&rsquo;s development consultant.
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

      {/* ── FACILITIES & OPERATING UNITS ── */}
      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <FadeIn>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              {/* Image Left */}
              <div className="w-full lg:w-[45%] flex-shrink-0">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/wpttnkjq/image/upload/v1787638220/www.beatsnoop.com-3000-Sh0eLEpBiM_1_rfcu8w.jpg"
                    alt="Bismillah Plastic processing facilities"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
                </div>
              </div>
              {/* Content Right */}
              <div className="w-full lg:w-[55%]">
                <h2 className="font-serif text-2xl sm:text-3xl text-brand font-bold leading-tight mb-5">
                  Facilities &amp; Operating Units
                </h2>
                <p className="text-stone-600 leading-relaxed text-justify text-[15px] mb-6">
                  To manage its processing volumes, Bismillah Plastic operates two primary processing locations within the Dinajpur region of Bangladesh.
                </p>
                <div className="overflow-x-auto">
                  <div className="border-2 border-brand rounded-sm overflow-hidden shadow-sm">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-brand text-white">
                          <th className="px-4 py-3 text-left font-semibold">Unit Designation</th>
                          <th className="px-4 py-3 text-left font-semibold">Operational Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-stone-50">
                          <td className="px-4 py-3 border-b border-stone-200 font-medium text-stone-700">Unit 1</td>
                          <td className="px-4 py-3 border-b border-stone-200 text-stone-600">Chawliapotti, Baluadangga, Dinajpur, Bangladesh</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-3 font-medium text-stone-700">Unit 2</td>
                          <td className="px-4 py-3 text-stone-600">Damail, Biral, Dinajpur, Bangladesh</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SOCIAL IMPACT & WORKER WELFARE ── */}
      <section className="section-padding bg-warm-white">
        <div className="container-wide">
          <FadeIn>
            <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center">
              {/* Image Right */}
              <div className="w-full lg:w-[45%] flex-shrink-0">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/wpttnkjq/image/upload/v1787638551/www.beatsnoop.com-3000-h8treCAnqK_1_vridez.jpg"
                    alt="Social impact and worker welfare programs"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
                </div>
              </div>
              {/* Content Left */}
              <div className="w-full lg:w-[55%]">
                <h2 className="font-serif text-2xl sm:text-3xl text-brand font-bold leading-tight mb-5">
                  Social Impact &amp; Worker Welfare
                </h2>
                <div className="space-y-4 text-stone-600 leading-relaxed text-justify text-[15px]">
                  <p>
                    Beyond environmental mitigation, the operations generate measurable socio-economic impact by providing livelihood opportunities and employment. The enterprise creates direct and indirect employment across its value chain, including roles in logistics, administration, collection, and mechanical processing. The company actively improves working conditions for the informal waste sector—specifically community collectors, waste pickers, and truck drivers—by integrating them into a formal and structured supply chain. Furthermore, Bismillah Plastic implements documented commitments to gender equality and social inclusion, which are operationalized through gender-neutral hiring practices and equal opportunity frameworks targeting underrepresented groups.
                  </p>
                  <p>
                    Occupational health and safety (OHS) serves as a central pillar of the organizational framework. Bismillah Plastic enforces strict worker welfare protocols and standard operating procedures to protect its workforce.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SAFETY & WELFARE FOCUS ── */}
      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="font-serif text-2xl sm:text-3xl text-brand font-bold leading-tight mb-3">
                Safety &amp; Welfare Focus
              </h2>
              <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base">
                Comprehensive protocols ensuring the health, safety, and dignity of every worker across the value chain.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Occupational Training */}
            <FadeIn delay={0}>
              <div className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/wpttnkjq/image/upload/v1787633413/www.beatsnoop.com-3000-pKwyPINtJs_cbj7mz.jpg"
                    alt="Occupational training programs"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl text-brand font-semibold mb-2">Occupational Training</h3>
                  <p className="text-sm text-stone-600 leading-relaxed text-justify">
                    Formal OHS training, hazard identification, and risk-control education are delivered to all employees through structured onboarding and recurring refresher programs. Workers receive hands-on instruction in safe equipment operation, chemical handling procedures, and emergency response protocols to maintain a consistently safe working environment.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* On-Site Safety */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/wpttnkjq/image/upload/v1787633413/www.beatsnoop.com-3000-4gUYrEiqjw_rfgf2z.jpg"
                    alt="On-site safety measures and PPE"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl text-brand font-semibold mb-2">On-Site Safety</h3>
                  <p className="text-sm text-stone-600 leading-relaxed text-justify">
                    Mandatory use of appropriate Personal Protective Equipment (PPE) alongside visible hazard pictograms and emergency contact displays is enforced across all operational areas. Regular safety audits and workplace inspections are conducted to identify and remediate potential hazards before they escalate, ensuring compliance with established safety standards.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Healthcare Access */}
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/wpttnkjq/image/upload/v1787633413/www.beatsnoop.com-3000-BUzvwt7elj_jarowg.jpg"
                    alt="Healthcare access and first-aid facilities"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl text-brand font-semibold mb-2">Healthcare Access</h3>
                  <p className="text-sm text-stone-600 leading-relaxed text-justify">
                    First-aid facilities on-site, formalized arrangements with a local hospital for employee care, and regular employee health check-ups form the healthcare foundation. Preventive health screenings and wellness programs are implemented to proactively address occupational health risks and ensure that every worker has timely access to medical attention when needed.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Labor Compliance */}
            <FadeIn delay={0.3}>
              <div className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/wpttnkjq/image/upload/v1787633413/www.beatsnoop.com-3000-UWoBkt8Apl_ocb19g.jpg"
                    alt="Labor compliance and ethical policies"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl text-brand font-semibold mb-2">Labor Compliance</h3>
                  <p className="text-sm text-stone-600 leading-relaxed text-justify">
                    Strict policies prohibiting child labor and forced labor, with mandates legally extended to all subcontractors and supply chain partners, are rigorously enforced. The enterprise maintains comprehensive documentation and conducts periodic compliance audits to verify that all labor practices align with national regulations and international ethical standards.
                  </p>
                </div>
              </div>
            </FadeIn>
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

      {/* Leadership moved to /about/management */}

      {/* Certifications Strip */}
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

      {/* ── CONCLUSION ── */}
      <section className="section-padding bg-warm-white">
        <div className="container-wide max-w-4xl">
          <FadeIn>
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-brand font-bold leading-tight">
                Conclusion
              </h2>
            </div>
            <div className="relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand rounded-full hidden sm:block" />
              <div className="sm:pl-8">
                <p className="text-stone-600 leading-relaxed text-justify text-[15px] sm:text-base">
                  Bismillah Plastic functions as a vital industrial stakeholder within Bangladesh&apos;s regional waste recovery infrastructure. Operating continuously since 2016, the enterprise successfully merges community-level waste aggregation with industrial-scale mechanical processing to address systemic waste management deficits. By diverting tens of thousands of metric tons of diverse plastics from improper disposal and processing them into high-quality manufacturing feedstock, Bismillah Plastic delivers measurable environmental risk mitigation, economically supports the informal labor sector, and advances the regional transition toward a circular plastics economy.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        headline="Partner With Us"
        description={`Join the downstream manufacturers and collection partners that work with ${companyName} in the circular plastics economy.`}
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
