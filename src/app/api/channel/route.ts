import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      }
    });
    const html = await response.text();
    
    let logoUrl = "";
    let bannerUrl = "";
    let channelName = "";

    const ytInitialDataMatch = html.match(/var ytInitialData = ({.*?});<\/script>/);
    if (ytInitialDataMatch) {
      try {
        const data = JSON.parse(ytInitialDataMatch[1]);
        
        // Deep search for branding assets
        const findBanner = (obj: any): string => {
          if (typeof obj !== 'object' || obj === null) return "";
          if (obj.banner && obj.banner.thumbnails) {
            return obj.banner.thumbnails[obj.banner.thumbnails.length - 1].url;
          }
          for (let key in obj) {
            const result = findBanner(obj[key]);
            if (result) return result;
          }
          return "";
        };

        const findAvatar = (obj: any): string => {
          if (typeof obj !== 'object' || obj === null) return "";
          if (obj.avatar && obj.avatar.thumbnails) {
            return obj.avatar.thumbnails[0].url;
          }
          if (obj.thumbnail && obj.thumbnail.thumbnails && obj.title) {
            // Likely a channel renderer in search or header
            return obj.thumbnail.thumbnails[0].url;
          }
          for (let key in obj) {
            const result = findAvatar(obj[key]);
            if (result) return result;
          }
          return "";
        };

        bannerUrl = findBanner(data);
        logoUrl = findAvatar(data);

        // Normalize logo for high resolution
        if (logoUrl) {
          logoUrl = logoUrl.replace(/=s\d+.*$/, "=s800-c-k-c0x00ffffff-no-rj");
        }

        // Channel Name
        const header = data.header?.c4TabbedHeaderRenderer || data.header?.pageHeaderRenderer;
        channelName = header?.title || "";
      } catch (e) {
        console.error("JSON parse error in channel extract", e);
      }
    }

    // Fallbacks
    if (!logoUrl) {
      const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/);
      logoUrl = ogImage ? ogImage[1] : "";
    }
    
    if (!channelName) {
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/);
      channelName = ogTitle ? ogTitle[1].replace(" - YouTube", "") : "Unknown Channel";
    }

    return NextResponse.json({ 
      logoUrl: logoUrl.startsWith("//") ? `https:${logoUrl}` : logoUrl, 
      bannerUrl: bannerUrl.startsWith("//") ? `https:${bannerUrl}` : bannerUrl, 
      channelName: channelName.trim() 
    });
  } catch (error) {
    console.error("Channel Extraction error:", error);
    return NextResponse.json({ error: "Failed to extract channel data. Ensure the channel is public." }, { status: 500 });
  }
}
