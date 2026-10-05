"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CTABanner from "@/components/shared/CTABanner";
import { IMAGES } from "@/constants/images";
import { API_BASE } from "@/lib/api";
import {
  PhotoItem,
  VideoItem,
  MediaSettings,
  PHOTO_CATEGORIES as PCATS,
  VIDEO_CATEGORIES as VCATS,
  PhotoCategoryKey,
  VideoCategoryKey,
  defaultPhotos,
  defaultVideos,
} from "@/data/mediaData";
import {
  FaPlay,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaVideo,
  FaExpand,
  FaCompress,
  FaIndustry,
  FaHandsHelping,
  FaShieldAlt,
  FaRecycle,
  FaFilm,
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

interface Props {
  photos?: PhotoItem[];
  videos?: VideoItem[];
  settings?: MediaSettings | null;
}

// Extract embed URL for YouTube, Vimeo, or direct Cloudinary/MP4 video
function getVideoEmbedData(url: string): { type: "youtube" | "vimeo" | "direct"; src: string } {
  if (!url) return { type: "direct", src: "" };

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  const vimeoMatch = url.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
    };
  }

  return { type: "direct", src: url };
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  "plant-processing": FaIndustry,
  "community-empowerment": FaHandsHelping,
  "safety-training": FaShieldAlt,
  "circularity-recovery": FaRecycle,
  "operational-walkthrough": FaIndustry,
  "impact-stories": FaHandsHelping,
};

const PILLAR_NUMBERS: Record<PhotoCategoryKey, string> = {
  "plant-processing": "01",
  "community-empowerment": "02",
  "safety-training": "03",
  "circularity-recovery": "04",
};

const VIDEO_FOCUS_NUMBERS: Record<VideoCategoryKey, string> = {
  "operational-walkthrough": "01",
  "impact-stories": "02",
};

// Helper to display a clean, concise caption with ellipsis on thumbnail cards
function formatThumbnailCaption(caption?: string, maxChars: number = 32): string {
  if (!caption) return "";
  const trimmed = caption.trim();
  if (trimmed.length <= maxChars) return trimmed;
  const sub = trimmed.slice(0, maxChars);
  const lastSpace = sub.lastIndexOf(" ");
  const clean = lastSpace > 16 ? sub.slice(0, lastSpace) : sub;
  return clean.replace(/[\s,.;:-]+$/, "") + "...";
}

