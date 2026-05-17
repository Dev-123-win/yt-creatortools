"use client";

import { useState } from "react";
import { Tag, Copy, Check, AlertCircle, Loader2, Sparkles } from "lucide-react";
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
    if (!url) return;
    setLoading(true);
    setError(null);
    setTags([]);
    
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
        setTags(data.tags || []);
        if (data.tags?.length === 0) {
          setError("No SEO tags found. This video might have tags hidden or it's a Shorts/Live stream without traditional keywords.");
        }
      }
    } catch (err) {
      setError("Extraction failed. Please verify the URL and your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyTag = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(index);
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
      description="Reveal the secret SEO keywords behind any viral YouTube video or Shorts."
      icon={Tag}
      seoContent={
        <div className="space-y-6">
          <section>
            <h3 className="font-display text-[32px] font-medium mb-sm text-ink tracking-tight">The Power of Video Tags</h3>
            <p className="text-body text-[20px] leading-[30px]">
              While tags are no longer the primary ranking factor, they provide critical context to the YouTube algorithm 
              about the topics and niches your video belongs to. Analyzing top-performing competitors allows you to 
              bridge the gap in your own SEO strategy.
            </p>
          </section>
        </div>
      }
    >
      <div className="flex flex-col gap-12">
        <div className="bg-canvas p-sm rounded-md border border-mute flex flex-col md:flex-row gap-3 shadow-sm">
          <div className="flex-grow flex items-center px-4 gap-4">
            <Sparkles className="w-5 h-5 text-primary opacity-30" />
            <input
              type="text"
              placeholder="Paste Video or Shorts URL here..."
              className="w-full py-4 outline-none text-ink font-medium text-[18px] bg-transparent placeholder-mute"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
            />
          </div>
          <button
            onClick={handleExtract}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Tags"}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-6 rounded-[24px] bg-red-50 border border-red-100 text-red-500 text-sm font-bold shadow-sm"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-8"
            >
              <div className="flex justify-between items-center px-4">
                <h3 className="font-display text-[24px] font-medium text-ink tracking-tight">Extracted Keywords ({tags.length})</h3>
                <button
                  onClick={copyAll}
                  className="btn-secondary flex items-center gap-2"
                >
                  {allCopied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  {allCopied ? "Copied All" : "Copy All Tags"}
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                {tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => copyTag(tag, index)}
                    className="bg-canvas px-lg py-sm rounded-md border border-mute/50 hover:border-primary/50 cursor-pointer transition-all flex items-center gap-4 group shadow-sm"
                  >
                    <span className="text-body-md font-medium text-ink group-hover:text-primary transition-colors">{tag}</span>
                    <div className="text-mute group-hover:text-primary transition-colors">
                      {copiedIndex === index ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
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
