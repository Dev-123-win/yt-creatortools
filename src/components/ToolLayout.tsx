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
        <nav className="flex items-center gap-3 text-sm font-bold text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <Link href="/#tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-slate-900">{title}</span>
        </nav>
        <button className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
          <Share2 className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex p-6 rounded-[32px] bg-red-50 text-primary border border-red-100 mb-8 shadow-inner animate-float">
          <Icon className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
          {title}
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
          {description}
        </p>
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
          className="bg-white rounded-[48px] p-8 md:p-20 border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Info className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Pro Tips & Guide</h2>
          </div>
          <div className="prose prose-slate max-w-none prose-p:text-slate-500 prose-p:leading-relaxed prose-headings:text-slate-900 prose-headings:font-black prose-strong:text-slate-900 prose-li:text-slate-500">
            {seoContent}
          </div>
        </motion.div>
      )}

      {/* Monetization Placeholder */}
      <div className="mt-20">
        <div className="bg-slate-50 h-32 rounded-[32px] flex items-center justify-center text-slate-300 text-xs font-black tracking-widest uppercase border-2 border-dashed border-slate-200">
          Premium Sponsorship Space
        </div>
      </div>
    </div>
  );
}
