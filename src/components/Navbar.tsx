"use client";

import Link from "next/link";
import { Play as YoutubeIcon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Thumbnail", href: "/youtube-thumbnail-downloader" },
  { name: "Tags", href: "/youtube-tags-extractor" },
  { name: "Banner", href: "/youtube-banner-downloader" },
  { name: "Metadata", href: "/youtube-metadata-extractor" },
  { name: "Logo", href: "/youtube-logo-downloader" },
  { name: "Hashtags", href: "/youtube-hashtag-extractor" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "py-3 px-4" : "py-5 px-4"
        )}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "w-full max-w-[1280px] mx-auto flex items-center justify-between transition-all duration-500 px-5 py-3 rounded-2xl",
            isScrolled
              ? "glass shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              : "bg-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-9 h-9 rounded-xl bg-[#000] flex items-center justify-center shadow-sm"
            >
              <YoutubeIcon className="w-4 h-4 text-white" fill="currentColor" />
            </motion.div>
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="font-bold text-[18px] tracking-tight text-[#1c1b1c]"
            >
              YT<span className="text-[#5a5f68]">Toolkit</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-[14px] font-500 text-[#45474b] hover:text-[#1c1b1c] hover:bg-[rgba(0,0,0,0.04)] transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <motion.a
              href="/#tools"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="hidden md:flex btn-primary ripple-btn !py-2 !px-5 !text-[14px]"
            >
              All Tools
            </motion.a>

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.08)] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-[#1c1b1c]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-[#1c1b1c]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="md:hidden mt-2 mx-4 glass rounded-2xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.10)]"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-[16px] font-semibold text-[#1c1b1c] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                    >
                      {link.name}
                      <span className="text-[#c6c6cb]">→</span>
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-3 mt-2 border-t border-[#e5e2e2]">
                  <Link
                    href="/#tools"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full ripple-btn"
                  >
                    Explore All Tools
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
