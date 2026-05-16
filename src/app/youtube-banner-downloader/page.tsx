"use client";

import { useState } from "react";
import { Layout, Download, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function BannerDownloader() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ bannerUrl: string; channelName: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await fetch("/api/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else if (!result.bannerUrl) {
        setError("Could not find a banner for this channel. It might be hidden or not set.");
      } else {
        setData({
          bannerUrl: result.bannerUrl,
          channelName: result.channelName
        });
      }
    } catch (err) {
      setError("An error occurred during extraction. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Banner Downloader"
      description="Download original high-resolution channel art and banners from any YouTube channel."
      icon={Layout}
      seoContent={
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-black mb-6 tracking-tighter">Branding Research</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Analyze the visual identity of top-tier channels. Our downloader fetches the original 2560x1440 
              uploaded file, ensuring you see every detail of their branding strategy.
            </p>
          </section>
        </div>
      }
    >
      <div className="flex flex-col gap-16">
        {/* Input Engine */}
        <div className="bg-white p-3 rounded-[40px] border border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-3">
          <div className="flex-grow flex items-center px-8 gap-4">
            <Sparkles className="w-5 h-5 text-primary opacity-30" />
            <input
              type="text"
              placeholder="Paste Channel URL or Video URL..."
              className="w-full py-4 outline-none text-slate-900 font-black text-lg placeholder:text-slate-200 bg-transparent"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExtract}
            disabled={loading}
            className="bg-primary text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Get Banner"}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[32px] bg-red-50 border border-red-100 text-red-500 text-sm font-black flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Engine */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="bg-white p-10 md:p-12 rounded-[56px] border border-slate-100 shadow-[0_30px_80px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 block">Channel Found</span>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{data.channelName}</h3>
                  </div>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={data.bannerUrl} 
                    download={`${data.channelName}-banner.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    Download Art
                  </motion.a>
                </div>
                
                <div className="relative rounded-[40px] overflow-hidden aspect-[21/9] bg-slate-50 border border-slate-100 group">
                  <img 
                    src={data.bannerUrl} 
                    alt={data.channelName}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-10">
                    <p className="text-white/90 font-black text-xs uppercase tracking-[0.3em]">Native Resolution 2560x1440</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
