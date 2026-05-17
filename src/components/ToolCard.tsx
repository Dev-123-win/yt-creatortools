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
        <div className="bg-canvas-soft h-full p-xl rounded-md border border-mute/30 flex flex-col items-start relative overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-md">
          {/* Subtle Background Glow */}
          <div 
            className={cn(
              "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500",
              color
            )} 
          />
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-md rounded-md mb-lg bg-canvas border border-mute/30 group-hover:bg-primary transition-all duration-300 shadow-sm"
          >
            <Icon className="w-8 h-8 text-ink group-hover:text-on-primary transition-colors duration-300" />
          </motion.div>
          
          <h3 className="font-display text-[24px] font-medium tracking-tight mb-md text-ink group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-body text-[18px] leading-[27px] mb-xl flex-grow font-normal">
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-[16px] leading-[24px] font-semibold text-primary group-hover:gap-4 transition-all duration-300">
            Open Tool
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