export default function PhotosVideosPageContent({
  photos = defaultPhotos,
  videos = defaultVideos,
  settings,
}: Props) {
  // Local reactive states synced with live DB updates
  const [photoList, setPhotoList] = useState<PhotoItem[]>(photos && photos.length > 0 ? photos : defaultPhotos);
  const [videoList, setVideoList] = useState<VideoItem[]>(videos && videos.length > 0 ? videos : defaultVideos);
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(new Set());

  // Top view tab: "all" | "photos" | "videos"
  const [activeMediaTab, setActiveMediaTab] = useState<"all" | "photos" | "videos">("all");

  // Lightbox modal state for Photos (stores active photo object)
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  // Modal player state for Videos
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Fullscreen & video container ref
  const videoModalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Synchronize when server component props change
  useEffect(() => {
    if (photos && photos.length > 0) {
      setPhotoList(photos);
    }
  }, [photos]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      setVideoList(videos);
    }
  }, [videos]);

  // Live client-side synchronization: automatically re-fetches media when tab focuses or admin broadcasts an update
  const syncLiveMedia = useCallback(async () => {
    try {
      const [pRes, vRes] = await Promise.allSettled([
        fetch(`${API_BASE}/media/photos`, { cache: "no-store" }).then((r) => r.json()),
        fetch(`${API_BASE}/media/videos`, { cache: "no-store" }).then((r) => r.json()),
      ]);

      if (pRes.status === "fulfilled" && Array.isArray(pRes.value?.data)) {
        setPhotoList(pRes.value.data);
      }
      if (vRes.status === "fulfilled" && Array.isArray(vRes.value?.data)) {
        setVideoList(vRes.value.data);
      }
    } catch {
      // Quiet background network sync
    }
  }, []);

  useEffect(() => {
    syncLiveMedia();

    const handleMediaUpdated = () => {
      syncLiveMedia();
    };

    window.addEventListener("focus", handleMediaUpdated);
    window.addEventListener("storage", handleMediaUpdated);
    window.addEventListener("media_updated", handleMediaUpdated);

    return () => {
      window.removeEventListener("focus", handleMediaUpdated);
      window.removeEventListener("storage", handleMediaUpdated);
      window.removeEventListener("media_updated", handleMediaUpdated);
    };
  }, [syncLiveMedia]);

  // Handler for broken/deleted image URLs to prevent broken image icons on client side
  const handleImageError = (imageUrl: string) => {
    setFailedImageUrls((prev) => {
      const next = new Set(prev);
      next.add(imageUrl);
      return next;
    });
  };

  // Only display valid, existing images
  const activePhotos = photoList.filter((p) => !failedImageUrls.has(p.imageUrl));
  const activeVideos = videoList;

  // Mobile touch swipe for photo lightbox
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) handleNextPhoto();
    else if (diff < -45) handlePrevPhoto();
    setTouchStartX(null);
  };

  const handleToggleFullscreen = () => {
    const el = videoModalRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else {
        const vid = el.querySelector("video");
        if (vid && (vid as any).webkitEnterFullscreen) {
          (vid as any).webkitEnterFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Lock body scroll when Lightbox or Video Modal is open
  useEffect(() => {
    if (activePhoto || activeVideo) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activePhoto, activeVideo]);

  const heading = settings?.heading || "Photos & Videos Showcase";
  const subheading =
    settings?.subheading ||
    "A structured visual narrative illustrating our journey — from grassroots collection and women-led centers to industrial mechanical recycling and community impact.";

  // Lightbox handlers
  const handleOpenLightbox = (photo: PhotoItem) => {
    setActivePhoto(photo);
  };

  const handleCloseLightbox = () => {
    setActivePhoto(null);
  };

  const handlePrevPhoto = useCallback(() => {
    if (!activePhoto || !activePhotos || activePhotos.length === 0) return;
    const currIdx = activePhotos.findIndex(
      (p) => (p._id && p._id === activePhoto._id) || p.imageUrl === activePhoto.imageUrl
    );
    if (currIdx === -1) return;
    const nextIdx = currIdx > 0 ? currIdx - 1 : activePhotos.length - 1;
    if (activePhotos[nextIdx]) setActivePhoto(activePhotos[nextIdx]);
  }, [activePhoto, activePhotos]);

  const handleNextPhoto = useCallback(() => {
    if (!activePhoto || !activePhotos || activePhotos.length === 0) return;
    const currIdx = activePhotos.findIndex(
      (p) => (p._id && p._id === activePhoto._id) || p.imageUrl === activePhoto.imageUrl
    );
    if (currIdx === -1) return;
    const nextIdx = currIdx < activePhotos.length - 1 ? currIdx + 1 : 0;
    if (activePhotos[nextIdx]) setActivePhoto(activePhotos[nextIdx]);
  }, [activePhoto, activePhotos]);

  // Keyboard navigation for Lightbox and Video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (activePhoto !== null) {
        if (e.key === "ArrowLeft") handlePrevPhoto();
        if (e.key === "ArrowRight") handleNextPhoto();
        if (e.key === "Escape") handleCloseLightbox();
      }
      if (activeVideo !== null) {
        if (e.key === "Escape") {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          } else {
            setActiveVideo(null);
          }
        }
        if (e.key === "f" || e.key === "F") {
          handleToggleFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, activeVideo, handlePrevPhoto, handleNextPhoto]);

  const activePhotoIndex = activePhoto && activePhotos
    ? activePhotos.findIndex(
        (p) => (p._id && p._id === activePhoto._id) || p.imageUrl === activePhoto.imageUrl
      )
    : -1;

  return (
    <div className="w-full max-w-full overflow-x-clip">
      {/* ─── HERO BANNER ───────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-32 md:pt-36 pb-12 sm:pb-16 md:pb-20 min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center bg-brand text-white overflow-hidden w-full">
        <div className="absolute inset-0">
          <Image
            src={settings?.heroImageUrl || IMAGES.HERO_GALLERY}
            alt="Photos and Videos Showcase"
            fill
            sizes="100vw"
            quality={85}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/90 to-brand/80" />
        </div>

        <div className="container-wide relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-px w-6 sm:w-8 bg-emerald-400/80" />
            <span className="eyebrow text-emerald-300 text-[10px] sm:text-xs tracking-wider">
              Visual Media & Documentary Hub
            </span>
            <div className="h-px w-6 sm:w-8 bg-emerald-400/80" />
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white font-bold leading-tight mb-3 sm:mb-4 tracking-tight px-2 break-words">
            {heading}
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-white/85 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed text-center mb-6 sm:mb-8 px-2">
            {subheading}
          </p>

          {/* Section Switcher Tabs - Responsive Segmented Bar */}
          <div className="inline-flex p-1 sm:p-1.5 bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-full border border-white/25 shadow-lg max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setActiveMediaTab("all")}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                  activeMediaTab === "all"
                    ? "bg-white text-brand shadow-sm"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>All <span className="hidden sm:inline">Showcase</span> ({activePhotos.length + activeVideos.length})</span>
              </button>
              <button
                onClick={() => setActiveMediaTab("photos")}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                  activeMediaTab === "photos"
                    ? "bg-white text-brand shadow-sm"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                <FaImages className="text-xs shrink-0" />
                <span>Photos <span className="hidden sm:inline">Pillars</span> ({activePhotos.length})</span>
              </button>
              <button
                onClick={() => setActiveMediaTab("videos")}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                  activeMediaTab === "videos"
                    ? "bg-white text-brand shadow-sm"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                <FaVideo className="text-xs shrink-0" />
                <span>Videos <span className="hidden sm:inline">Tours</span> ({activeVideos.length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: THEMATIC PHOTO PILLARS (DISTRIBUTED SECTIONS) ── */}
      {(activeMediaTab === "all" || activeMediaTab === "photos") && (
        <div className="divide-y divide-stone-200/80">
          {PCATS.map((cat, catIdx) => {
            const catPhotos = activePhotos.filter((p) => p.category === cat.key);
            const Icon = CATEGORY_ICON_MAP[cat.key] || FaImages;
            const isAltBg = catIdx % 2 === 1;

            return (
              <section
                key={cat.key}
                id={cat.key}
                className={`py-6 sm:py-8 md:py-10 scroll-mt-24 ${isAltBg ? "bg-stone-50/70" : "bg-white"}`}
              >
                <div className="container-wide px-4 sm:px-6 md:px-8">
                  {/* Category Header */}
                  <FadeIn>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 pb-3.5 sm:mb-8 sm:pb-5 border-b border-stone-200">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                            <Icon className="text-[10px]" /> Pillar {PILLAR_NUMBERS[cat.key]}
                          </span>
                          <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                            {cat.tagline}
                          </span>
                        </div>

                        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand leading-snug">
                          {cat.label}
                        </h2>

                        <p className="text-stone-600 text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 leading-relaxed text-left">
                          {cat.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 sm:py-1.5 rounded-md border border-stone-200">
                          {catPhotos.length} {catPhotos.length === 1 ? "Photo" : "Photos"}
                        </span>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Photos Grid */}
                  {catPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] sm:gap-[16px] md:gap-[20px]">
                      {catPhotos.map((photo, photoIdx) => (
                        <FadeIn key={photo._id || photoIdx} delay={photoIdx * 0.06}>
                          <div
                            onClick={() => handleOpenLightbox(photo)}
                            className="group relative aspect-[4/3] rounded-[4px] overflow-hidden bg-stone-200 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.imageUrl}
                              alt={photo.caption || cat.label}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                              onError={() => handleImageError(photo.imageUrl)}
                            />

                            {/* Expand Badge Top Right */}
                            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-md">
                                <FaExpand className="text-[10px] sm:text-xs" />
                              </div>
                            </div>

                            {/* Caption Overlay */}
                            {photo.caption && (
                              <div className="relative z-10 p-2.5 sm:p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white transition-all duration-300">
                                <p
                                  className="text-xs sm:text-sm font-medium leading-snug drop-shadow-xs truncate text-white/95"
                                  title={photo.caption}
                                >
                                  {formatThumbnailCaption(photo.caption, 32)}
                                </p>
                              </div>
                            )}
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
                      <FaImages className="text-2xl sm:text-3xl mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium">No assets registered in this pillar yet.</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ─── SECTION: VIDEO SHOWCASE (DISTRIBUTED SECTIONS) ────────── */}
      {(activeMediaTab === "all" || activeMediaTab === "videos") && (
        <div className="divide-y divide-stone-200/80 border-t border-stone-200">
          {VCATS.map((cat, catIdx) => {
            const catVideos = activeVideos.filter((v) => v.category === cat.key);
            const isAltBg = catIdx % 2 === 1;

            return (
              <section
                key={cat.key}
                id={cat.key}
                className={`py-6 sm:py-8 md:py-10 scroll-mt-24 ${isAltBg ? "bg-stone-50/70" : "bg-white"}`}
              >
                <div className="container-wide px-4 sm:px-6 md:px-8">
                  {/* Category Header */}
                  <FadeIn>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 pb-3.5 sm:mb-8 sm:pb-5 border-b border-stone-200">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-amber-100 text-amber-900 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                            <FaFilm className="text-[10px]" /> Video Focus {VIDEO_FOCUS_NUMBERS[cat.key]}
                          </span>
                          <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                            {cat.tagline}
                          </span>
                        </div>

                        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand leading-snug">
                          {cat.label}
                        </h2>

                        <p className="text-stone-600 text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 leading-relaxed text-left">
                          {cat.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 sm:py-1.5 rounded-md border border-stone-200">
                          {catVideos.length} {catVideos.length === 1 ? "Video" : "Videos"}
                        </span>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Videos Grid */}
                  {catVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
                      {catVideos.map((video, videoIdx) => (
                        <FadeIn key={video._id || videoIdx} delay={videoIdx * 0.08}>
                          <div
                            onClick={() => setActiveVideo(video)}
                            className="group bg-white rounded-lg sm:rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand/40 transition-all duration-300 cursor-pointer flex flex-col h-full"
                          >
                            {/* Video Thumbnail */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  video.thumbnailUrl ||
                                  "https://res.cloudinary.com/wpttnkjq/image/upload/v1787229904/www.beatsnoop.com-3000-9kZPl3OjxS_mtz7rj.jpg"
                                }
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                              {/* Centered Play Button */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-brand/90 group-hover:bg-gold text-white flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110">
                                  <FaPlay className="text-sm sm:text-base md:text-lg ml-0.5 sm:ml-1" />
                                </div>
                              </div>

                              {/* Top Badges */}
                              {video.duration && (
                                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
                                  <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded shadow-xs">
                                    {video.duration}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-brand group-hover:text-gold transition-colors mb-1.5 sm:mb-2 leading-snug">
                                  {video.title}
                                </h3>
                                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed text-left line-clamp-2 sm:line-clamp-3">
                                  {video.description}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand">
                                <span className="flex items-center gap-1.5 group-hover:text-gold transition-colors">
                                  <FaPlay className="text-[9px] sm:text-[10px]" /> Play Tour
                                </span>
                              </div>
                            </div>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
                      <FaVideo className="text-2xl sm:text-3xl mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium">No video assets recorded in this category yet.</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ─── LIGHTBOX MODAL FOR HIGH-RES PHOTOS ──────────────────── */}
      <AnimatePresence>
        {activePhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 xs:p-3 sm:p-6 select-none"
          >
            {/* Top Toolbar / Modal Controls */}
            <div className="absolute top-2 xs:top-3 sm:top-5 left-2 xs:left-3 sm:left-6 right-2 xs:right-3 sm:right-6 z-50 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="bg-brand text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md">
                  {PCATS.find((c) => c.key === activePhoto?.category)?.label || "Operations"}
                </span>
                <span className="text-white/80 bg-black/50 px-2.5 py-1 rounded text-xs font-mono">
                  {activePhotoIndex >= 0 ? `${activePhotoIndex + 1} / ${activePhotos.length}` : ""}
                </span>
              </div>

              <button
                onClick={handleCloseLightbox}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/35 active:bg-white/50 text-white flex items-center justify-center transition-colors cursor-pointer pointer-events-auto shadow-lg"
                title="Close (ESC)"
                aria-label="Close photo lightbox"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Previous Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 sm:bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg backdrop-blur-xs"
              title="Previous Photo (Arrow Left)"
              aria-label="Previous photo"
            >
              <FaChevronLeft size={16} />
            </button>

            {/* Next Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 sm:bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg backdrop-blur-xs"
              title="Next Photo (Arrow Right)"
              aria-label="Next photo"
            >
              <FaChevronRight size={16} />
            </button>

            {/* Lightbox Content */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col items-center justify-center px-10 sm:px-14"
            >
              <div className="relative w-full max-h-[66vh] sm:max-h-[74vh] flex items-center justify-center overflow-hidden rounded-[4px] shadow-2xl bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhoto?.imageUrl || ""}
                  alt={activePhoto?.caption || "Photo"}
                  className="max-h-[66vh] sm:max-h-[74vh] w-auto max-w-full object-contain rounded-[4px]"
                />
              </div>

              {activePhoto?.caption && (
                <div className="mt-2.5 sm:mt-3.5 text-center max-w-2xl px-3 py-1.5 bg-black/50 backdrop-blur-xs rounded-[4px]">
                  <p className="text-white text-xs sm:text-sm md:text-base font-medium leading-snug sm:leading-relaxed">
                    {activePhoto.caption}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── VIDEO PLAYER MODAL WITH FULLSCREEN ───────────────────── */}
      <AnimatePresence>
        {activeVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              }
              setActiveVideo(null);
            }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 xs:p-3 sm:p-5 md:p-8 overflow-hidden"
          >
            {/* Modal Container */}
            <div
              ref={videoModalRef}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[96vh] sm:max-h-[92vh] flex flex-col bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-stone-800 my-auto"
            >
              {/* Top Controls Toolbar */}
              <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 bg-stone-900/95 border-b border-stone-800 text-white shrink-0">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="bg-gold text-brand font-bold text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0">
                    {VCATS.find((c) => c.key === activeVideo.category)?.label || "Video"}
                  </span>
                  {activeVideo.duration && (
                    <span className="text-white/60 text-xs font-mono shrink-0 hidden sm:inline">
                      {activeVideo.duration}
                    </span>
                  )}
                  <span className="text-xs text-white/80 font-medium truncate hidden md:inline">
                    {activeVideo.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Full Screen Button */}
                  <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-[11px] sm:text-xs font-medium cursor-pointer transition-colors"
                    title={isFullscreen ? "Exit Fullscreen (F)" : "Full Screen (F)"}
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullscreen ? (
                      <>
                        <FaCompress className="text-xs" />
                        <span className="hidden sm:inline">Exit Fullscreen</span>
                      </>
                    ) : (
                      <>
                        <FaExpand className="text-xs" />
                        <span className="hidden sm:inline">Full Screen</span>
                      </>
                    )}
                  </button>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen().catch(() => {});
                      }
                      setActiveVideo(null);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Close (ESC)"
                    aria-label="Close video player"
                  >
                    <FaTimes className="text-xs sm:text-sm" />
                  </button>
                </div>
              </div>

              {/* Responsive 16:9 Video Frame */}
              <div className="relative aspect-[16/9] w-full bg-black flex-1 min-h-0">
                {(() => {
                  const embed = getVideoEmbedData(activeVideo.videoUrl);
                  if (embed.type === "youtube" || embed.type === "vimeo") {
                    return (
                      <iframe
                        src={embed.src}
                        title={activeVideo.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <video
                      src={embed.src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  );
                })()}
              </div>

              {/* Video Info Footer */}
              <div className="p-3 sm:p-4 md:p-5 bg-stone-900 text-white shrink-0 overflow-y-auto max-h-[26vh] sm:max-h-[20vh] border-t border-stone-800">
                <div className="flex items-center gap-2 mb-1 sm:hidden">
                  {activeVideo.duration && (
                    <span className="text-white/60 text-[11px] font-mono">
                      Duration: {activeVideo.duration}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-white mb-1 leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed text-left">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CTA BANNER ───────────────────────────────────────────── */}
      <CTABanner
        headline="Request High-Resolution Media or Arrange a Plant Visit"
        description="Our procurement and ESG teams welcome on-site visits to Unit 1 (Chawliapotti) and Unit 2 (Damail) for verification and partnership discussions."
        buttonText="Contact Our Team"
      />
    </div>
  );
}
