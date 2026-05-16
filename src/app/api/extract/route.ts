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
        "Accept-Language": "en-US,en;q=0.9",
      }
    });
    const html = await response.text();
    
    // Extract tags from meta
    const keywordsMatch = html.match(/<meta name="keywords" content="([^"]+)"/);
    const tags = keywordsMatch ? keywordsMatch[1].split(",").map(t => t.trim()) : [];

    // Extract title (handle both standard and og:title fallbacks)
    let title = "";
    const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const standardTitleMatch = html.match(/<title>([^<]+)<\/title>/);
    title = ogTitleMatch ? ogTitleMatch[1] : (standardTitleMatch ? standardTitleMatch[1].replace(" - YouTube", "") : "Unknown Title");
    title = title.trim();

    // Extract Description from ytInitialData
    let description = "";
    let hashtags: string[] = [];
    
    const ytInitialDataMatch = html.match(/var ytInitialData = ({.*?});<\/script>/);
    if (ytInitialDataMatch) {
      try {
        const data = JSON.parse(ytInitialDataMatch[1]);
        
        // Search through JSON for any description content (robust search)
        const findDescription = (obj: any): string => {
          if (typeof obj !== 'object' || obj === null) return "";
          if (obj.attributedDescription) return obj.attributedDescription.content || "";
          if (obj.simpleText) return obj.simpleText;
          
          for (let key in obj) {
            const result = findDescription(obj[key]);
            if (result) return result;
          }
          return "";
        };

        description = findDescription(data);
        
        // Extract hashtags from description
        const hashtagRegex = /#[a-zA-Z0-9_]+/g;
        hashtags = description.match(hashtagRegex) || [];
      } catch (e) {
        console.error("JSON parse error", e);
      }
    }

    // Final Fallback if description is still empty
    if (!description) {
      const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
      description = descMatch ? descMatch[1] : "";
    }
    
    return NextResponse.json({ 
      tags: Array.from(new Set(tags)), 
      title, 
      description: description.trim(), 
      hashtags: Array.from(new Set(hashtags)) 
    });

  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to extract data. Make sure the URL is correct and public." }, { status: 500 });
  }
}
