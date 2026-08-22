"use client";

import { clientLogos } from "@/data/content";
import { getOptimizedCloudinaryUrl } from "@/lib/images";

export default function LogoMarquee({ clients = [] }: { clients?: any[] }) {
  // Use dynamic clients if provided and not empty, otherwise fallback to static data
  const dataToUse = clients.length > 0 ? clients : clientLogos;

  if (!dataToUse || dataToUse.length === 0) return null;

  // Ensure one track has enough items to exceed wide screens (>2000px)
  const minItemsPerTrack = 8;
  const multiplier = Math.max(1, Math.ceil(minItemsPerTrack / dataToUse.length));
  const trackItems = Array(multiplier).fill(dataToUse).flat();

  return (
    <div className="overflow-hidden w-full relative py-4 group flex select-none">
      {/* Left/Right Subtle Fade Gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-warm-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-warm-white to-transparent z-10" />

      {/* Track 1 */}
      <div className="flex shrink-0 items-center animate-marquee-loop">
        {trackItems.map((logo, i) => (
          <div
            key={`track1-${logo._id || logo.id || i}-${i}`}
            className="flex-shrink-0 px-4 sm:px-6 md:px-8 flex items-center justify-center w-[160px] sm:w-[200px] md:w-[240px] h-20 sm:h-24 md:h-28"
          >
            {logo.imageUrl ? (
              <img
                src={getOptimizedCloudinaryUrl(logo.imageUrl, { width: 300, height: 150 })}
                alt={logo.name || "Client Logo"}
                width={200}
                height={100}
                loading="lazy"
                decoding="async"
                className="max-h-16 sm:max-h-20 md:max-h-24 w-auto max-w-full object-contain transition-transform duration-300 hover:scale-110 drop-shadow-sm"
              />
            ) : (
              <div className="flex items-center justify-center h-14 sm:h-16 px-6 border border-stone-200 rounded-md w-full bg-white shadow-sm">
                <span className="text-sm sm:text-base font-bold tracking-wide text-brand whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Track 2 (Exact duplicate for 100% seamless infinite loop) */}
      <div className="flex shrink-0 items-center animate-marquee-loop" aria-hidden="true">
        {trackItems.map((logo, i) => (
          <div
            key={`track2-${logo._id || logo.id || i}-${i}`}
            className="flex-shrink-0 px-4 sm:px-6 md:px-8 flex items-center justify-center w-[160px] sm:w-[200px] md:w-[240px] h-20 sm:h-24 md:h-28"
          >
            {logo.imageUrl ? (
              <img
                src={getOptimizedCloudinaryUrl(logo.imageUrl, { width: 300, height: 150 })}
                alt={logo.name || "Client Logo"}
                width={200}
                height={100}
                loading="lazy"
                decoding="async"
                className="max-h-16 sm:max-h-20 md:max-h-24 w-auto max-w-full object-contain transition-transform duration-300 hover:scale-110 drop-shadow-sm"
              />
            ) : (
              <div className="flex items-center justify-center h-14 sm:h-16 px-6 border border-stone-200 rounded-md w-full bg-white shadow-sm">
                <span className="text-sm sm:text-base font-bold tracking-wide text-brand whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee-loop {
          animation: marquee-infinite 30s linear infinite;
        }
        .group:hover .animate-marquee-loop {
          animation-play-state: paused;
        }
        @keyframes marquee-infinite {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

