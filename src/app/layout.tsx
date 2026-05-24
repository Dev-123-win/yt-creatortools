import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Load Google Fonts using next/font/google
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fcf8f9",
};

export const metadata: Metadata = {
  title: "YTToolkit — Premium YouTube Creator Utilities",
  description:
    "The ultimate free toolkit for YouTube creators. Download thumbnails in 4K, extract tags, metadata, channel banners, logos, and hashtags — instantly, no login required.",
  keywords:
    "youtube toolkit, thumbnail downloader, tags extractor, description extractor, youtube SEO tools, youtube banner downloader, youtube logo downloader, youtube hashtag extractor",
  authors: [{ name: "YTToolkit Team" }],
  robots: "index, follow",
  openGraph: {
    title: "YTToolkit — Premium YouTube Creator Utilities",
    description:
      "Six precision-built tools for extracting thumbnails, tags, metadata, banners, logos, and hashtags — instantly, for free.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YTToolkit — Premium YouTube Creator Utilities",
    description: "Six free, instant tools for YouTube creators.",
  },
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
    <html lang="en" data-scroll-behavior="smooth" className={`${newsreader.variable} ${plusJakartaSans.variable}`}>
      <head />
      <body className="bg-[#fcf8f9] text-[#1c1b1c] antialiased">
        {/* Iridescent background blobs */}
        <div className="iris-bg" aria-hidden="true">
          <div className="iris-blob iris-blob-1" />
          <div className="iris-blob iris-blob-2" />
          <div className="iris-blob iris-blob-3" />
          <div className="iris-blob iris-blob-4" />
        </div>

        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </div>

        {/* Monetag Ads — production only */}
        {process.env.NODE_ENV === "production" && (
          <>
            <script
              src="https://5gvci.com/act/files/tag.min.js?z=11013403"
              data-cfasync="false"
              async
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(s){s.dataset.zone='11013404',s.src='https://nap5k.com/tag.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(s){s.dataset.zone='11013410',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
