"use client";
import { useState } from "react";
import { Tag, Copy, Check, AlertCircle, Loader2, Link2, Clipboard } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard, extractYouTubeId } from "@/lib/utils";
import { Toast } from "@/components/Toast";

export default function TagsExtractor() {
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setTags([]);
    setSelectedTags([]);
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

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTags.length === tags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags([...tags]);
    }
  };

  const handleCopySelected = async () => {
    const toCopy = selectedTags.length > 0 ? selectedTags : tags;
    const success = await copyToClipboard(toCopy.join(", "));
    if (success) {
      setToastMessage(
        selectedTags.length > 0
          ? `Copied ${selectedTags.length} selected tags!`
          : "Copied all tags!"
      );
      setToastShow(true);
    }
  };

  const isValidUrl = url ? !!extractYouTubeId(url) : null;

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
        <div className="prismatic-card p-2 flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-3 flex-grow w-full px-4 py-1">
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
            id="tags-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[rgba(255,255,255,0.4)] p-4 rounded-2xl border border-[rgba(255,255,255,0.5)] backdrop-blur-sm shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip bg-[#c6d4f9]/30 text-[#1c1b1c] border border-[#c6d4f9]/60 font-semibold py-1 px-3">
                    {tags.length} Keywords found
                  </span>
                  {selectedTags.length > 0 && (
                    <span className="chip bg-[#1c1b1c] text-white border border-transparent font-semibold py-1 px-3 animate-scale-in">
                      {selectedTags.length} of {tags.length} selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSelectAll}
                    className="btn-secondary !py-2 !px-4 !text-[13px] !rounded-xl text-xs flex-grow sm:flex-grow-0 text-center"
                  >
                    {selectedTags.length === tags.length ? "Deselect All" : "Select All"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleCopySelected}
                    className="btn-primary !py-2 !px-5 !text-[13px] !rounded-xl text-xs flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {selectedTags.length > 0 ? "Copy Selected" : "Copy All"}
                  </motion.button>
                </div>
              </div>

              {/* Instructions / Hint */}
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px" }} className="text-[#76777b] italic px-1">
                💡 Tap individual tags below to select specific keywords, then click &quot;Copy Selected&quot;.
              </p>

              {/* Tag cloud */}
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tag, i) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <motion.button
                      key={i}
                      id={`tag-item-${i}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.025, type: "spring", stiffness: 300 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all shadow-sm ${
                        isSelected
                          ? "border-[#1c1b1c] bg-[#1c1b1c] text-white hover:bg-black"
                          : "border-[#e5e2e2] bg-white text-[#1c1b1c] hover:border-[#1c1b1c] hover:bg-[#f6f3f3]"
                      }`}
                      aria-label={`Toggle selection for tag: ${tag}`}
                    >
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600 }}>{tag}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white animate-scale-in" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#c6c6cb] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toast message={toastMessage} show={toastShow} onClose={() => setToastShow(false)} />
    </ToolLayout>
  );
}
