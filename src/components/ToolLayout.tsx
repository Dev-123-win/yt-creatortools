"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LucideIcon, 
  Share2, 
  ChevronRight, 
  BookOpen, 
  Home, 
  ArrowUp, 
  Image as ImageIcon, 
  Tag, 
  FileText, 
  Layout, 
  UserCircle, 
  Hash 
} from "lucide-react";
import Link from "next/link";
import { AdsterraBanner } from "@/components/AdsterraBanner";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
}

const ALL_TOOLS = [
  {
    title: "Thumbnail Downloader",
    description: "Download ultra-high-res video thumbnails in every quality tier.",
    href: "/youtube-thumbnail-downloader",
    icon: ImageIcon,
    accentColor: "#f9c6d0",
  },
  {
    title: "Tags Extractor",
    description: "Reveal the hidden SEO keywords powering any viral video.",
    href: "/youtube-tags-extractor",
    icon: Tag,
    accentColor: "#c6d4f9",
  },
  {
    title: "Metadata Extractor",
    description: "Pull the full title and description of any YouTube video in one scan.",
    href: "/youtube-metadata-extractor",
    icon: FileText,
    accentColor: "#e0c6f9",
  },
  {
    title: "Banner Downloader",
    description: "Fetch original 2560×1440 channel art from any YouTube channel.",
    href: "/youtube-banner-downloader",
    icon: Layout,
    accentColor: "#f9f0c6",
  },
  {
    title: "Logo Downloader",
    description: "Extract full-resolution channel profile pictures without compression.",
    href: "/youtube-logo-downloader",
    icon: UserCircle,
    accentColor: "#c6f9d8",
  },
  {
    title: "Hashtag Extractor",
    description: "Scan and extract every trending hashtag from any video description.",
    href: "/youtube-hashtag-extractor",
    icon: Hash,
    accentColor: "#f9c6d0",
  },
];

export function ToolLayout({ title, description, icon: Icon, iconColor = "#c6d4f9", children, seoContent }: ToolLayoutProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const relatedTools = ALL_TOOLS.filter(
    (t) => t.title.toLowerCase() !== title.toLowerCase()
  ).slice(0, 3);

  // Breadcrumbs animation variants
  const breadcrumbContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const breadcrumbItem = {
    hidden: { opacity: 0, x: -6 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 120 } },
  };

  return (
    <div className="w-full max-w-[1024px] mx-auto px-5 pb-32">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-10 pt-2">
        <motion.nav
          variants={breadcrumbContainer}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 text-[13px] font-medium text-[#76777b]"
          aria-label="Breadcrumb"
        >
          <motion.span variants={breadcrumbItem} className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1c1b1c] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </motion.span>
          <motion.span variants={breadcrumbItem} className="flex items-center gap-1.5">
            <Link href="/#tools" className="hover:text-[#1c1b1c] transition-colors">Tools</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </motion.span>
          <motion.span variants={breadcrumbItem} className="text-[#1c1b1c] font-semibold">
            {title}
          </motion.span>
        </motion.nav>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleShare}
          className="w-9 h-9 flex items-center justify-center rounded-xl glass border-[#e5e2e2] hover:border-[#c6c6cb] transition-all"
          aria-label="Share this tool"
        >
          <Share2 className="w-4 h-4 text-[#5a5f68]" />
        </motion.button>
      </div>

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

      {/* Post-result rectangle ad — user just completed their task, attention is idle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="flex justify-center mb-10"
      >
        <AdsterraBanner variant="rectangle" showLabel />
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

      {/* Related tools section */}
      <div className="mt-24 border-t border-[#e5e2e2] pt-16">
        <h2 
          style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 500, letterSpacing: "-0.02em" }}
          className="text-[#1c1b1c] text-center mb-10"
        >
          Try Another Tool
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedTools.map((t, idx) => {
            const IconComponent = t.icon;
            return (
              <motion.div
                key={t.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                <Link href={t.href}>
                  <div className="prismatic-card p-6 h-full flex flex-col relative group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <div 
                      className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: t.accentColor }}
                    />
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-[rgba(0,0,0,0.06)] shadow-sm" style={{ background: t.accentColor + "44" }}>
                      <IconComponent className="w-5 h-5 text-[#1c1b1c]" strokeWidth={1.8} />
                    </div>
                    <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: "18px", fontWeight: 500 }} className="text-[#1c1b1c] mb-2">{t.title}</h3>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13.5px", lineHeight: "1.5" }} className="text-[#5a5f68] flex-grow">{t.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ad placement */}
      <div className="mt-12 flex flex-col items-center">
        <AdsterraBanner showLabel />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="toast toast-success flex items-center gap-2"
          >
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky quick actions bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/70 backdrop-blur-lg border-t border-[#e5e2e2] flex items-center justify-between gap-4 shadow-lg">
        <Link href="/" className="flex-1 flex flex-col items-center justify-center text-[#5a5f68] hover:text-[#1c1b1c] py-1">
          <Home className="w-5 h-5 mb-0.5" />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }} className="text-inherit uppercase">Home</span>
        </Link>
        <button onClick={handleShare} className="flex-1 flex flex-col items-center justify-center text-[#5a5f68] hover:text-[#1c1b1c] py-1">
          <Share2 className="w-5 h-5 mb-0.5" />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }} className="text-inherit uppercase">Share</span>
        </button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex-1 flex flex-col items-center justify-center text-[#5a5f68] hover:text-[#1c1b1c] py-1">
          <ArrowUp className="w-5 h-5 mb-0.5" />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }} className="text-inherit uppercase">Top</span>
        </button>
      </div>
    </div>
  );
}
