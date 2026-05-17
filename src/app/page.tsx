"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Tag, FileText, Layout, UserCircle, Hash, Zap, Shield, Play as YoutubeIcon, ArrowDown, ChevronDown } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const tools = [
  {
    title: "Thumbnail Downloader",
    description: "Download ultra-high-res video thumbnails in every quality tier — from 4K MaxRes down to preview size.",
    href: "/youtube-thumbnail-downloader",
    icon: ImageIcon,
    accentColor: "#f9c6d0",
  },
  {
    title: "Tags Extractor",
    description: "Reveal the hidden SEO keywords powering any viral video. Copy all tags with one click.",
    href: "/youtube-tags-extractor",
    icon: Tag,
    accentColor: "#c6d4f9",
  },
  {
    title: "Metadata Extractor",
    description: "Pull the full title and description of any YouTube video in one high-speed scan.",
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
    description: "Extract full-resolution channel profile pictures without any compression artifacts.",
    href: "/youtube-logo-downloader",
    icon: UserCircle,
    accentColor: "#c6f9d8",
  },
  {
    title: "Hashtag Extractor",
    description: "Scan and extract every trending hashtag from any video description in seconds.",
    href: "/youtube-hashtag-extractor",
    icon: Hash,
    accentColor: "#f9c6d0",
  },
];

const features = [
  {
    icon: Zap,
    title: "Zero Latency",
    desc: "Serverless edge architecture delivers results in under 80ms — no rate limits, no waiting.",
    color: "#f9f0c6",
  },
  {
    icon: Shield,
    title: "Private by Design",
    desc: "Zero logs, zero tracking. Your research strategy stays yours — always.",
    color: "#c6f9d8",
  },
  {
    icon: YoutubeIcon,
    title: "Universal Support",
    desc: "Full native support for Shorts, Premieres, Live Streams, and standard VOD formats.",
    color: "#c6d4f9",
  },
];

const faqs = [
  {
    q: "Is it truly free for enterprise use?",
    a: "Yes. We leverage advanced client-side processing to eliminate infrastructure costs, allowing us to provide pro-level tools for free indefinitely.",
  },
  {
    q: "How accurate is the tag extraction?",
    a: "100%. We pull data directly from the video metadata layer, exposing the exact keywords provided to the YouTube algorithm.",
  },
  {
    q: "Can I download 4K thumbnails?",
    a: "Absolutely. If a creator uploads a 4K asset, our MaxRes extractor fetches it in its original native resolution.",
  },
  {
    q: "Do I need an account or API key?",
    a: "No. Every tool works instantly in your browser — no sign-up, no API keys, no installation required.",
  },
];

/* ── Floating Orb (physics) ─────────────────────────────── */
function Orb({ size, top, left, color, delay }: any) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, top, left, background: color, filter: "blur(60px)", opacity: 0.12 }}
      animate={{ y: [0, -20, 10, 0], x: [0, 10, -8, 0], scale: [1, 1.05, 0.97, 1] }}
      transition={{ duration: 12 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ── FAQ Item (accordion) ───────────────────────────────── */
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 100 }}
      className="prismatic-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
        aria-expanded={open}
      >
        <span
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 600, lineHeight: 1.4, color: "#1c1b1c" }}
          className="pr-4"
        >
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f0eded] flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-[#5a5f68]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="overflow-hidden"
          >
            <p
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a5f68" }}
              className="px-6 pb-6"
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Feature Card ──────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, color, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 90, damping: 18 }}
      whileHover={{ y: -6 }}
      className="prismatic-card p-8 flex flex-col gap-5"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: color + "66" }}
      >
        <Icon className="w-5 h-5 text-[#1c1b1c]" strokeWidth={1.6} />
      </div>
      <div>
        <h3
          style={{ fontFamily: "'Newsreader', serif", fontSize: "22px", fontWeight: 500, letterSpacing: "-0.01em", color: "#1c1b1c", marginBottom: "8px" }}
        >
          {title}
        </h3>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.65, color: "#5a5f68" }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Mouse-tracking hero ─────────────────────────────── */
