"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accentColor: string; /* e.g. "#f9c6d0" */
  index?: number;
}

export function ToolCard({ title, description, href, icon: Icon, accentColor, index = 0 }: ToolCardProps) {
  /* Physics-based 3D tilt */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: index * 0.07 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group h-full"
    >
      <Link href={href} tabIndex={-1} aria-label={title}>
        <div
          className="prismatic-card h-full p-6 flex flex-col relative cursor-pointer group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.09)]"
          style={{ transition: "box-shadow 0.3s ease" }}
        >
          {/* Accent top border */}
          <div
            className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: accentColor }}
          />

          {/* Accent background glow */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500"
            style={{ background: accentColor }}
            aria-hidden="true"
          />

          {/* Icon enclosure */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[rgba(0,0,0,0.06)] shadow-sm"
            style={{ background: accentColor + "55" }}
          >
            <Icon className="w-5 h-5 text-[#1c1b1c]" strokeWidth={1.8} />
          </motion.div>

          <h3
            style={{ fontFamily: "'Newsreader', serif", fontSize: "20px", fontWeight: 500, letterSpacing: "-0.01em" }}
            className="text-[#1c1b1c] mb-2 leading-snug group-hover:text-black transition-colors"
          >
            {title}
          </h3>

          <p
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", lineHeight: "1.6" }}
            className="text-[#5a5f68] flex-grow mb-5"
          >
            {description}
          </p>

          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1c1b1c] group-hover:gap-3 transition-all duration-300">
            <span>Open Tool</span>
            <motion.span
              animate={{ x: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
