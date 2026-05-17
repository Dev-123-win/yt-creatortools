import Link from "next/link";
import { Play as YoutubeIcon, Globe, Send, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink border-t border-ink-soft pt-3xl pb-xl px-xl mt-32">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-sm">
              <div className="bg-primary p-2.5 rounded-md">
                <YoutubeIcon className="w-5 h-5 text-on-primary" fill="currentColor" />
              </div>
              <span className="font-display font-medium text-[24px] tracking-tight text-on-primary">
                YT<span className="text-primary">Toolkit</span>
              </span>
            </Link>
            <p className="text-mute text-[16px] leading-[24px] mb-sm">
              The elite utility suite for YouTube creators. Designed for high-performance extraction and viral channel growth.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-sm bg-ink-soft rounded-md text-mute hover:text-primary transition-colors">
                <Send className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-sm bg-ink-soft rounded-md text-mute hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-sm bg-ink-soft rounded-md text-mute hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-on-primary mb-lg eyebrow-uppercase">Extraction</h4>
            <ul className="space-y-sm text-[16px] leading-[24px] text-mute">
              <li><Link href="/youtube-tags-extractor" className="hover:text-primary transition-colors">Tags Extractor</Link></li>
              <li><Link href="/youtube-metadata-extractor" className="hover:text-primary transition-colors">Metadata Extractor</Link></li>
              <li><Link href="/youtube-hashtag-extractor" className="hover:text-primary transition-colors">Hashtag Extractor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-on-primary mb-lg eyebrow-uppercase">Visuals</h4>
            <ul className="space-y-sm text-[16px] leading-[24px] text-mute">
              <li><Link href="/youtube-thumbnail-downloader" className="hover:text-primary transition-colors">Thumbnail Downloader</Link></li>
              <li><Link href="/youtube-banner-downloader" className="hover:text-primary transition-colors">Banner Downloader</Link></li>
              <li><Link href="/youtube-logo-downloader" className="hover:text-primary transition-colors">Logo Downloader</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-on-primary mb-lg eyebrow-uppercase">Company</h4>
            <ul className="space-y-sm text-[16px] leading-[24px] text-mute">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">About YTToolkit</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Support Center</Link></li>
              <li><a href="https://omg10.com/4/11013399" target="_blank" rel="sponsored noopener noreferrer" className="text-primary hover:underline font-medium">Featured Resource</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-md border-t border-ink-soft flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-mute text-[14px]">
            © {new Date().getFullYear()} YTToolkit. Professional YouTube Utility Suite.
          </p>
          <div className="flex gap-8 text-mute eyebrow-uppercase">
            <span>Fast Load</span>
            <span>Mobile First</span>
            <span>SEO Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
