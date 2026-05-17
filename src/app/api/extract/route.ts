import { NextResponse } from "next/server";

// Simple HTML entity decoder to clean titles and descriptions
function decodeHTMLEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"');
}

// Extractor function for YouTube Video ID supporting all video/shorts/live/embed/mobile formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  url = url.trim();
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(\/shorts\/)|(live\/))\??v?=?([^#&?]*).*/i;
  const match = url.match(regExp);
  
  if (url.includes("/shorts/")) {
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
    if (shortsMatch) return shortsMatch[1];
  }
  
  if (url.includes("/live/")) {
    const liveMatch = url.match(/\/live\/([a-zA-Z0-9_-]{11})/i);
    if (liveMatch) return liveMatch[1];
  }
  
  const id = (match && (match[7]?.length === 11 || match[8]?.length === 11)) 
    ? (match[7]?.length === 11 ? match[7] : match[8]) 
    : null;
    
  if (id) return id;
  
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v && v.length === 11) return v;
    }
  } catch (e) {}
  
  return null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL format. Please paste a standard Video, Shorts, or Live stream link." }, { status: 400 });
    }

    // oEmbed is highly reliable, fast, and does not get blocked by consent pages.
    // Fetch title and author info from oEmbed.
    let title = "";
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const oEmbedResponse = await fetch(oEmbedUrl);
      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        title = oEmbedData.title || "";
      }
    } catch (e) {
      console.error("oEmbed fetch failed:", e);
    }

    // Now fetch the main page to parse tags and full description
    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(canonicalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });
    const html = await response.text();
    
    // Fallback title if oEmbed failed
    if (!title) {
      const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i) ||
                           html.match(/<meta name="title" content="([^"]+)"/i);
      const standardTitleMatch = html.match(/<title>([^<]+)<\/title>/i);
      title = ogTitleMatch ? ogTitleMatch[1] : (standardTitleMatch ? standardTitleMatch[1].replace(" - YouTube", "") : "Unknown Title");
    }
    title = decodeHTMLEntities(title).trim();

    // Extract tags from keywords meta tag
    const keywordsMatch = html.match(/<meta name="keywords" content="([^"]+)"/i) ||
                          html.match(/<meta property="og:video:tag" content="([^"]+)"/i);
    let tags: string[] = keywordsMatch ? keywordsMatch[1].split(",").map(t => decodeHTMLEntities(t.trim())) : [];

    // Parse description from ytInitialData
    let description = "";
    let ytData: any = null;

    // Robust multi-line search for ytInitialData JSON shell
    const ytDataMatch = html.match(/ytInitialData\s*=\s*({[\s\S]+?});/) || 
                        html.match(/ytInitialData\s*=\s*({[\s\S]+?})<\/script>/) ||
                        html.match(/window\[['"]ytInitialData['"]\]\s*=\s*({[\s\S]+?});/);
                        
    if (ytDataMatch) {
      try {
        const jsonText = ytDataMatch[1];
        // Count braces to prevent matching trailing page scripts
        let braceCount = 0;
        let endIndex = 0;
        for (let i = 0; i < jsonText.length; i++) {
          if (jsonText[i] === '{') braceCount++;
          else if (jsonText[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i + 1;
              break;
            }
          }
        }
        if (endIndex > 0) {
          ytData = JSON.parse(jsonText.substring(0, endIndex));
        } else {
          ytData = JSON.parse(jsonText);
        }
      } catch (e) {
        console.error("JSON parse error on ytInitialData", e);
      }
    }

    if (ytData) {
      // 1. Recursive search for full description in JSON
      const findDescription = (obj: any): string => {
        if (typeof obj !== 'object' || obj === null) return "";
        
        if (obj.attributedDescription && typeof obj.attributedDescription.content === 'string') {
          return obj.attributedDescription.content;
        }
        
        if (obj.description && Array.isArray(obj.description.runs)) {
          return obj.description.runs.map((run: any) => run.text || "").join("");
        }
        
        if (obj.simpleText && typeof obj.simpleText === 'string') {
          return obj.simpleText;
        }
        
        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const result = findDescription(obj[key]);
            if (result) return result;
          }
        }
        return "";
      };

      description = findDescription(ytData);

      // 2. Recursive search for tags in JSON as fallback/addition
      const findTags = (obj: any): string[] => {
        if (typeof obj !== 'object' || obj === null) return [];
        
        if (obj.tags && Array.isArray(obj.tags)) {
          return obj.tags
            .map((t: any) => {
              if (typeof t === 'string') return t;
              if (t.simpleText) return t.simpleText;
              if (t.text) return t.text;
              return "";
            })
            .filter(Boolean);
        }
        
        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const result = findTags(obj[key]);
            if (result.length > 0) return result;
          }
        }
        return [];
      };

      const parsedTags = findTags(ytData);
      if (parsedTags.length > 0) {
        tags = Array.from(new Set([...tags, ...parsedTags]));
      }
    }

    // Metadata description fallback
    if (!description) {
      const descMatch = html.match(/<meta name="description" content="([^"]+)"/i) ||
                        html.match(/<meta property="og:description" content="([^"]+)"/i);
      description = descMatch ? descMatch[1] : "";
    }
    
    description = decodeHTMLEntities(description).trim();

    // Clean tags list
    tags = tags
      .map(tag => tag.replace(/[#]/g, "").trim())
      .filter(tag => tag.length > 0);

    // Extract hashtags cleanly using unicode selector to support international tags
    const hashtagRegex = /#[a-zA-Z0-9_\p{L}\p{N}]+/gu;
    const hashtags = description.match(hashtagRegex) || [];
    const uniqueHashtags = Array.from(new Set(hashtags.map(tag => tag.trim()))).filter(Boolean);

    return NextResponse.json({ 
      tags: Array.from(new Set(tags)), 
      title, 
      description, 
      hashtags: uniqueHashtags
    });

  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to extract video data. Make sure the URL is public and valid." }, { status: 500 });
  }
}

