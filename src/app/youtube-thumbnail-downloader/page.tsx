import { Metadata } from "next";
import ThumbnailDownloaderClient from "@/components/tools/ThumbnailDownloaderClient";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader — Download 4K Thumbnails Free | YTToolkit",
  description: "Download YouTube video thumbnails in 4K MaxRes, HD, SD, and MQ quality. Free, instant, no login required. Works with Shorts and Live streams.",
};

export default function ThumbnailDownloaderPage() {
  return <ThumbnailDownloaderClient />;
}
