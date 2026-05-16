"use client";

import { useState } from "react";
import { UserCircle, Download, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoDownloader() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{ logoUrl: string; channelName: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await fetch("/api/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else if (!result.logoUrl) {
        setError("Could not find a logo for this channel.");
      } else {
        setData({
          logoUrl: result.logoUrl,
          channelName: result.channelName
        });
      }
    } catch (err) {
      setError("An error occurred during extraction. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Logo Downloader"
      description="Fetch and download original high-resolution profile pictures from any YouTube channel."
      icon={UserCircle}
      seoContent={
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-black mb-6 tracking-tighter">Avatar Extraction</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Our extractor pulls the original source profile picture in its maximum size (800x800 or 900x900), 
              ensuring you get the cleanest version of a channel&apos;s avatar without compression.
            </p>
          </section>
        </div>
      }
    >
      <div className="flex flex-col gap-16">
        {/* Input Engine */}
        <div className="bg-white p-3 rounded-[40px] border border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-3">
          <div className="flex-grow flex items-center px-8 gap-4">
            <Sparkles className="w-5 h-5 text-primary opacity-30" />
            <input
              type="text"
              placeholder="Paste Channel URL or Video URL..."
              className="w-full py-4 outline-none text-slate-900 font-black text-lg placeholder:text-slate-200 bg-transparent"
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
            className="bg-primary text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Get Logo"}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[32px] bg-red-50 border border-red-100 text-red-500 text-sm font-black flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Engine */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto w-full"
            >
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] text-center">
                <div className="relative w-48 h-48 mx-auto mb-10 group">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <img 
                    src={data.logoUrl} 
                    alt={data.channelName}
                    className="w-full h-full rounded-full object-cover border-8 border-slate-50 relative z-10 shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{data.channelName}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-12">Original High-Res Avatar</p>
                
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={data.logoUrl} 
                  download={`${data.channelName}-logo.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-4 bg-slate-900 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl"
                >
                  <Download className="w-5 h-5" />
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
