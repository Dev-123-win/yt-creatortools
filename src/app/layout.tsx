import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600", "700"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "YTToolkit - Premium YouTube Creator Utilities",
  description: "The ultimate toolkit for YouTube creators. Extract tags, download thumbnails, extract descriptions, and more.",
  keywords: "youtube toolkit, thumbnail downloader, tags extractor, description extractor, youtube SEO tools",
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
      <body className={`${inter.variable} font-sans bg-canvas text-ink antialiased`}>
        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          {/* Global Background Effects */}
          <div className="fixed inset-0 z-[-1]">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
          </div>
          

        
        <Navbar />

          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* Monetag Ads - Rendered at the bottom of the body, only in production */}
        {process.env.NODE_ENV === 'production' && (
          <>
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
          </>
        )}
      </body>
    </html>
  );
}
