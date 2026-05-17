"use client";

import { useState } from "react";
import { FileText, Copy, Check, AlertCircle, Loader2, Link2, Type } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function MetadataExtractor() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  const handleExtract = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData({
          title: result.title || "No title found.",
          description: result.description || "No description found.",
        });
      }
    } catch {
      setError("An error occurred during extraction. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, type: "title" | "desc") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="Metadata Extractor"
      description="Extract both the Video Title and Full Description in one click. Perfect for analyzing keyword placement and content structure."
      icon={FileText}
      iconColor="#e0c6f9"
      seoContent={
        <div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1c1b1c", marginBottom: "8px" }}>
            Unified SEO Research
          </h3>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a5f68" }}>
            Analyzing both the title and description together provides a complete picture of a competitor&apos;s SEO strategy. This tool helps you identify keyword placement patterns across both metadata layers, allowing you to optimize your own video descriptions for maximum search visibility and CTR.
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
              id="metadata-url-input"
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
            id="metadata-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Extract Data"}
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
            <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className="prismatic-card p-6">
                <div className="skeleton h-5 w-32 mb-4" />
                <div className="skeleton h-8 w-full mb-2" />
                <div className="skeleton h-8 w-2/3" />
              </div>
              <div className="prismatic-card p-6">
                <div className="skeleton h-5 w-40 mb-4" />
                <div className="space-y-3">
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-5/6" />
                  <div className="skeleton h-4 w-4/6" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              {/* Title Card */}
              <div className="prismatic-card p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyText(data.title, "title")}
                      className="btn-secondary !py-2 !px-4 !text-[13px] !rounded-lg"
                      aria-label="Copy title"
                   >
                     {copiedTitle ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Copy className="w-4 h-4" />}
                     {copiedTitle ? "Copied" : "Copy"}
                   </motion.button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-4 h-4 text-[#c6c6cb]" />
                  <span className="label-caps text-[#76777b]">Video Title</span>
                </div>
                <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "28px", fontWeight: 500, color: "#1c1b1c", lineHeight: 1.3, paddingRight: "80px" }}>
                  {data.title}
                </h2>
              </div>

              {/* Description Card */}
              <div className="prismatic-card p-6 relative group flex flex-col max-h-[600px]">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     <FileText className="w-4 h-4 text-[#c6c6cb]" />
                     <span className="label-caps text-[#76777b]">Description</span>
                   </div>
                   <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyText(data.description, "desc")}
                      className="btn-secondary !py-2 !px-4 !text-[13px] !rounded-lg"
                      aria-label="Copy description"
                   >
                     {copiedDesc ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Copy className="w-4 h-4" />}
                     {copiedDesc ? "Copied" : "Copy"}
                   </motion.button>
                 </div>
                 
                 <div className="flex-grow overflow-y-auto pr-4 bg-[#fcf8f9] rounded-xl p-4 border border-[#e5e2e2]">
                   <pre className="whitespace-pre-wrap font-sans text-[14px] leading-relaxed text-[#45474b]">
                     {data.description}
                   </pre>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
