"use client";

import { useState } from "react";
import { FileText, Copy, Check, AlertCircle, Loader2, Sparkles, Type } from "lucide-react";
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
    if (!url) return;
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData({
          title: result.title || "No title found.",
          description: result.description || "No description found."
        });
      }
    } catch (err) {
      setError("An error occurred during extraction. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "title" | "desc") => {
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
      description="Extract both the Video Title and Full Description in one click. Works with Shorts and Live streams."
      icon={FileText}
      seoContent={
        <div className="space-y-8">
          <section>
            <h3 className="font-display text-[32px] font-medium mb-sm text-ink tracking-tight">Unified SEO Research</h3>
            <p className="text-body text-[20px] leading-[30px]">
              Analyzing both the title and description together provides a complete picture of a competitor&apos;s 
              SEO strategy. This tool helps you identify keyword placement patterns across both metadata layers.
            </p>
          </section>
        </div>
      }
    >
      <div className="flex flex-col gap-12">
        {/* Input Section */}
        <div className="bg-canvas p-sm rounded-md border border-mute flex flex-col md:flex-row gap-3 shadow-sm">
          <div className="flex-grow flex items-center px-4 gap-4">
            <Sparkles className="w-5 h-5 text-primary opacity-30" />
            <input
              type="text"
              placeholder="Paste Video or Shorts URL..."
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
            {loading ? "Please wait..." : "Get Metadata"}
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

        {/* Results Section */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-10"
            >
              {/* Title Result */}
              <div className="bg-canvas-soft p-xl rounded-md border border-mute/50 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-sm bg-canvas border border-mute/30 rounded-md">
                      <Type className="w-5 h-5 text-primary" />
                    </div>
                    <span className="eyebrow-uppercase text-mute">Video Title</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(data.title, "title")}
                    className="btn-secondary flex items-center gap-2"
                  >
                    {copiedTitle ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    {copiedTitle ? "Copied" : "Copy Title"}
                  </motion.button>
                </div>
                <h2 className="font-display text-[32px] font-medium text-ink leading-tight">
                  {data.title}
                </h2>
              </div>

              {/* Description Result */}
              <div className="bg-canvas-soft p-xl rounded-md border border-mute/50 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-sm bg-canvas border border-mute/30 rounded-md">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <span className="eyebrow-uppercase text-mute">Description</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(data.description, "desc")}
                    className="btn-secondary flex items-center gap-2"
                  >
                    {copiedDesc ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    {copiedDesc ? "Copied" : "Copy Description"}
                  </motion.button>
                </div>
                <div className="bg-canvas p-xl rounded-md border border-mute/30 max-h-[500px] overflow-y-auto custom-scrollbar">
                  <pre className="whitespace-pre-wrap text-body-md text-body font-sans">
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
