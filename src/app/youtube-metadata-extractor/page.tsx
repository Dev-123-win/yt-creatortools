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
            <h3 className="text-3xl font-black mb-6 tracking-tighter">Unified SEO Research</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Analyzing both the title and description together provides a complete picture of a competitor&apos;s 
              SEO strategy. This tool helps you identify keyword placement patterns across both metadata layers.
            </p>
          </section>
        </div>
      }
    >
      <div className="flex flex-col gap-12">
        {/* Input Section */}
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
              <div className="bg-white p-8 md:p-12 rounded-[56px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                      <Type className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Video Title</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(data.title, "title")}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg"
                  >
                    {copiedTitle ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copiedTitle ? "Copied" : "Copy Title"}
                  </motion.button>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter">
                  {data.title}
                </h2>
              </div>

              {/* Description Result */}
              <div className="bg-white p-8 md:p-12 rounded-[56px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-2xl">
                      <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(data.description, "desc")}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg"
                  >
                    {copiedDesc ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copiedDesc ? "Copied" : "Copy Description"}
                  </motion.button>
                </div>
                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                  <pre className="whitespace-pre-wrap text-[15px] text-slate-600 font-medium leading-relaxed font-sans">
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
