import { Metadata } from "next";
import ThumbnailDownloaderClient from "@/components/tools/ThumbnailDownloaderClient";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader | Download HD Thumbnails Free",
  description: "Get high-quality YouTube thumbnails (4K, HD, HQ) for free. Paste the video link and download instantly without registration.",
  keywords: ["youtube thumbnail downloader", "download youtube thumbnail", "get youtube thumbnail hq"],
  openGraph: {
    title: "YouTube Thumbnail Downloader | YTToolkit",
    description: "Download high-resolution YouTube thumbnails instantly.",
    type: "website",
  },
};

export default function Page() {
  return <ThumbnailDownloaderClient />;
}
