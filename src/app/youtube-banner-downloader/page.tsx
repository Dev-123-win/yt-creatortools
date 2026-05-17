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
            <h3 className="font-display text-[32px] font-medium mb-sm text-ink tracking-tight">Branding Research</h3>
            <p className="text-body text-[20px] leading-[30px]">
              Analyze the visual identity of top-tier channels. Our downloader fetches the original 2560x1440 
              uploaded file, ensuring you see every detail of their branding strategy.
            </p>
          </section>
        </div>
      }
    >
      <div className="flex flex-col gap-16">
        {/* Input Engine */}
        <div className="bg-canvas p-sm rounded-md border border-mute flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="flex-grow flex items-center px-4 gap-4">
            <Sparkles className="w-5 h-5 text-primary opacity-30" />
            <input
              type="text"
              placeholder="Paste Channel URL or Video URL..."
              className="w-full py-4 outline-none text-ink font-medium text-[18px] bg-transparent placeholder-mute"
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
            className="btn-primary"
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
              <div className="bg-canvas-soft p-xl rounded-md border border-mute/50 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-xl">
                  <div>
                    <span className="eyebrow-uppercase text-primary mb-2 block">Channel Found</span>
                    <h3 className="font-display text-[32px] font-medium text-ink tracking-tight">{data.channelName}</h3>
                  </div>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={data.bannerUrl} 
                    download={`${data.channelName}-banner.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Art
                  </motion.a>
                </div>
                
                <div className="relative rounded-md overflow-hidden aspect-[21/9] bg-canvas border border-mute/30 group">
                  <img 
                    src={data.bannerUrl} 
                    alt={data.channelName}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium eyebrow-uppercase">Native Resolution 2560x1440</p>
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
