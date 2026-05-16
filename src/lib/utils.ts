import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(\/shorts\/))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  // For shorts/ID, the ID is in match[8] often, let's refine
  if (url.includes("/shorts/")) {
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    return shortsMatch ? shortsMatch[1] : null;
  }
  
  return (match && (match[7]?.length === 11 || match[8]?.length === 11)) 
    ? (match[7]?.length === 11 ? match[7] : match[8]) 
    : null;
}


export function extractChannelId(url: string): string | null {
  // Support for @handle, channel/ID, c/ID, user/ID
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel\/|c\/|user\/|@)([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}
