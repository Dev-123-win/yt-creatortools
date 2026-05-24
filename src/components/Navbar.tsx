"use client";

import Link from "next/link";
import { Image as ImageIcon, Tag, FileText, Layout, UserCircle, Hash, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Thumbnail", href: "/youtube-thumbnail-downloader", icon: ImageIcon, color: "#f9c6d0" },
  { name: "Tags", href: "/youtube-tags-extractor", icon: Tag, color: "#c6d4f9" },
  { name: "Metadata", href: "/youtube-metadata-extractor", icon: FileText, color: "#e0c6f9" },
  { name: "Banner", href: "/youtube-banner-downloader", icon: Layout, color: "#f9f0c6" },
  { name: "Logo", href: "/youtube-logo-downloader", icon: UserCircle, color: "#c6f9d8" },
  { name: "Hashtags", href: "/youtube-hashtag-extractor", icon: Hash, color: "#f9c6d0" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change (escape key)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          isScrolled ? "py-0" : "py-2"
        )}
        aria-label="Main navigation"
      >
        {/* Main nav bar */}
        <div
          className={cn(
            "mx-auto transition-all duration-500 ease-out",
            isScrolled
              ? "max-w-full px-4 py-3 bg-[rgba(252,248,249,0.88)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.05)] shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
              : "max-w-[1280px] px-5 py-4"
          )}
        >
          <div className="flex items-center justify-between max-w-[1280px] mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-[#e5e2e2]"
              >
                <img src="/logo.png" alt="YTToolkit Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="font-bold text-[18px] tracking-tight text-[#1c1b1c] hidden sm:block"
              >
                YT<span className="text-[#5a5f68]">Toolkit</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group px-3.5 py-2 rounded-lg text-[13px] font-semibold text-[#45474b] hover:text-[#1c1b1c] hover:bg-[rgba(0,0,0,0.04)] transition-all duration-200 flex items-center gap-1.5"
                >
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ background: link.color + "55" }}
                  >
                    <link.icon className="w-2.5 h-2.5" style={{ color: "#1c1b1c" }} strokeWidth={2} />
                  </span>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-2">
              <motion.a
                href="/#tools"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="hidden md:flex btn-primary ripple-btn shimmer-on-hover !py-2 !px-5 !text-[13px] !rounded-lg"
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
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X className="w-5 h-5 text-[#1c1b1c]" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu className="w-5 h-5 text-[#1c1b1c]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="md:hidden mx-3 mt-1 glass rounded-2xl p-4 shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
            >
              <div className="grid grid-cols-2 gap-2 mb-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{ background: link.color + "66" }}
                      >
                        <link.icon className="w-4 h-4 text-[#1c1b1c]" strokeWidth={1.8} />
                      </div>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1c1b1c" }}>
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#e5e2e2]">
                <Link
                  href="/#tools"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full ripple-btn !rounded-xl !py-3 !text-[14px] justify-center"
                >
                  Explore All Tools →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
