"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Award, ExternalLink } from "lucide-react";

const tools = [
  { name: "Thumbnail Downloader", href: "/youtube-thumbnail-downloader" },
  { name: "Tags Extractor", href: "/youtube-tags-extractor" },
  { name: "Metadata Extractor", href: "/youtube-metadata-extractor" },
  { name: "Banner Downloader", href: "/youtube-banner-downloader" },
  { name: "Logo Downloader", href: "/youtube-logo-downloader" },
  { name: "Hashtag Extractor", href: "/youtube-hashtag-extractor" },
];

const info = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "About YTToolkit", href: "#" },
  { name: "Support Center", href: "#" },
  { name: "Featured Resource", href: "https://omg10.com/4/11013399", external: true },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Creator Verified", color: "#c6f9d8" },
  { icon: Lock, label: "100% Private & Safe", color: "#c6d4f9" },
  { icon: Award, label: "YouTube Compliant", color: "#f9c6d0" },
];

export function Footer() {
  return (
    <footer
      className="mt-32 border-t border-[rgba(0,0,0,0.05)] relative overflow-hidden"
      style={{ background: "rgba(251,248,249,0.7)", backdropFilter: "blur(16px)" }}
    >
      {/* Subtle top iridescent line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#f9c6d0] via-[#c6d4f9] via-[#c6f9d8] via-[#e0c6f9] to-transparent opacity-80" />

      <div className="w-full max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group/logo w-fit">
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border border-[#e5e2e2] shadow-sm bg-white relative"
              >
                <img src="/logo.png" alt="YTToolkit Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em" }}
                className="text-[#1c1b1c]"
              >
                YT<span className="text-[#5a5f68]">Toolkit</span>
              </span>
            </Link>
            <p
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", lineHeight: 1.7 }}
              className="text-[#5a5f68] max-w-[280px]"
            >
              Free, fast, and private YouTube creator utilities. No login, no tracking — ever.
            </p>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2 max-w-[280px]">
              {trustBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.4)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-transform hover:translate-x-1 duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.72)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${badge.color}60` }}
                  >
                    <badge.icon className="w-4 h-4 text-[#1c1b1c]" />
                  </div>
                  <span
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600 }}
                    className="text-[#45474b]"
                  >
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <p className="label-caps text-[#76777b] mb-5 tracking-widest text-[11px]">Tools</p>
            <ul className="space-y-3.5">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px" }}
                    className="text-[#5a5f68] hover:text-[#1c1b1c] transition-colors flex items-center gap-1 group w-fit"
                  >
                    <span className="relative">
                      {tool.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <p className="label-caps text-[#76777b] mb-5 tracking-widest text-[11px]">Info</p>
            <ul className="space-y-3.5">
              {info.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "sponsored noopener noreferrer" : undefined}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px" }}
                    className={`inline-flex items-center gap-1 group transition-colors ${
                      item.external
                        ? "text-[#1c1b1c] font-semibold hover:text-black"
                        : "text-[#5a5f68] hover:text-[#1c1b1c]"
                    }`}
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#000000] transition-all duration-300 group-hover:w-full" />
                    </span>
                    {item.external && <ExternalLink className="w-3.5 h-3.5 text-[#5a5f68] group-hover:text-black transition-colors" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Iridescent Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f9c6d0] via-[#c6d4f9] via-[#c6f9d8] via-[#e0c6f9] to-transparent opacity-85 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px" }}
            className="text-[#76777b]"
          >
            © {new Date().getFullYear()} YTToolkit. All rights reserved.
          </p>

          <div
            className="flex items-center gap-1.5 font-semibold text-sm text-[#45474b]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="inline-block text-[#ba1a1a]"
            >
              ❤️
            </motion.span>
            <span>for Creators</span>
          </div>

          <div className="flex gap-3">
            {["Fast", "Mobile First", "SEO Pro"].map((badge) => (
              <span
                key={badge}
                className="label-caps text-[#5a5f68] text-[10px] px-3 py-1 rounded-full border border-[rgba(0,0,0,0.04)] bg-[rgba(255,255,255,0.5)]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
