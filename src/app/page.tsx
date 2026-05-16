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
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-slate-100 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.03)] animate-float">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trusted by 10k+ Creators</span>
            </div>
            
            <h1 className="text-[12vw] md:text-[10vw] font-black mb-12 tracking-tighter leading-[0.85] text-slate-900">
              The Professional <br />
              <span className="text-gradient-primary">YouTube Suite.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-500 mb-16 leading-relaxed font-medium">
              High-fidelity utilities engineered for elite YouTube growth. 
              Extract, optimize, and dominate the algorithm.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-6 rounded-[28px] bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary-600 transition-all shadow-[0_25px_50px_-12px_rgba(255,0,0,0.3)]"
              >
                Explore Tools
              </motion.button>
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/#tools"
                  className="px-12 py-6 rounded-[28px] bg-white text-slate-900 font-black border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-3 text-xs uppercase tracking-widest"
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
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">
              Core <span className="text-primary">Utilities.</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-500 text-xl font-medium leading-relaxed">
              Proprietary extraction engines optimized for zero-latency research.
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="bg-slate-50 px-10 py-5 rounded-[32px] text-xs font-black text-slate-400 flex items-center gap-4 border border-slate-100">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
            SYSTEM STATUS: OPTIMIZED
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
      <section className="bg-slate-50 py-40 rounded-[80px] mx-6 border border-slate-100 shadow-inner overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">
              Engineered <br />
              <span className="text-primary">Without Compromise.</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium">Why the world&apos;s largest channels use our infrastructure.</p>
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
        <h2 className="text-5xl md:text-7xl font-black mb-20 text-center tracking-tighter text-slate-900">
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
      whileHover={{ y: -15 }}
      className="flex flex-col items-center text-center group cursor-pointer"
    >
      <div className="p-10 rounded-[40px] bg-white border border-slate-100 mb-10 group-hover:bg-primary group-hover:border-primary transition-all duration-700 shadow-[0_15px_40px_rgba(0,0,0,0.02)] group-hover:shadow-[0_25px_60px_rgba(255,0,0,0.2)]">
        <Icon className="w-12 h-12 text-primary group-hover:text-white transition-all duration-500" />
      </div>
      <h3 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-lg font-medium px-4">{desc}</p>
    </motion.div>
  );
}

function FAQItem({ question, answer }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white p-12 rounded-[56px] border border-slate-100 hover:border-primary/20 transition-all duration-700 shadow-[0_20px_60px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] cursor-pointer group"
    >
      <h3 className="text-2xl font-black mb-6 text-slate-900 flex justify-between items-center tracking-tight">
        {question}
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:rotate-45 transition-all duration-500">
           <Zap className="w-4 h-4 text-slate-300 group-hover:text-white" />
        </div>
      </h3>
      <p className="text-slate-500 text-lg leading-relaxed font-medium">{answer}</p>
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
