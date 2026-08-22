"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaExternalLinkAlt, FaBars } from "react-icons/fa";
import { IMAGES } from "@/constants/images";

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();

  // Derive a readable title from the current path
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "dashboard";
  const formattedTitle = lastSegment
    .charAt(0)
    .toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");

  return (
    <header className="h-14 bg-white border-b border-stone/20 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-sm shrink-0">
      {/* Left: Hamburger (mobile) + Logo (mobile) + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — only on mobile/tablet */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-brand hover:bg-stone/10 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <FaBars className="w-3.5 h-3.5" />
        </button>

        {/* Logo — only on mobile/tablet */}
        <div className="lg:hidden h-7 sm:h-8 w-24 sm:w-28 relative shrink-0">
          <Image
            src={IMAGES.MAPLE_LOGO}
            alt="Bismillah Plastic"
            fill
            sizes="120px"
            quality={100}
            priority
            className="object-contain object-left"
          />
        </div>

        {/* Page Title */}
        <h2 className="text-xs sm:text-base font-semibold text-brand truncate max-w-[120px] sm:max-w-none">
          {formattedTitle}
        </h2>
      </div>

      {/* Right: View Site button */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] sm:text-[13px] font-medium text-brand hover:text-gold bg-stone/5 hover:bg-stone/10 rounded-md transition-colors border border-stone/10"
        >
          <span className="hidden sm:inline">View Site</span>
          <span className="sm:hidden">Site</span>
          <FaExternalLinkAlt className="w-2.5 h-2.5" />
        </a>
      </div>
    </header>
  );
}
