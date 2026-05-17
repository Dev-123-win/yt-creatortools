"use client";

import { useState } from "react";
import { Image as ImageIcon, Download, Copy, Check, AlertCircle, Sparkles, ChevronDown } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { extractYouTubeId, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ThumbnailDownloaderClient() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExtract = () => {
    setError(null);
    setLoading(true);
    
    // Simulate high-end processing delay for UX perception
    setTimeout(() => {
      const id = extractYouTubeId(url);
      if (id) {
        setVideoId(id);
      } else {
        setError("Invalid URL structure. Please provide a valid Video, Shorts, or Live link.");
        setVideoId(null);
      }
      setLoading(false);
    }, 600);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const thumbnailQualities = videoId ? [
    { label: "Ultra HD (Native 4K)", name: "maxresdefault", url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
    { label: "High Definition (1080p)", name: "hqdefault", url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
    { label: "Standard (SD)", name: "sddefault", url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
    { label: "Preview (MQ)", name: "mqdefault", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
  ] : [];

  return (
    <ToolLayout
      title="Asset Downloader"
      description="Download ultra-high resolution thumbnails and Shorts assets with zero compression."
      icon={ImageIcon}
      seoContent={
        <div className="space-y-12">
          <section>
            <h3 className="font-display text-[32px] font-medium mb-sm text-ink tracking-tight">High-Fidelity Extraction</h3>
            <p className="text-body text-[20px] leading-[30px]">
              We pull directly from the YouTube edge network, bypassing standard compression to deliver the 
              original source files provided by the creator. Perfect for designers and metadata architects.
            </p>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-xl bg-canvas border border-mute/30 rounded-md">
              <h4 className="text-on-primary mb-md eyebrow-uppercase">Supported Formats</h4>
              <ul className="space-y-sm text-[16px] leading-[24px] text-mute">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> YouTube Originals</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> YouTube Shorts (Vertical)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Live Stream VODs</li>
              </ul>
            </div>
            <div className="p-xl bg-canvas border border-mute/30 rounded-md">
              <h4 className="text-on-primary mb-md eyebrow-uppercase">Quality Layers</h4>
              <ul className="space-y-sm text-[16px] leading-[24px] text-mute">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> 3840x2160 (Native)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> 1920x1080 (HQ)</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> 1280x720 (Standard)</li>
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-16">
        {/* Input Engine */}
        <div className="bg-canvas p-sm rounded-md border border-mute flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="flex-grow flex items-center px-4 gap-6">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <input
              type="text"
              placeholder="Paste Video or Shorts URL here..."
              className="w-full py-4 outline-none text-ink font-medium text-[18px] bg-transparent placeholder-mute"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExtract}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Please wait..." : "Download Now"}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-4 p-8 rounded-[32px] bg-red-50 border border-red-100 text-red-500 text-sm font-black shadow-sm"
            >
              <AlertCircle className="w-6 h-6" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Skeleton Loader */}
        <AnimatePresence>
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-canvas-soft p-xl rounded-md border border-mute/30 shadow-sm animate-pulse">
                  <div className="aspect-video w-full rounded-md bg-canvas mb-lg" />
                  <div className="h-6 w-1/2 bg-canvas rounded-full mb-4" />
                  <div className="h-4 w-1/4 bg-canvas rounded-full" />
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Results Engine */}
        <AnimatePresence>
          {videoId && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
              {thumbnailQualities.map((quality, index) => (
                <motion.div
                  key={quality.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="bg-canvas-soft p-xl rounded-md border border-mute/50 shadow-sm group hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative aspect-video rounded-md overflow-hidden mb-xl border border-mute/30 group-hover:shadow-md transition-all duration-300">
                    <img 
                      src={quality.url} 
                      alt={quality.label}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-300" />
                  </div>
                  
                  <div className="flex justify-between items-center px-4">
                    <div>
                      <h4 className="font-display text-[24px] font-medium text-ink mb-2 tracking-tight">{quality.label}</h4>
                      <p className="eyebrow-uppercase text-mute">{quality.name}.jpg</p>
                    </div>
                    <div className="flex gap-4">
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => copyToClipboard(quality.url)}
                        className="p-sm bg-canvas text-body rounded-md border border-mute/50 hover:text-primary transition-all shadow-sm"
                      >
                        {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        href={quality.url}
                        download={`thumbnail-${quality.name}.jpg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary !p-sm flex items-center justify-center"
                      >
                        <Download className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
