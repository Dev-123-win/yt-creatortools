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
          "max-w-7xl mx-auto rounded-[32px] transition-all duration-700 px-8 py-3 flex items-center justify-between border",
          isScrolled 
            ? "bg-white/80 backdrop-blur-2xl border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)]" 
            : "bg-transparent border-transparent"
        )}>
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary p-2.5 rounded-2xl shadow-[0_8px_20px_rgba(255,0,0,0.2)] flex items-center justify-center"
            >
              <YoutubeIcon className="w-5 h-5 text-white" fill="currentColor" />
            </motion.div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 group-hover:tracking-normal transition-all duration-500">
              YT<span className="text-primary">Toolkit</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all relative group"
              >
                {link.name}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary"
                  whileHover={{ width: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </Link>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/#tools"
                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
              >
                Get Started
                <ChevronRight className="w-4 h-4 text-primary" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            className="md:hidden p-3 bg-slate-50 rounded-2xl text-slate-600 hover:text-slate-900"
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
              className="absolute top-28 left-4 right-4 bg-white border border-slate-100 rounded-[40px] p-10 md:hidden z-40 shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden"
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
                      className="text-3xl font-black text-slate-900 hover:text-primary flex items-center justify-between group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-primary transition-colors" />
                    </Link>
                  </motion.div>
                ))}
                <hr className="border-slate-50" />
                <Link
                  href="/#tools"
                  className="bg-primary text-white text-center py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-red-100"
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
