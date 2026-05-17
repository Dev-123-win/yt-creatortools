"use client";

import { useState } from "react";
import { Hash, Copy, Check, AlertCircle, Loader2, Link2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function HashtagExtractor() {
  const [url, setUrl] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleExtract = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setHashtags([]);
    
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        const uniqueHashtags = Array.from(new Set(data.hashtags || [])) as string[];
        setHashtags(uniqueHashtags);
        if (uniqueHashtags.length === 0) {
          setError("No hashtags found in the description of this video.");
        }
      }
    } catch {
      setError("An error occurred during extraction. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const copyHashtag = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Hashtag Extractor"
      description="Quickly scan and extract all trending hashtags from any YouTube video or Shorts description."
      icon={Hash}
      iconColor="#f9c6d0"
      seoContent={
        <div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1c1b1c", marginBottom: "8px" }}>
            Algorithm Discovery
          </h3>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a5f68" }}>
            Hashtags act as high-level category markers for the YouTube algorithm. By extracting hashtags from top-performing videos in your niche, you can ensure your content is indexed alongside the right audience segments and trending topics.
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
              id="hashtag-url-input"
              type="url"
              placeholder="Paste a YouTube Video or Shorts URL…"
              className="w-full py-2.5 bg-transparent outline-none text-[#1c1b1c] placeholder-[#c6c6cb]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 500 }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
              aria-label="YouTube video URL"
            />
          </div>
          <motion.button
            id="hashtag-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Extract"}
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

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-wrap gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-xl" style={{ width: `${80 + Math.random() * 60}px` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {hashtags.length > 0 && !loading && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="chip bg-[#f9c6d0]/40 text-[#1c1b1c] border border-[#f9c6d0]">
                    {hashtags.length} hashtags found
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={copyAll}
                  className="btn-secondary !py-2 !px-5 !text-[13px] !rounded-xl"
                >
                  {allCopied ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Copy className="w-4 h-4" />}
                  {allCopied ? "Copied!" : "Copy All"}
                </motion.button>
              </div>

              {/* Tag grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {hashtags.map((tag, i) => {
                  const rawTag = tag.startsWith("#") ? tag.substring(1) : tag;
                  return (
                    <motion.button
                      key={i}
                      id={`hashtag-item-${i}`}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyHashtag(tag, i)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#e5e2e2] bg-white hover:border-[#f9c6d0] hover:bg-[#fcf8f9] transition-all shadow-sm group text-left"
                      aria-label={`Copy hashtag: ${tag}`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                         <span className="text-[14px] font-bold text-[#f9c6d0] group-hover:scale-110 transition-transform">#</span>
                         <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1c1b1c" }} className="truncate">
                           {rawTag}
                         </span>
                      </div>
                      <div className="flex-shrink-0">
                        {copiedIndex === i
                          ? <Check className="w-3.5 h-3.5 text-[#4ade80]" />
                          : <Copy className="w-3.5 h-3.5 text-[#c6c6cb] group-hover:text-[#f9c6d0] transition-colors" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
