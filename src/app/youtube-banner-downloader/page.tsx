"use client";

import { useState } from "react";
import { Layout, Download, AlertCircle, Loader2, Link2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function BannerDownloader() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ bannerUrl: string; channelName: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else if (!result.bannerUrl) {
        setError("Could not find a banner for this channel. It might be hidden or not set.");
      } else {
        setData({
          bannerUrl: result.bannerUrl,
          channelName: result.channelName,
        });
      }
    } catch {
      setError("An error occurred during extraction. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Banner Downloader"
      description="Download original high-resolution channel art and banners from any YouTube channel. Paste a channel or video link."
      icon={Layout}
      iconColor="#f9f0c6"
      seoContent={
        <div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1c1b1c", marginBottom: "8px" }}>
            Branding Research
          </h3>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a5f68" }}>
            Analyze the visual identity of top-tier channels. Our downloader fetches the original 2560x1440 uploaded file, ensuring you see every detail of their branding strategy without compression or cropping applied by YouTube for different devices.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Input */}
        <div className="prismatic-card p-2 flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-3 flex-grow px-4 py-1">
            <Link2 className="w-4 h-4 text-[#c6c6cb] flex-shrink-0" />
            <input
              id="banner-url-input"
              type="url"
              placeholder="Paste a YouTube Channel or Video URL…"
              className="w-full py-2.5 bg-transparent outline-none text-[#1c1b1c] placeholder-[#c6c6cb]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 500 }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
              aria-label="YouTube Channel or Video URL"
            />
          </div>
          <motion.button
            id="banner-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Banner"}
          </motion.button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#ffdad6] border border-[#ffb4ab] text-[#93000a]"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 600 }}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="prismatic-card p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="skeleton h-4 w-24 mb-3" />
                  <div className="skeleton h-8 w-64" />
                </div>
                <div className="skeleton h-10 w-32 rounded-xl" />
              </div>
              <div className="skeleton w-full aspect-[21/9] rounded-xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prismatic-card p-6 overflow-hidden">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                 <div>
                   <span className="label-caps text-[#76777b] mb-2 block">Channel Found</span>
                   <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "28px", fontWeight: 500, color: "#1c1b1c" }}>
                     {data.channelName}
                   </h2>
                 </div>
                 <motion.a
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    href={data.bannerUrl}
                    download={`${data.channelName}-banner.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !py-2.5 !px-5 !rounded-xl shadow-sm"
                 >
                   <Download className="w-4 h-4" />
                   Download Art
                 </motion.a>
               </div>

               <div className="relative rounded-xl overflow-hidden aspect-[21/9] bg-[#f0eded] border border-[#e5e2e2] group">
                 <img
                   src={data.bannerUrl}
                   alt={`${data.channelName} Banner`}
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <p className="label-caps text-white">Native Resolution 2560x1440</p>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
