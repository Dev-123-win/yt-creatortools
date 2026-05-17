import { NextResponse } from "next/server";

// Simple HTML entity decoder to clean names
function decodeHTMLEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Clean and validate URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });
    const html = await response.text();
    
    let logoUrl = "";
    let bannerUrl = "";
    let channelName = "";
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
        console.error("JSON parse error in channel extract", e);
      }
    }

    if (ytData) {
      // Deep search for branding assets
      const findBanner = (obj: any): string => {
        if (typeof obj !== 'object' || obj === null) return "";
        if (obj.banner && obj.banner.thumbnails) {
          return obj.banner.thumbnails[obj.banner.thumbnails.length - 1].url;
        }
        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const result = findBanner(obj[key]);
            if (result) return result;
          }
        }
        return "";
      };

      const findAvatar = (obj: any): string => {
        if (typeof obj !== 'object' || obj === null) return "";
        if (obj.avatar && obj.avatar.thumbnails) {
          return obj.avatar.thumbnails[obj.avatar.thumbnails.length - 1].url; // Get highest resolution thumbnail
        }
        if (obj.thumbnail && obj.thumbnail.thumbnails && Array.isArray(obj.thumbnail.thumbnails)) {
          return obj.thumbnail.thumbnails[obj.thumbnail.thumbnails.length - 1].url;
        }
        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const result = findAvatar(obj[key]);
            if (result) return result;
          }
        }
        return "";
      };

      bannerUrl = findBanner(ytData);
      logoUrl = findAvatar(ytData);

      // Extract Channel Name
      const header = ytData.header?.c4TabbedHeaderRenderer || ytData.header?.pageHeaderRenderer;
      channelName = header?.title || "";
    }

    // Fallbacks if JSON parsing missed them or failed
    if (!logoUrl) {
      const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i);
      logoUrl = ogImage ? ogImage[1] : "";
    }
    
    if (!channelName) {
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
      channelName = ogTitle ? ogTitle[1].replace(" - YouTube", "") : "Unknown Channel";
    }

    // Normalize logo for high resolution (800x800 avatar size)
    if (logoUrl) {
      logoUrl = logoUrl.startsWith("//") ? `https:${logoUrl}` : logoUrl;
      logoUrl = logoUrl.replace(/=s\d+.*$/, "=s800-c-k-c0x00ffffff-no-rj");
    }

    if (bannerUrl) {
      bannerUrl = bannerUrl.startsWith("//") ? `https:${bannerUrl}` : bannerUrl;
    }

    return NextResponse.json({ 
      logoUrl, 
      bannerUrl, 
      channelName: decodeHTMLEntities(channelName.trim()) 
    });
  } catch (error) {
    console.error("Channel Extraction error:", error);
    return NextResponse.json({ error: "Failed to extract channel data. Ensure the URL is public and valid." }, { status: 500 });
  }
}

