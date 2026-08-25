"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import { companyInfo as fallbackCompanyInfo } from "@/data/siteData";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { formatExternalUrl } from "@/lib/api";
import { contactConfig } from "@/config/contactConfig";
import SimpleQuoteForm from "@/components/shared/SimpleQuoteForm";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ContactContent() {
  const searchParams = useSearchParams();
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const product = searchParams.get("product");
    if (product) {
      setProductName(product);
    }
  }, [searchParams]);

  const headOffice =
    contactConfig.offices.headOffice.address || fallbackCompanyInfo.address;
  const corpOffice = contactConfig.offices.factoryOffice.address;
  const portOffice = contactConfig.offices.portOffice.address;
  const phones = contactConfig.contactDetails.phones.length
    ? contactConfig.contactDetails.phones
    : [fallbackCompanyInfo.phone];
  const emails = contactConfig.contactDetails.emails.length
    ? contactConfig.contactDetails.emails
    : [fallbackCompanyInfo.email];
  const facebookUrl = formatExternalUrl(contactConfig.socialMedia.facebook);
  const youtubeUrl = formatExternalUrl(contactConfig.socialMedia.youtube);
  const linkedinUrl = formatExternalUrl(contactConfig.socialMedia.linkedin);
  const whatsappUrl = formatExternalUrl(contactConfig.socialMedia.whatsapp);

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 min-h-[320px] sm:min-h-[380px] flex items-center bg-brand text-white">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.HERO_CONTACT}
            alt="Contact Us & Get a Quote"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/90 to-brand/80" />
        </div>
        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto">
          <SectionHeader
            eyebrow="INQUIRIES & PARTNERSHIPS"
            title="Get in Touch"
            description="Whether you require recycled plastic flakes for downstream manufacturing, want to discuss collection partnerships, or need material specifications — our team is at your service."
            light
            centered={true}
          />
        </div>
      </section>

      {/* ─── MAIN 2-COLUMN SECTION: FORM & SIDEBAR ─────────────── */}
      <section className="section-padding bg-warm-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column - Left */}
            <div className="lg:col-span-7 xl:col-span-7">
              <FadeIn>
                <SimpleQuoteForm
                  productName={productName}
                  formTitle="Inquire About Recycled Materials"
                  formSubtitle="Submit your material requirements, company details, and inquiry below."
                  submitButtonText="Submit inquiry"
                />
              </FadeIn>
            </div>

            {/* Contact Info Sidebar - Right */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6">
              {/* Contact Details Card */}
              <FadeIn delay={0.1}>
                <div className="bg-ivory p-6 sm:p-8 border border-stone-200 shadow-sm rounded-lg">
                  <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-200">
                    <FaMapMarkerAlt className="text-brand text-base" />
                    <h3 className="font-serif text-xl font-bold text-brand">
                      Contact Details
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Location */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-brand font-bold mb-1.5 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-brand text-xs shrink-0" />
                        <span>Location</span>
                      </p>
                      <p className="text-sm text-stone-800 leading-relaxed font-medium pl-5">
                        {headOffice}
                      </p>
                    </div>

                    {/* Phone Numbers */}
                    <div className="pt-4 border-t border-stone-200/80">
                      <p className="text-xs uppercase tracking-widest text-brand font-bold mb-2 flex items-center gap-2">
                        <FaPhoneAlt className="text-brand text-xs shrink-0" />
                        <span>Phone Numbers</span>
                      </p>
                      <div className="space-y-2 text-sm text-stone-800 font-medium pl-5">
                        {phones.map((p: string, i: number) => (
                          <div key={`phone-${i}`}>
                            <a
                              href={`tel:${p.replace(/\s+/g, '')}`}
                              className="hover:text-brand transition-colors inline-block"
                            >
                              {p}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="pt-4 border-t border-stone-200/80">
                      <p className="text-xs uppercase tracking-widest text-brand font-bold mb-2 flex items-center gap-2">
                        <FaEnvelope className="text-brand text-xs shrink-0" />
                        <span>Email Address</span>
                      </p>
                      <div className="space-y-2 text-sm text-stone-800 font-medium pl-5">
                        {emails.map((em: string, i: number) => (
                          <div key={`email-${i}`}>
                            <a
                              href={`mailto:${em}`}
                              className="hover:text-brand transition-colors truncate inline-block"
                            >
                              {em}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Connect With Us Box (Hidden as requested) */}
              {/* 
              <FadeIn delay={0.2}>
                <div className="bg-brand p-6 sm:p-8 rounded-lg shadow-md text-white">
                  <h4 className="font-serif text-xl font-bold mb-3">
                    Connect With Us
                  </h4>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
                    Connect with our export desk and stay updated with shipments, manufacturing updates, and global plastic trade insights.
                  </p>

                  <div className="flex gap-2.5">
                    {facebookUrl && (
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-all shadow-sm hover:scale-105"
                        aria-label="Facebook"
                      >
                        <FaFacebookF className="text-sm text-white" />
                      </a>
                    )}
                    {youtubeUrl && (
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center transition-all shadow-sm hover:scale-105"
                        aria-label="YouTube"
                      >
                        <FaYoutube className="text-sm text-white" />
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0A66C2] flex items-center justify-center transition-all shadow-sm hover:scale-105"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedinIn className="text-sm text-white" />
                      </a>
                    )}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all shadow-sm hover:scale-105"
                        aria-label="WhatsApp"
                      >
                        <FaWhatsapp className="text-sm text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
              */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPageContent() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 container-wide flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-brand rounded-full animate-spin"></div>
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
