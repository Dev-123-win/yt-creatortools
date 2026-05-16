"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

export function ToolCard({ title, description, href, icon: Icon, color }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Link href={href}>
        <div className="bg-white h-full p-10 rounded-[56px] border border-slate-100 flex flex-col items-start relative overflow-hidden transition-all duration-700 shadow-[0_15px_50px_rgba(0,0,0,0.02)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] group-hover:border-primary/10">
          {/* Subtle Background Glow */}
          <div 
            className={cn(
              "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000",
              color
            )} 
          />
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn(
              "p-6 rounded-[32px] mb-10 bg-slate-50 border border-slate-100 group-hover:bg-primary transition-all duration-500 shadow-sm",
              "group-hover:shadow-[0_15px_35px_rgba(255,0,0,0.2)]"
            )}
          >
            <Icon className="w-8 h-8 text-slate-700 group-hover:text-white transition-colors duration-500" />
          </motion.div>
          
          <h3 className="text-3xl font-black mb-6 text-slate-900 group-hover:text-primary transition-colors tracking-tighter leading-none">
            {title}
          </h3>
          <p className="text-slate-500 text-lg leading-relaxed mb-10 flex-grow font-medium">
            {description}
          </p>
          
          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-primary group-hover:gap-5 transition-all duration-500">
            Open Tool
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
