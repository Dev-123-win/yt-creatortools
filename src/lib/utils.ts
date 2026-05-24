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

/**
 * Copies text to the clipboard. Supports modern navigator.clipboard and fallback to textarea for non-secure environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  
  // 1. Try modern API first
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn("Navigator clipboard write failed, trying fallback...", e);
    }
  }

  // 2. Fallback to textarea
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Prevent scrolling or zooming
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
    return false;
  }
}

