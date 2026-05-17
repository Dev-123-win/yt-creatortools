"use client";

import { useState } from "react";
import { Image as ImageIcon, Download, Copy, Check, AlertCircle, Loader2, Link2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { extractYouTubeId } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const qualities = [
  { label: "Max Resolution", sublabel: "Up to 4K · Native", name: "maxresdefault", badge: "4K" },
  { label: "High Definition", sublabel: "1080p · HQ", name: "hqdefault", badge: "HQ" },
  { label: "Standard", sublabel: "640×480 · SD", name: "sddefault", badge: "SD" },
  { label: "Preview", sublabel: "320×180 · MQ", name: "mqdefault", badge: "MQ" },
];

export default function ThumbnailDownloaderClient() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleExtract = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const id = extractYouTubeId(url);
      if (id) {
        setVideoId(id);
      } else {
        setError("Invalid YouTube URL. Please paste a valid video, Shorts, or Live link.");
        setVideoId(null);
      }
      setLoading(false);
    }, 500);
  };

  const copyUrl = (thumbUrl: string) => {
    navigator.clipboard.writeText(thumbUrl);
    setCopiedUrl(thumbUrl);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const thumbUrl = (name: string) =>
    `https://img.youtube.com/vi/${videoId}/${name}.jpg`;

  return (
    <ToolLayout
      title="Thumbnail Downloader"
      description="Download ultra-high-resolution YouTube thumbnails in every quality — from 4K MaxRes to preview size. Works with videos, Shorts, and Live streams."
      icon={ImageIcon}
      iconColor="#f9c6d0"
      seoContent={
        <div className="space-y-4">
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1c1b1c", marginBottom: "8px" }}>
            High-Fidelity Extraction
          </h3>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#5a5f68" }}>
            We pull directly from YouTube&apos;s CDN edge network, bypassing standard compression to deliver the original source files. Perfect for designers, content strategists, and metadata architects. Supports standard videos, YouTube Shorts (vertical), and Live Stream recordings.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { head: "Supported", items: ["YouTube Originals", "YouTube Shorts", "Live Streams"] },
              { head: "Quality Tiers", items: ["Native 4K (MaxRes)", "1080p HD", "640×480 SD"] },
            ].map((col) => (
              <div key={col.head} className="bg-[#f6f3f3] rounded-xl p-4">
                <p className="label-caps text-[#76777b] mb-3">{col.head}</p>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", color: "#5a5f68", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1c1b1c] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* URL Input */}
        <div className="prismatic-card p-2 flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-3 flex-grow px-4 py-1">
            <Link2 className="w-4 h-4 text-[#c6c6cb] flex-shrink-0" />
            <input
              id="thumbnail-url-input"
              type="url"
              placeholder="Paste YouTube video URL here…"
              className="w-full py-2.5 bg-transparent outline-none text-[#1c1b1c] placeholder-[#c6c6cb]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 500 }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
              aria-label="YouTube video URL"
            />
          </div>
          <motion.button
            id="thumbnail-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Download"}
          </motion.button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
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
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e5e2e2] p-4">
                  <div className="skeleton aspect-video w-full rounded-xl mb-3" />
                  <div className="skeleton h-4 w-2/3 mb-2" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {videoId && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {qualities.map((q, i) => {
                const tUrl = thumbUrl(q.name);
                const isCopied = copiedUrl === tUrl;
                return (
                  <motion.div
                    key={q.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 18 }}
                    className="prismatic-card overflow-hidden group"
                  >
                    {/* Image preview */}
                    <div className="relative aspect-video overflow-hidden bg-[#f0eded]">
                      <img
                        src={tUrl}
                        alt={`${q.label} thumbnail`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).closest(".aspect-video")!.classList.add("hidden");
                        }}
                      />
                      {/* Badge */}
                      <span className="absolute top-3 left-3 chip bg-[rgba(0,0,0,0.6)] text-white backdrop-blur-sm border border-white/10">
                        {q.badge}
                      </span>
                    </div>

                    {/* Info row */}
                    <div className="flex items-center justify-between p-4 gap-3">
                      <div>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1c1b1c" }}>{q.label}</p>
                        <p className="label-caps text-[#76777b] mt-0.5">{q.sublabel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={() => copyUrl(tUrl)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e5e2e2] bg-white hover:border-[#c6c6cb] transition-colors"
                          aria-label="Copy URL"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Copy className="w-4 h-4 text-[#5a5f68]" />}
                        </motion.button>
                        <motion.a
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.94 }}
                          href={tUrl}
                          download={`thumbnail-${q.name}.jpg`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary !py-2 !px-4 !text-[13px] !rounded-xl"
                          aria-label={`Download ${q.label}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Save
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
