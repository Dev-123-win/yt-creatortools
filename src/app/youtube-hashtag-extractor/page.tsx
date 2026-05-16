"use client";

import { useState } from "react";
import { Hash, Copy, Check, AlertCircle, Loader2, Sparkles } from "lucide-react";
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
    if (!url) return;
    setLoading(true);
    setError(null);
    setHashtags([]);
    
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        const uniqueHashtags = Array.from(new Set(data.hashtags || []));
        setHashtags(uniqueHashtags as string[]);
        if (uniqueHashtags.length === 0) {
          setError("No hashtags found in the description of this video.");
        }
      }
    } catch (err) {
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
      description="Quickly scan and extract all trending hashtags from any YouTube video or Shorts."
      icon={Hash}
      seoContent={
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-black mb-6 tracking-tighter">Algorithm Discovery</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Hashtags act as high-level category markers for the YouTube algorithm. By extracting hashtags 
              from top-performing videos in your niche, you can ensure your content is indexed alongside 
              the right audience segments.
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
              placeholder="Paste Video or Shorts URL..."
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
            {loading ? "Please wait..." : "Get Hashtags"}
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
          {hashtags.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-10"
            >
              <div className="flex justify-between items-center px-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Extracted ({hashtags.length})</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={copyAll}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] transition-all text-xs font-black uppercase tracking-widest shadow-xl"
                >
                  {allCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {allCopied ? "Copied" : "Copy All"}
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-4">
                {hashtags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => copyHashtag(tag, index)}
                    className="bg-white px-8 py-5 rounded-[24px] border border-slate-100 hover:border-primary/30 cursor-pointer transition-all flex items-center gap-4 group shadow-sm hover:shadow-lg"
                  >
                    <span className="text-xl font-black text-primary group-hover:scale-125 transition-transform">#</span>
                    <span className="text-sm font-bold text-slate-700">{tag.replace("#", "")}</span>
                    <div className="text-slate-200 group-hover:text-primary ml-2">
                      {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
