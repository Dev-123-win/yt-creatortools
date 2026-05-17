"use client";

import { motion } from "framer-motion";
import { LucideIcon, Share2, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
}

export function ToolLayout({ title, description, icon: Icon, iconColor = "#c6d4f9", children, seoContent }: ToolLayoutProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="w-full max-w-[1024px] mx-auto px-5 pb-32">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-10 pt-2"
      >
        <nav className="flex items-center gap-2 text-[13px] font-medium text-[#76777b]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1c1b1c] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <Link href="/#tools" className="hover:text-[#1c1b1c] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-[#1c1b1c] font-semibold">{title}</span>
        </nav>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleShare}
          className="w-9 h-9 flex items-center justify-center rounded-xl glass border-[#e5e2e2] hover:border-[#c6c6cb] transition-all"
          aria-label="Share this tool"
        >
          <Share2 className="w-4 h-4 text-[#5a5f68]" />
        </motion.button>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="text-center mb-12"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-sm border border-[rgba(0,0,0,0.06)] float-anim"
          style={{ background: iconColor + "55" }}
        >
          <Icon className="w-7 h-7 text-[#1c1b1c]" strokeWidth={1.6} />
        </motion.div>

        <h1
          style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.1 }}
          className="text-[#1c1b1c] mb-4"
        >
          {title}
        </h1>

        <p
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", lineHeight: 1.65 }}
          className="text-[#5a5f68] max-w-[540px] mx-auto"
        >
          {description}
        </p>
      </motion.div>

      {/* Tool children */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
        className="mb-16"
      >
        {children}
      </motion.div>

      {/* SEO / Guide section */}
      {seoContent && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="prismatic-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#e5e2e2]">
              <BookOpen className="w-4 h-4 text-[#45474b]" />
            </div>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase", color: "#45474b" }}
            >
              Pro Guide
            </h2>
          </div>
          <div className="prose max-w-none">
            {seoContent}
          </div>
        </motion.div>
      )}

      {/* Ad placeholder */}
      <div className="mt-12 h-20 rounded-2xl border border-dashed border-[#e5e2e2] flex items-center justify-center">
        <span className="label-caps text-[#c6c6cb]">Sponsored Space</span>
      </div>
    </div>
  );
}