function HeroOrbs({ scrollYProgress }: { scrollYProgress: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 60);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  // Transform scroll progress into beautiful blur values dynamically
  const blurVal1 = useTransform(scrollYProgress, [0, 0.8], ["blur(80px)", "blur(180px)"]);
  const blurVal2 = useTransform(scrollYProgress, [0, 0.8], ["blur(80px)", "blur(180px)"]);
  const blurVal3 = useTransform(scrollYProgress, [0, 0.8], ["blur(100px)", "blur(200px)"]);

  return (
    <>
      <motion.div style={{ x: springX, y: springY, filter: blurVal1 }}
        className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-[#f9c6d0] opacity-20 pointer-events-none" />
      <motion.div style={{ x: useTransform(springX, v => -v * 0.7), y: useTransform(springY, v => -v * 0.7), filter: blurVal2 }}
        className="absolute top-[20%] right-[8%] w-64 h-64 rounded-full bg-[#c6d4f9] opacity-20 pointer-events-none" />
      <motion.div style={{ x: useTransform(springX, v => v * 0.4), y: useTransform(springY, v => v * 0.5), filter: blurVal3 }}
        className="absolute bottom-0 left-[40%] w-80 h-80 rounded-full bg-[#c6f9d8] opacity-15 pointer-events-none" />
    </>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  
  // Dynamic backdrop blur that applies to all layout assets behind the hero on scroll
  const backdropBlur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(28px)"]);

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-5">
        <HeroOrbs scrollYProgress={scrollYProgress} />
        
        {/* Dynamic backdrop-blur sheet that gradually blurs background layers as user scrolls */}
        <motion.div 
          style={{ backdropFilter: backdropBlur, WebkitBackdropFilter: backdropBlur }}
          className="absolute inset-0 pointer-events-none z-[5]"
        />

        <motion.div style={{ y: heroY }} className="w-full max-w-[800px] mx-auto text-center relative z-10">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className="inline-flex items-center gap-2 badge-pill mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" aria-hidden="true" />
            <span className="label-caps text-[#45474b]">Trusted by 10k+ Creators — Free Forever</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
            style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1c1b1c" }}
            className="mb-6"
          >
            The Professional<br />
            <span style={{ color: "#5a5f68", fontStyle: "italic" }}>YouTube Suite.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.65, color: "#5a5f68" }}
            className="max-w-[500px] mx-auto mb-10"
          >
            Six precision-built tools for extracting thumbnails, tags, metadata, banners, logos, and hashtags — instantly, for free.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <motion.a
              href="#tools"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="btn-primary ripple-btn !px-8 !py-4 !text-[16px] !rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
            >
              Explore All Tools
            </motion.a>
            <motion.a
              href="/youtube-thumbnail-downloader"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="btn-secondary !px-8 !py-4 !text-[16px] !rounded-xl"
            >
              Try Thumbnail Tool →
            </motion.a>
          </motion.div>

          {/* Floating chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 flex-wrap mt-10"
          >
            {["No Login", "No API Key", "100% Free", "GDPR Safe"].map((label, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="chip bg-[rgba(0,0,0,0.04)] text-[#45474b] border border-[#e5e2e2]"
              >
                ✓ {label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="label-caps text-[#c6c6cb]">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
            <ArrowDown className="w-4 h-4 text-[#c6c6cb]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="py-12 px-5 border-y border-[#e5e2e2] bg-[rgba(255,255,255,0.5)]" style={{ backdropFilter: "blur(8px)" }}>
        <div className="w-full max-w-[800px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "<80ms", label: "Extraction Speed" },
            { value: "6", label: "Precision Tools" },
            { value: "100%", label: "Tag Accuracy" },
            { value: "$0", label: "Cost Per Use" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.03em", color: "#1c1b1c", lineHeight: 1 }}
                className="mb-1"
              >
                {stat.value}
              </div>
              <div className="label-caps text-[#76777b]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tools Grid ───────────────────────────────────── */}
      <section id="tools" className="py-24 px-5">
        <div className="w-full max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="label-caps text-[#76777b] mb-4">Core utilities</p>
            <h2
              style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, letterSpacing: "-0.025em", color: "#1c1b1c" }}
              className="mb-4"
            >
              Everything you need
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", color: "#5a5f68" }}>
              Proprietary extraction engines — zero latency, zero compromise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <ToolCard key={tool.href} {...tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-24 px-5 bg-[rgba(255,255,255,0.5)]" style={{ backdropFilter: "blur(8px)", borderTop: "1px solid #e5e2e2", borderBottom: "1px solid #e5e2e2" }}>
        <div className="w-full max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="label-caps text-[#76777b] mb-4">Why YTToolkit</p>
            <h2
              style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, letterSpacing: "-0.025em", color: "#1c1b1c" }}
            >
              Engineered without<br />
              <span style={{ fontStyle: "italic", color: "#5a5f68" }}>compromise.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="w-full max-w-[700px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="label-caps text-[#76777b] mb-4">FAQ</p>
            <h2
              style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, letterSpacing: "-0.025em", color: "#1c1b1c" }}
            >
              Got questions?
            </h2>
          </motion.div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="py-24 px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="w-full max-w-[700px] mx-auto prismatic-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#f9c6d0]/10 via-transparent to-[#c6d4f9]/10 pointer-events-none" />
          <p className="label-caps text-[#76777b] mb-4 relative z-10">Start now — free</p>
          <h2
            style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, letterSpacing: "-0.025em", color: "#1c1b1c" }}
            className="mb-4 relative z-10"
          >
            Ready to dominate<br />the algorithm?
          </h2>
          <p
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", color: "#5a5f68" }}
            className="mb-8 relative z-10"
          >
            Six powerful tools. No account. No credit card. Just results.
          </p>
          <motion.a
            href="#tools"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="btn-primary ripple-btn !px-10 !py-4 !text-[16px] !rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative z-10 inline-flex"
          >
            Get Started Free
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
