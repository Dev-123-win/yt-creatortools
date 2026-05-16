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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased`}>
        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          {/* Global Background Effects */}
          <div className="fixed inset-0 z-[-1]">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
          </div>
          
        {/* Monetag Script Placeholders */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Monetag Integration
              (function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://the-domain.com/script.js',1234567,document.body||document.documentElement);
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
