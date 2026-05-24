"use client";

import { useState } from "react";
import { Layout, Download, AlertCircle, Loader2, Link2, Clipboard, Copy, Check } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard } from "@/lib/utils";
import { Toast } from "@/components/Toast";

export default function BannerDownloader() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ bannerUrl: string; channelName: string } | null>(null);
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
    if (!data?.bannerUrl) return;
    const success = await copyToClipboard(data.bannerUrl);
    if (success) {
      setCopied(true);
      setToastMessage("Banner URL copied to clipboard!");
      setToastShow(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!data?.bannerUrl) return;
    try {
      setDownloading(true);
      const proxyUrl = `/api/download?url=${encodeURIComponent(data.bannerUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Failed to download image");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${data.channelName}-banner.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(data.bannerUrl, "_blank");
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
        <div className="prismatic-card p-2 flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-3 flex-grow w-full px-4 py-1">
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
            id="banner-extract-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={handleExtract}
            disabled={loading || !url.trim()}
            className="btn-primary ripple-btn !rounded-xl !px-7 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
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
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={handleCopy}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#e5e2e2] bg-white hover:border-[#c6c6cb] transition-colors"
                      aria-label="Copy Banner URL"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#4ade80]" /> : <Copy className="w-4 h-4 text-[#5a5f68]" />}
                    </motion.button>
                    <motion.button
                       whileHover={{ scale: 1.04 }}
                       whileTap={{ scale: 0.96 }}
                       onClick={handleDownload}
                       disabled={downloading}
                       className="btn-primary !py-2.5 !px-5 !rounded-xl shadow-sm flex items-center gap-2"
                    >
                      {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {downloading ? "Saving..." : "Download Art"}
                    </motion.button>
                  </div>
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
      <Toast message={toastMessage} show={toastShow} onClose={() => setToastShow(false)} />
    </ToolLayout>
  );
}
