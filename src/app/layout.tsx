import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "YTToolkit - Premium YouTube Creator Utilities",
  description: "The ultimate toolkit for YouTube creators. Extract tags, download thumbnails, extract descriptions, and more.",
  keywords: "youtube toolkit, thumbnail downloader, tags extractor, description extractor, youtube SEO tools",
  authors: [{ name: "YTToolkit Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: "index, follow",
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
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased`}>
        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          {/* Global Background Effects */}
          <div className="fixed inset-0 z-[-1]">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
          </div>
          
        {/* Monetag Onclick Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){s.dataset.zone='11013402',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
            `,
          }}
        />

        {/* Monetag Push Notifications */}
        <script src="https://5gvci.com/act/files/tag.min.js?z=11013403" data-cfasync="false" async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){s.dataset.zone='11013404',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
            `,
          }}
        />

        {/* Monetag Vignette Banner */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){s.dataset.zone='11013410',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
            `,
          }}
        />
        
        <Navbar />

          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
