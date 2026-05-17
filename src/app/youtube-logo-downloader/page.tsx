"use client";

import { useState } from "react";
import { UserCircle, Download, AlertCircle, Loader2, Link2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoDownloader() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ logoUrl: string; channelName: string } | null>(null);
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
      } else if (!result.logoUrl) {
        setError("Could not find a logo for this channel.");
      } else {
        setData({
          logoUrl: result.logoUrl,
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
      title="Logo Downloader"
      description="Fetch and download original high-resolution profile pictures from any YouTube channel."
      icon={UserCircle}
      iconColor="#c6f9d8"
      seoContent={
        <div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1c1b1c", marginBottom: "8px" }}>
            Avatar Extraction
          </h3>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a5f68" }}>
            Our extractor pulls the original source profile picture in its maximum uploaded size (often 800x800 or 900x900), ensuring you get the cleanest version of a channel&apos;s avatar without the heavy compression applied to thumbnails around the site.
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
              id="logo-url-input"
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
            id="logo-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Logo"}
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
            <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center mt-8">
              <div className="prismatic-card p-10 flex flex-col items-center max-w-sm w-full">
                <div className="skeleton w-40 h-40 rounded-full mb-6" />
                <div className="skeleton h-6 w-3/4 mb-3" />
                <div className="skeleton h-4 w-1/2 mb-8" />
                <div className="skeleton h-12 w-full rounded-xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="flex justify-center mt-8">
               <div className="prismatic-card p-10 flex flex-col items-center text-center max-w-sm w-full">
                 <div className="relative w-44 h-44 mb-8 group">
                   <div className="absolute inset-0 bg-[#c6f9d8] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
                   <img
                     src={data.logoUrl}
                     alt={`${data.channelName} Logo`}
                     className="w-full h-full rounded-full object-cover border-2 border-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] relative z-10 transition-transform duration-500 group-hover:scale-105"
                   />
                 </div>
                 
                 <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "24px", fontWeight: 500, color: "#1c1b1c", marginBottom: "4px" }}>
                   {data.channelName}
                 </h2>
                 <p className="label-caps text-[#76777b] mb-8">Original High-Res Avatar</p>
                 
                 <motion.a
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    href={data.logoUrl}
                    download={`${data.channelName}-logo.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full !py-3 !rounded-xl"
                 >
                   <Download className="w-4 h-4" />
                   Download Full Size
                 </motion.a>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
