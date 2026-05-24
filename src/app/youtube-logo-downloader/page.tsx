"use client";

import { useState } from "react";
import { UserCircle, Download, AlertCircle, Loader2, Link2, Clipboard, Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard } from "@/lib/utils";
import { Toast } from "@/components/Toast";

export default function LogoDownloader() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ logoUrl: string; channelName: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleCopy = async () => {
    if (!data?.logoUrl) return;
    const success = await copyToClipboard(data.logoUrl);
    if (success) {
      setCopied(true);
      setToastMessage("Logo URL copied to clipboard!");
      setToastShow(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!data?.logoUrl) return;
    try {
      setDownloading(true);
      const proxyUrl = `/api/download?url=${encodeURIComponent(data.logoUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Failed to download image");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${data.channelName}-logo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(data.logoUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const isValidUrl = url ? (url.toLowerCase().includes("youtube.com") || url.toLowerCase().includes("youtu.be")) : null;

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
        <div className="prismatic-card p-2 flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-3 flex-grow w-full px-4 py-1">
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
            id="logo-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
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
                 
                 <div className="flex items-center gap-2 w-full mt-4">
                   <motion.button
                     whileTap={{ scale: 0.88 }}
                     onClick={handleCopy}
                     className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#e5e2e2] bg-white hover:border-[#c6c6cb] transition-colors flex-shrink-0"
                     aria-label="Copy Logo URL"
                   >
                     {copied ? <Check className="w-5 h-5 text-[#4ade80]" /> : <Copy className="w-5 h-5 text-[#5a5f68]" />}
                   </motion.button>
                   <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleDownload}
                      disabled={downloading}
                      className="btn-primary flex-grow !py-3 !rounded-xl flex items-center justify-center gap-2"
                   >
                     {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                     {downloading ? "Saving..." : "Download Full Size"}
                   </motion.button>
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
