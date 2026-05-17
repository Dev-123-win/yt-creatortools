"use client";

import { useState } from "react";
import { Tag, Copy, Check, AlertCircle, Loader2, Link2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function TagsExtractor() {
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleExtract = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setTags([]);
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
        const extracted = data.tags ?? [];
        setTags(extracted);
        if (extracted.length === 0)
          setError("No SEO tags found. This video may have hidden tags or is a Shorts/Live stream without traditional keywords.");
      }
    } catch {
      setError("Extraction failed. Please verify the URL and your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyTag = (tag: string, i: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tags.join(", "));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Tags Extractor"
      description="Reveal the hidden SEO keywords powering any viral YouTube video. Extract every tag and copy them all in one click."
      icon={Tag}
      iconColor="#c6d4f9"
      seoContent={
        <div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1c1b1c", marginBottom: "8px" }}>
            The Power of Video Tags
          </h3>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a5f68" }}>
            While tags are no longer the primary ranking factor, they provide critical context to the YouTube algorithm about the topics and niches your video belongs to. Analyzing top-performing competitors allows you to bridge the gap in your own SEO strategy by understanding exactly which keyword clusters they target.
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
              id="tags-url-input"
              type="url"
              placeholder="Paste a YouTube video URL…"
              className="w-full py-2.5 bg-transparent outline-none text-[#1c1b1c] placeholder-[#c6c6cb]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 500 }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
              aria-label="YouTube video URL"
            />
          </div>
          <motion.button
            id="tags-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Tags"}
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
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton h-8 rounded-full" style={{ width: `${60 + Math.random() * 80}px` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {tags.length > 0 && !loading && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="chip bg-[#c6d4f9]/40 text-[#1c1b1c] border border-[#c6d4f9]">
                    {tags.length} keywords found
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

              {/* Tag cloud */}
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tag, i) => (
                  <motion.button
                    key={i}
                    id={`tag-item-${i}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.025, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => copyTag(tag, i)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e5e2e2] bg-white hover:border-[#1c1b1c] hover:bg-[#f6f3f3] transition-all shadow-sm"
                    aria-label={`Copy tag: ${tag}`}
                  >
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: "#1c1b1c" }}>{tag}</span>
                    {copiedIndex === i
                      ? <Check className="w-3.5 h-3.5 text-[#4ade80]" />
                      : <Copy className="w-3 h-3 text-[#c6c6cb]" />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
