"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowLeft, Share2, Info, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
}

export function ToolLayout({ title, description, icon: Icon, children, seoContent }: ToolLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-32">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-12">
        <nav className="flex items-center gap-3 text-[16px] leading-[24px] font-semibold text-mute">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <Link href="/#tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-ink">{title}</span>
        </nav>
        <button className="p-sm bg-canvas border border-mute/30 rounded-md hover:bg-canvas-soft transition-all shadow-sm">
          <Share2 className="w-4 h-4 text-body" />
        </button>
      </div>

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex p-md rounded-md bg-canvas-soft text-primary border border-mute/30 mb-lg shadow-sm animate-float">
          <Icon className="w-10 h-10" />
        </div>
        <h1 className="font-display text-[48px] md:text-[56px] font-medium mb-md text-ink leading-tight">
          {title}
        </h1>
        <div className="w-full max-w-[672px] mx-auto mb-6 p-6 bg-canvas-soft/40 backdrop-blur-md border border-mute/20 rounded-2xl shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-primary/10" />
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
          <p className="text-[20px] leading-[32px] text-body pl-2 relative z-10 text-left">
            {description}
          </p>
        </div>
      </motion.div>

      {/* Main Tool Area */}
      <div className="mb-24 relative">
        {/* Subtle background glow for tool area */}
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -z-10" />
        {children}
      </div>

      {/* SEO & Educational Content */}
      {seoContent && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-canvas-soft rounded-md p-xl md:p-3xl border border-mute/30 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-lg">
            <div className="p-sm bg-canvas border border-mute/30 rounded-md">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-[32px] font-medium text-ink">Pro Tips & Guide</h2>
          </div>
          <div className="prose prose-slate max-w-none prose-p:text-body prose-p:text-[18px] prose-p:leading-[27px] prose-headings:text-ink prose-headings:font-display prose-headings:font-medium prose-strong:text-ink prose-li:text-body">
            {seoContent}
          </div>
        </motion.div>
      )}

      {/* Monetization Placeholder */}
      <div className="mt-20">
        <div className="bg-canvas-soft h-32 rounded-md flex items-center justify-center text-mute text-[16px] leading-[24px] eyebrow-uppercase border border-dashed border-mute/50">
          Premium Sponsorship Space
        </div>
      </div>
    </div>
  );
}
