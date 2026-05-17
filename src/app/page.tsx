"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { 
  Image as ImageIcon, 
  Tag, 
  FileText, 
  Layout, 
  UserCircle, 
  Hash, 
  Eye, 
  Type,
  Play as YoutubeIcon,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import Link from "next/link";
import { useRef } from "react";

const tools = [
  {
    title: "Thumbnail Downloader",
    description: "Download ultra-high resolution thumbnails and Shorts assets instantly.",
    href: "/youtube-thumbnail-downloader",
    icon: ImageIcon,
    color: "bg-red-500",
  },
  {
    title: "Tags Extractor",
    description: "Deep-scan SEO keywords from any viral video or Live stream.",
    href: "/youtube-tags-extractor",
    icon: Tag,
    color: "bg-blue-500",
  },
  {
    title: "Metadata Extractor",
    description: "Extract video titles and full descriptions in a single high-speed scan.",
    href: "/youtube-metadata-extractor",
    icon: FileText,
    color: "bg-purple-500",
  },
  {
    title: "Banner Downloader",
    description: "Get original high-res channel art and branding assets.",
    href: "/youtube-banner-downloader",
    icon: Layout,
    color: "bg-orange-500",
  },
  {
    title: "Channel Logo Downloader",
    description: "Extract original profile pictures in maximum dimensions.",
    href: "/youtube-logo-downloader",
    icon: UserCircle,
    color: "bg-green-500",
  },
  {
    title: "Hashtag Extractor",
    description: "AI-powered hashtag extraction from video descriptions.",
    href: "/youtube-hashtag-extractor",
    icon: Hash,
    color: "bg-pink-500",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col gap-40 pb-40">
      {/* Hero Section */}
      <section ref={heroRef} className="relative px-6 pt-24 pb-32 overflow-hidden min-h-[90vh] flex items-center">
        <motion.div 
          style={{ opacity }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <div className="inline-flex items-center gap-2 px-md py-xs rounded-pill bg-canvas-soft border border-mute/30 mb-lg shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="eyebrow-uppercase text-ink">Trusted by 10k+ Creators</span>
            </div>
            
            <h1 className="font-display text-[56px] font-medium mb-lg tracking-tight leading-none text-ink">
              The Professional <br />
              <span className="text-primary">YouTube Suite.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-body-lg text-body mb-xl leading-relaxed">
              High-fidelity utilities engineered for elite YouTube growth. 
              Extract, optimize, and dominate the algorithm.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Explore Tools
              </motion.button>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/#tools"
                  className="btn-tertiary flex items-center gap-3"
                >
                  Explore Tools
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Parallax Background Elements */}
        <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-red-100/30 rounded-full blur-[120px] -z-10" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[150px] -z-10" />
      </section>

      {/* Tools Grid with Staggered Animation */}
      <motion.section 
        id="tools" 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl">
            <motion.h2 variants={itemVariants} className="font-display text-[48px] font-medium mb-sm tracking-tight text-ink">
              Core <span className="text-primary">Utilities.</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-body text-body-lg">
              Proprietary extraction engines optimized for zero-latency research.
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="badge-pill border border-mute flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="eyebrow-uppercase">SYSTEM STATUS: OPTIMIZED</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Showcase */}
      <section className="bg-canvas-soft py-40 rounded-md mx-6 border border-mute/30 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-3xl">
            <h2 className="font-display text-[48px] font-medium mb-md tracking-tight text-ink">
              Engineered <br />
              <span className="text-primary">Without Compromise.</span>
            </h2>
            <p className="text-body text-body-lg">Why the world&apos;s largest channels use our infrastructure.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <Feature 
              icon={Zap} 
              title="Zero Latency" 
              desc="Our serverless architecture fetches data in <80ms, bypassing traditional rate limits." 
            />
            <Feature 
              icon={Shield} 
              title="Military Privacy" 
              desc="Zero logs. Zero tracking. Your content strategy is a trade secret; we keep it that way." 
            />
            <Feature 
              icon={YoutubeIcon} 
              title="Universal Sync" 
              desc="Full native support for Shorts, Premiere, Live Streams, and VOD formats." 
            />
          </div>
        </div>
        
        {/* Animated Background SVG */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="black" strokeWidth="0.1" />
          </svg>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 w-full">
        <h2 className="font-display text-[48px] font-medium mb-20 text-center tracking-tight text-ink">
          Deep <span className="text-primary">Answers.</span>
        </h2>
        <div className="grid grid-cols-1 gap-10">
          <FAQItem 
            question="Is it truly free for enterprise use?" 
            answer="Yes. We leverage advanced client-side processing to eliminate infrastructure costs, allowing us to provide pro-level tools for free indefinitely." 
          />
          <FAQItem 
            question="How accurate is the tag extraction?" 
            answer="100%. We pull data directly from the video metadata layer, exposing the exact keywords provided to the YouTube algorithm." 
          />
          <FAQItem 
            question="Can I download 4K thumbnails?" 
            answer="Absolutely. If a creator uploads a 4K asset, our MaxRes extractor will fetch it in its original native resolution." 
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col items-center text-center group cursor-pointer"
    >
      <div className="p-xl rounded-md bg-canvas border border-mute/30 mb-lg group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-sm">
        <Icon className="w-12 h-12 text-primary group-hover:text-on-primary transition-colors duration-300" />
      </div>
      <h3 className="font-display text-[32px] font-medium mb-sm text-ink group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-body text-body-md px-4">{desc}</p>
    </motion.div>
  );
}

function FAQItem({ question, answer }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-canvas p-xl rounded-md border border-mute/30 hover:border-primary/50 transition-all duration-300 shadow-sm cursor-pointer group"
    >
      <h3 className="font-display text-[24px] font-medium mb-sm text-ink flex justify-between items-center tracking-tight group-hover:text-primary transition-colors">
        {question}
        <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center group-hover:bg-primary group-hover:rotate-45 transition-all duration-300">
           <Zap className="w-4 h-4 text-mute group-hover:text-on-primary" />
        </div>
      </h3>
      <p className="text-body text-body-md">{answer}</p>
    </motion.div>
  );
}

function StatGrid() {
  const stats = [
    { label: "Extraction Speed", value: "<80ms" },
    { label: "Infrastructure", value: "Edge-Ready" },
    { label: "Native API", value: "v3.2" },
    { label: "Cost Per Call", value: "$0.00" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 max-w-6xl mx-auto">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring" }}
          className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center"
        >
          <div className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
