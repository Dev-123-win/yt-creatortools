import Link from "next/link";
import { Play as YoutubeIcon } from "lucide-react";
import { AdsterraBanner } from "@/components/AdsterraBanner";

const tools = [
  { name: "Thumbnail Downloader", href: "/youtube-thumbnail-downloader" },
  { name: "Tags Extractor", href: "/youtube-tags-extractor" },
  { name: "Metadata Extractor", href: "/youtube-metadata-extractor" },
  { name: "Banner Downloader", href: "/youtube-banner-downloader" },
  { name: "Logo Downloader", href: "/youtube-logo-downloader" },
  { name: "Hashtag Extractor", href: "/youtube-hashtag-extractor" },
];

export function Footer() {
  return (
    <footer
      className="mt-32 border-t border-[#e5e2e2]"
      style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden border border-[#e5e2e2] shadow-sm">
                <img src="/logo.png" alt="YTToolkit Logo" className="w-full h-full object-cover" />
              </div>
              <span
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "17px", letterSpacing: "-0.01em" }}
                className="text-[#1c1b1c]"
              >
                YT<span className="text-[#5a5f68]">Toolkit</span>
              </span>
            </Link>
            <p
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", lineHeight: 1.7 }}
              className="text-[#76777b] max-w-[260px]"
            >
              Free, fast, and private YouTube creator utilities. No login, no tracking — ever.
            </p>
            <div className="mt-5 flex gap-2">
              <span className="chip bg-[#f0eded] text-[#45474b]">✓ Free Forever</span>
              <span className="chip bg-[#f0eded] text-[#45474b]">✓ No Login</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="label-caps text-[#76777b] mb-5">Tools</p>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px" }}
                    className="text-[#5a5f68] hover:text-[#1c1b1c] transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="label-caps text-[#76777b] mb-5">Info</p>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "About YTToolkit", href: "#" },
                { name: "Support Center", href: "#" },
                { name: "Featured Resource", href: "https://omg10.com/4/11013399", external: true },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "sponsored noopener noreferrer" : undefined}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px" }}
                    className={item.external ? "text-[#1c1b1c] font-semibold hover:underline" : "text-[#5a5f68] hover:text-[#1c1b1c] transition-colors"}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Adsterra Sponsored Ad */}
        <div className="py-6 flex flex-col items-center gap-2 border-t border-[#e5e2e2]">
          <AdsterraBanner showLabel />
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#e5e2e2] flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px" }}
            className="text-[#c6c6cb]"
          >
            © {new Date().getFullYear()} YTToolkit. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Fast", "Mobile First", "SEO Pro"].map((badge) => (
              <span key={badge} className="label-caps text-[#c6c6cb]">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
