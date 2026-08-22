"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/data/siteData";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import { IMAGES } from "@/constants/images";

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { companyName } = useGlobalSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-ivory shadow-[0_1px_0_0_rgba(209,213,219,0.6)]"
      >
        <div className="container-wide flex justify-between items-center h-[70px] sm:h-[80px] lg:h-[90px]">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center transition-all duration-300"
              >
                <Image
                  src={IMAGES.MAPLE_LOGO}
                  alt={`${companyName} Logo`}
                  fill
                  sizes="192px"
                  quality={100}
                  unoptimized
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden lg:flex justify-center items-center gap-2.5 xl:gap-3.5 2xl:gap-4.5 flex-grow px-2">
            {navLinks.map((link) => {
              const hasChildren = !!link.children;
              const isMainActive =
                (link.href === "/" && pathname === "/") ||
                (hasChildren && link.children!.some(c => pathname === c.href)) ||
                (!hasChildren && link.href !== "/" && (pathname === link.href || pathname.startsWith(link.href + "/")));

              return (
                <div key={link.href} className="relative group h-[70px] sm:h-[80px] lg:h-[90px] flex items-center">
                  <Link
                    href={link.href}
                    className={`text-[11.5px] xl:text-[12.5px] font-semibold tracking-wider uppercase whitespace-nowrap transition-colors duration-200 flex items-center gap-1 px-1 py-1.5 ${isMainActive
                      ? "text-brand font-bold"
                      : "text-stone-700 cursor-pointer hover:text-brand"
                      }`}
                  >
                    {link.label}
                    {link.children && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 opacity-70 group-hover:rotate-180 transition-transform duration-300"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </Link>

                  {/* Desktop Dropdown */}
                  {link.children && (
                    <div className="absolute top-[70px] lg:top-[85px] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-2">
                      <div className="bg-ivory border border-stone/30 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-sm py-2 min-w-[200px]">
                        {link.children.map((child) => {
                          const isChildActive = pathname === child.href;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-5 py-2.5 text-sm transition-colors ${isChildActive
                                ? "text-brand bg-brand/10 font-bold"
                                : "text-stone-700 hover:bg-stone-100 hover:text-brand"
                                }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: CTA + Mobile Toggle */}
          <div className="flex-shrink-0 flex justify-end items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 bg-brand hover:bg-brand-light text-white text-[11px] xl:text-[12px] font-bold uppercase tracking-wider rounded-sm cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group whitespace-nowrap"
            >
              <span>Get a Quote</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex flex-col gap-1.5 p-2"
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-6 h-[2px] transition-all duration-300 ${mobileOpen
                    ? `rotate-45 translate-y-[5px] bg-brand`
                    : "bg-brand"
                    }`}
                />
                <span
                  className={`block w-6 h-[2px] transition-all duration-300 ${mobileOpen
                    ? "opacity-0"
                    : "bg-brand"
                    }`}
                />
                <span
                  className={`block w-6 h-[2px] transition-all duration-300 ${mobileOpen
                    ? `-rotate-45 -translate-y-[5px] bg-brand`
                    : "bg-brand"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[70px] sm:top-[80px] z-40 bg-ivory lg:hidden overflow-y-auto"
          >
            <div className="container-wide py-5 sm:py-8 flex flex-col gap-1 pb-24">
              {navLinks.map((link, i) => {
                const hasChildren = !!link.children;
                const isMainActive =
                  (link.href === "/" && pathname === "/") ||
                  (hasChildren && link.children!.some(c => pathname === c.href)) ||
                  (!hasChildren && link.href !== "/" && (pathname === link.href || pathname.startsWith(link.href + "/")));

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-stone/30"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={link.href}
                        className={`block py-3 sm:py-4 text-base sm:text-lg font-serif font-medium flex-grow ${isMainActive ? "text-accent font-semibold" : "text-brand"
                          }`}
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <button
                          onClick={() =>
                            setOpenSubmenu(openSubmenu === link.label ? null : link.label)
                          }
                          className="p-4 text-brand"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${openSubmenu === link.label ? "rotate-180 text-accent" : ""
                              }`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Mobile Submenu */}
                    <AnimatePresence>
                      {link.children && openSubmenu === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 pl-4 flex flex-col gap-3">
                            {link.children.map((child) => {
                              const isChildActive = pathname === child.href;

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`text-sm ${isChildActive ? "text-accent font-semibold" : "text-brand/80"
                                    }`}
                                >
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              <Link
                href="/contact"
                className="mt-6 sm:mt-8 inline-flex justify-center px-6 py-3 sm:py-3.5 bg-brand text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-sm shadow-md hover:bg-brand-light cursor-pointer transition-all"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ivory shadow-[0_1px_0_0_rgba(209,213,219,0.6)] h-[70px] sm:h-[80px] lg:h-[90px]" />
    }>
      <NavbarContent />
    </Suspense>
  );
}
