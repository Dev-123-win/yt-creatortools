"use client";

import Link from "next/link";
import { Play as YoutubeIcon, Zap, Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Thumbnail", href: "/youtube-thumbnail-downloader" },
  { name: "Tags", href: "/youtube-tags-extractor" },
  { name: "Banner", href: "/youtube-banner-downloader" },
  { name: "Metadata", href: "/youtube-metadata-extractor" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-4",
          isScrolled ? "py-3" : "py-8"
        )}
      >
        <div className={cn(
          "max-w-7xl mx-auto rounded-md transition-all duration-700 px-xl py-md flex items-center justify-between border",
          isScrolled 
            ? "bg-canvas/90 backdrop-blur-2xl border-mute shadow-sm" 
            : "bg-transparent border-transparent"
        )}>
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary p-2.5 rounded-md shadow-sm flex items-center justify-center"
            >
              <YoutubeIcon className="w-5 h-5 text-on-primary" fill="currentColor" />
            </motion.div>
            <span className="font-display font-medium text-[24px] tracking-tight text-ink">
              YT<span className="text-primary">Toolkit</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-body-sm font-medium text-body hover:text-ink transition-colors relative group"
              >
                {link.name}
              </Link>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/#tools"
                className="btn-secondary flex items-center gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4 text-primary" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            className="md:hidden p-3 bg-canvas-soft rounded-md text-body hover:text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-28 left-4 right-4 bg-canvas border border-mute rounded-md p-xl md:hidden z-40 shadow-md overflow-hidden"
            >
              <div className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="font-display font-medium text-[24px] text-ink hover:text-primary flex items-center justify-between group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                      <ChevronRight className="w-6 h-6 text-mute group-hover:text-primary transition-colors" />
                    </Link>
                  </motion.div>
                ))}
                <hr className="border-mute" />
                <Link
                  href="/#tools"
                  className="btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
