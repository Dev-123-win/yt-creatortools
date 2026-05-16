import Link from "next/link";
import { Play as YoutubeIcon, Globe, Send, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-24 pb-12 px-4 mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-red-100">
                <YoutubeIcon className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900">
                YT<span className="text-primary">Toolkit</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              The elite utility suite for YouTube creators. Designed for high-performance extraction and viral channel growth.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                <Send className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                <Globe className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Extraction</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-semibold">
              <li><Link href="/youtube-tags-extractor" className="hover:text-primary transition-colors">Tags Extractor</Link></li>
              <li><Link href="/youtube-metadata-extractor" className="hover:text-primary transition-colors">Metadata Extractor</Link></li>
              <li><Link href="/youtube-hashtag-extractor" className="hover:text-primary transition-colors">Hashtag Extractor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Visuals</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-semibold">
              <li><Link href="/youtube-thumbnail-downloader" className="hover:text-primary transition-colors">Thumbnail Downloader</Link></li>
              <li><Link href="/youtube-banner-downloader" className="hover:text-primary transition-colors">Banner Downloader</Link></li>
              <li><Link href="/youtube-logo-downloader" className="hover:text-primary transition-colors">Logo Downloader</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-semibold">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">About YTToolkit</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Support Center</Link></li>
              <li><a href="https://omg10.com/4/11013399" target="_blank" rel="sponsored noopener noreferrer" className="text-primary hover:underline font-black">Featured Resource</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} YTToolkit. Professional YouTube Utility Suite.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Fast Load</span>
            <span>Mobile First</span>
            <span>SEO Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
