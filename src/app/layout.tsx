import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "YTToolkit — Premium YouTube Creator Utilities",
  description: "The ultimate toolkit for YouTube creators. Extract tags, download thumbnails, extract descriptions, and more — all free, no login required.",
  keywords: "youtube toolkit, thumbnail downloader, tags extractor, description extractor, youtube SEO tools, youtube banner downloader, youtube logo downloader",
  authors: [{ name: "YTToolkit Team" }],
  robots: "index, follow",
  verification: {
    google: "gVdiFJkdGqbyGme9JvjVNlUMX1_dA1EQjK0dvAvSZ2M",
  },
  other: {
    monetag: "d90841c41c4c0008f269c7502e69dda6",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#fcf8f9] text-[#1c1b1c] antialiased">
        {/* Iridescent background blobs */}
        <div className="iris-bg" aria-hidden="true">
          <div className="iris-blob iris-blob-1" />
          <div className="iris-blob iris-blob-2" />
          <div className="iris-blob iris-blob-3" />
        </div>

        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </div>

        {/* Monetag Ads - only in production */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script src="https://5gvci.com/act/files/tag.min.js?z=11013403" data-cfasync="false" async></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(s){s.dataset.zone='11013404',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(s){s.dataset.zone='11013410',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
