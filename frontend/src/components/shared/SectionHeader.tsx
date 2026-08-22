"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`mb-8 md:mb-12 lg:mb-16 ${centered ? "text-center" : ""}`}
    >
      <span className={`eyebrow ${light ? "text-white" : "text-brand"}`}>{eyebrow}</span>
      <h2
        className={`font-serif font-semibold mt-3 leading-[1.15] ${
          light ? "text-white" : "text-brand"
        }`}
        style={{ fontSize: 'clamp(1.625rem, 2vw + 0.75rem, 3rem)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/60" : "text-text-muted"}`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
