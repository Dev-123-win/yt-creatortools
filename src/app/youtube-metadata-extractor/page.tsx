"use client";
import { useState } from "react";
import { FileText, Copy, Check, AlertCircle, Loader2, Link2, Type, Clipboard, Maximize2, Minimize2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard, extractYouTubeId } from "@/lib/utils";
import { Toast } from "@/components/Toast";

export default function MetadataExtractor() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch (err) {
      console.warn("Failed to read from clipboard", err);
    }
  };

  const handleExtract = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    setIsExpanded(false);
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

  const copyText = async (text: string, type: "title" | "desc") => {
    const success = await copyToClipboard(text);
    if (success) {
      if (type === "title") {
        setCopiedTitle(true);
        setToastMessage("Title copied to clipboard!");
        setToastShow(true);
        setTimeout(() => setCopiedTitle(false), 2000);
      } else {
        setCopiedDesc(true);
        setToastMessage("Description copied to clipboard!");
        setToastShow(true);
        setTimeout(() => setCopiedDesc(false), 2000);
      }
    }
  };

  const getWordCount = (text: string) => {
    return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  };

  const getCharCount = (text: string) => {
    return text ? text.length : 0;
  };

  const isValidUrl = url ? !!extractYouTubeId(url) : null;

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
        <div className="prismatic-card p-2 flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-3 flex-grow w-full px-4 py-1">
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
            {/* Validation Indicator */}
            {url && (
              <div className="flex-shrink-0">
                {isValidUrl ? (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Valid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5" /> Invalid
                  </span>
                )}
              </div>
            )}
            
            {/* Paste Button */}
            <button
              type="button"
              onClick={handlePaste}
              className="flex-shrink-0 text-xs font-semibold text-[#5a5f68] hover:text-[#1c1b1c] bg-[#f0eded] hover:bg-[#e5e2e2] px-2.5 py-1.5 rounded-lg border border-[#e5e2e2] transition-colors flex items-center gap-1"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3 h-3" /> Paste
            </button>
          </div>
          <motion.button
            id="metadata-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
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
              <div className="prismatic-card p-6 relative group overflow-hidden bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#c6c6cb]" />
                    <span className="label-caps text-[#76777b]">Video Title</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-semibold text-[#76777b] bg-[#f0eded] px-2.5 py-1 rounded-md border border-[#e5e2e2]">
                      {getCharCount(data.title)} chars
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyText(data.title, "title")}
                      className="btn-secondary !py-2 !px-4 !text-[13px] !rounded-lg flex items-center gap-1 w-full sm:w-auto"
                      aria-label="Copy title"
                    >
                      {copiedTitle ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Copy className="w-4 h-4" />}
                      {copiedTitle ? "Copied" : "Copy Title"}
                    </motion.button>
                  </div>
                </div>
                <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "28px", fontWeight: 500, color: "#1c1b1c", lineHeight: 1.3 }}>
                  {data.title}
                </h2>
              </div>

              {/* Description Card */}
              <div className="prismatic-card p-6 relative group flex flex-col bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#c6c6cb]" />
                    <span className="label-caps text-[#76777b]">Description</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                    <span className="text-[12px] font-semibold text-[#76777b] bg-[#f0eded] px-2.5 py-1 rounded-md border border-[#e5e2e2]">
                      {getWordCount(data.description)} words
                    </span>
                    <span className="text-[12px] font-semibold text-[#76777b] bg-[#f0eded] px-2.5 py-1 rounded-md border border-[#e5e2e2]">
                      {getCharCount(data.description)} chars
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="btn-secondary !py-2 !px-4 !text-[13px] !rounded-lg flex items-center gap-1"
                      aria-label={isExpanded ? "Collapse Description" : "Expand Description"}
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      {isExpanded ? "Collapse" : "Expand"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyText(data.description, "desc")}
                      className="btn-primary !py-2 !px-4 !text-[13px] !rounded-lg flex items-center gap-1"
                      aria-label="Copy description"
                    >
                      {copiedDesc ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Copy className="w-4 h-4" />}
                      {copiedDesc ? "Copied" : "Copy Description"}
                    </motion.button>
                  </div>
                </div>
                
                <div 
                  className={`overflow-y-auto pr-2 bg-[#fcf8f9]/80 rounded-xl p-4 border border-[#e5e2e2] transition-all duration-300 ${
                    isExpanded ? "max-h-none min-h-[400px]" : "max-h-[300px]"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans text-[14.5px] leading-relaxed text-[#45474b]">
                    {data.description}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toast message={toastMessage} show={toastShow} onClose={() => setToastShow(false)} />
    </ToolLayout>
  );
}
