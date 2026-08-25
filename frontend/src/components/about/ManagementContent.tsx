"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABanner from "@/components/shared/CTABanner";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import { teamMembers } from "@/data/content";
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

// Safely truncates HTML to a maximum number of text characters, preserving tags
function truncateHTMLString(html: string, maxLen: number) {
  let textCount = 0;
  let inTag = false;
  let result = "";
  let truncated = false;
  let currentTag = "";
  const openTags: string[] = [];

  for (let i = 0; i < html.length; i++) {
    const char = html[i];

    if (char === '<') {
      inTag = true;
      currentTag = "<";
      result += char;
      continue;
    }

    if (inTag) {
      currentTag += char;
      result += char;
      if (char === '>') {
        inTag = false;
        const isClosing = currentTag.startsWith("</");
        const isSelfClosing = currentTag.endsWith("/>") || currentTag.startsWith("<img") || currentTag.startsWith("<br");
        if (!isClosing && !isSelfClosing) {
          const match = currentTag.match(/<([a-zA-Z0-9]+)/);
          if (match) openTags.push(match[1]);
        } else if (isClosing) {
          openTags.pop();
        }
      }
      continue;
    }

    result += char;
    textCount++;

    if (textCount >= maxLen) {
      truncated = true;
      const lastSpaceIndex = result.lastIndexOf(' ');
      const lastTagClose = result.lastIndexOf('>');
      if (lastSpaceIndex > lastTagClose) {
        result = result.substring(0, lastSpaceIndex);
      }
      result += "...";
      // Close open tags to prevent breaking layout
      while (openTags.length > 0) {
        const tag = openTags.pop();
        result += `</${tag}>`;
      }
      break;
    }
  }

  return { html: result, truncated };
}

function ManagementModal({ member, onClose }: { member: any, onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!member) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-stone-600 hover:text-red-600 rounded-full shadow-sm backdrop-blur transition-colors"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-[280px] lg:w-[350px] h-[200px] sm:h-[260px] md:h-[380px] shrink-0 relative bg-stone-100 overflow-hidden">
          {member.imageUrl ? (
            <Image src={member.imageUrl} alt={member.name} fill sizes="(max-width: 768px) 100vw, 350px" quality={80} className="object-contain md:object-cover object-top" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/5 to-navy/10">
              <span className="font-serif text-8xl text-brand/15 font-bold uppercase">
                {member.name.split(" ").map((n: string) => n[0]).join("")}
              </span>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 flex flex-col max-h-[60vh] md:max-h-[85vh]">
          <div className="mb-2 border-b border-stone-100 pb-2">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-brand mb-0.5">{member.name}</h3>
            <p className="text-xs uppercase tracking-widest text-gold font-bold">{member.position || member.title}</p>

            {/* Social Links in Modal */}
            {(member.email || member.linkedin || member.whatsapp || member.twitter) && (
              <div className="flex gap-2.5 pt-1.5 mt-1">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="w-7 h-7 rounded-full bg-stone-100 cursor-pointer hover:bg-gold flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`Email ${member.name}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-stone-100 hover:bg-[#0A66C2] flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`${member.name} LinkedIn`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                )}
                {member.whatsapp && (
                  <a href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-stone-100 hover:bg-[#25D366] flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`${member.name} WhatsApp`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter.startsWith('http') ? member.twitter : `https://twitter.com/${member.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-stone-100 hover:bg-[#1DA1F2] flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`${member.name} Twitter`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 mt-2">
            <RichTextRenderer
              content={member.description || member.bio}
              className="text-stone-700 leading-relaxed text-sm md:text-base text-justify"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ManagementCard({ member, index, onSeeMore }: { member: any; index: number, onSeeMore: () => void }) {
  const bio = member.description || member.bio || "";
  const { html: truncatedBio, truncated } = truncateHTMLString(bio, 450);

  return (
    <FadeIn delay={index * 0.1}>
      <div className="group flex flex-col md:flex-row bg-white rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-1 ring-black/5 transition-all duration-300 overflow-hidden items-stretch min-h-[400px] sm:min-h-[450px] md:min-h-[450px]">
        {/* Left: Info */}
        <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col order-2 md:order-1 justify-between">
          <div>
            <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-brand group-hover:text-gold transition-colors mb-1">
              {member.name}
            </h4>
            <p className="text-xs uppercase tracking-widest text-gold font-bold mb-5">
              {member.position || member.title}
            </p>

            <div className="mb-3">
              <RichTextRenderer
                content={truncatedBio}
                className="text-stone-700 leading-relaxed text-base text-justify"
              />
              {truncated && (
                <button
                  onClick={onSeeMore}
                  className="mt-3 text-brand font-bold text-sm hover:text-gold transition-colors inline-flex items-center gap-1.5"
                >
                  See More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-100 mt-2">
            {member.email && (
              <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full bg-stone-100 cursor-pointer hover:bg-gold flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`Email ${member.name}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#0A66C2] flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`${member.name} LinkedIn`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            )}
            {member.whatsapp && (
              <a href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#25D366] flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`${member.name} WhatsApp`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              </a>
            )}
            {member.twitter && (
              <a href={member.twitter.startsWith('http') ? member.twitter : `https://twitter.com/${member.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#1DA1F2] flex items-center justify-center text-brand hover:text-white transition-colors" aria-label={`${member.name} Twitter`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* Right: Image */}
        <div className="order-1 md:order-2 w-full md:w-[280px] lg:w-[380px] shrink-0 min-h-[250px] sm:min-h-[320px] md:min-h-full relative bg-stone-100 overflow-hidden">
          {member.imageUrl ? (
            <Image src={member.imageUrl} alt={member.name} fill sizes="(max-width: 768px) 100vw, 380px" quality={80} className="object-contain md:object-cover object-center group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/5 to-navy/10 group-hover:scale-105 transition-transform duration-700">
              <span className="font-serif text-8xl text-brand/15 font-bold uppercase">
                {member.name.split(" ").map((n: string) => n[0]).join("")}
              </span>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export default function ManagementContent({ team = [] }: { team?: any[] }) {
  const displayTeam = team.length > 0 ? team : teamMembers;
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 min-h-[350px] sm:min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image src={IMAGES.HERO_MANAGEMENT} alt="Executive Leadership Team" fill sizes="100vw" quality={85} className="object-cover" />
          <div className="absolute inset-0 bg-brand/85" />
        </div>
        <div className="container-wide relative z-10 text-center">
          <FadeIn>
            <span className="eyebrow text-white block mb-4">EXECUTIVE TEAM</span>
            <h1 className="font-serif text-white font-semibold mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight" style={{ fontSize: 'clamp(2rem, 3vw + 0.75rem, 3.75rem)' }}>
              Leadership & Management
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Our team combines experience in waste management, mechanical recycling, community collection networks, and processing operations across the Dinajpur region.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-wide">
          <div className="flex flex-col gap-3 md:gap-5">
            {displayTeam.map((member: any, i: number) => (
              <ManagementCard
                key={member._id || member.name}
                member={member}
                index={i}
                onSeeMore={() => setSelectedMember(member)}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedMember && (
          <ManagementModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>

      <CTABanner
        headline="Connect With Our Team"
        description="Looking for partnership opportunities in plastic waste collection and recycling? Our team is ready to talk."
      />
    </>
  );
}
