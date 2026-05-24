import { NextResponse } from "next/server";

// ── Rate Limiting ────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, timestamp: now };
  if (now - entry.timestamp > 60_000) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  rateLimitMap.set(ip, { count: entry.count + 1, timestamp: entry.timestamp });
  return true;
}

// ── HTML Entity Decoder ──────────────────────────────────────
function decodeHTMLEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// ── Fetch headers that bypass consent pages ──────────────────
const YT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+219; VISITOR_INFO1_LIVE=; YSC=;",
  Referer: "https://www.google.com/",
};

// ── Deep JSON searcher ───────────────────────────────────────
function deepFind<T>(
  obj: unknown,
  predicate: (obj: Record<string, unknown>) => T | null
): T | null {
  if (typeof obj !== "object" || obj === null) return null;
  const result = predicate(obj as Record<string, unknown>);
  if (result !== null) return result;
  for (const val of Object.values(obj as Record<string, unknown>)) {
    const found = deepFind(val, predicate);
    if (found !== null) return found;
  }
  return null;
}

function findBanner(obj: unknown): string {
  return (
    deepFind<string>(obj, (o) => {
      if (o.banner && typeof o.banner === "object") {
        const b = o.banner as Record<string, unknown>;
        if (b.thumbnails && Array.isArray(b.thumbnails) && b.thumbnails.length > 0) {
          const last = b.thumbnails[b.thumbnails.length - 1] as Record<string, unknown>;
          return (last.url as string) || null;
        }
      }
      return null;
    }) || ""
  );
}

function findAvatar(obj: unknown): string {
  return (
    deepFind<string>(obj, (o) => {
      if (o.avatar && typeof o.avatar === "object") {
        const a = o.avatar as Record<string, unknown>;
        if (a.thumbnails && Array.isArray(a.thumbnails) && a.thumbnails.length > 0) {
          const last = a.thumbnails[a.thumbnails.length - 1] as Record<string, unknown>;
          return (last.url as string) || null;
        }
      }
      return null;
    }) || ""
  );
}

function findChannelName(obj: unknown): string {
  return (
    deepFind<string>(obj, (o) => {
      if (o.channelMetadataRenderer) {
        const c = o.channelMetadataRenderer as Record<string, unknown>;
        if (typeof c.title === "string" && c.title) return c.title;
      }
      if (o.c4TabbedHeaderRenderer) {
        const c = o.c4TabbedHeaderRenderer as Record<string, unknown>;
        if (typeof c.title === "string" && c.title) return c.title;
      }
      if (o.pageHeaderRenderer) {
        const c = o.pageHeaderRenderer as Record<string, unknown>;
        if (typeof c.pageTitle === "string" && c.pageTitle) return c.pageTitle;
      }
      return null;
    }) || ""
  );
}

// ── Route Handler ─────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    const response = await fetch(targetUrl, { headers: YT_HEADERS });
    const html = await response.text();

    let logoUrl = "";
    let bannerUrl = "";
    let channelName = "";
    let ytData: unknown = null;

    // Detect consent redirect
    if (html.includes("consent.youtube.com") || html.includes("consent.google.com")) {
      return NextResponse.json(
        { error: "YouTube is requiring consent verification. Please try again in a moment." },
        { status: 503 }
      );
    }

    // Parse ytInitialData
    const ytDataMatch =
      html.match(/ytInitialData\s*=\s*({[\s\S]+?});\s*<\/script>/) ||
      html.match(/ytInitialData\s*=\s*({[\s\S]+?});\s*window/) ||
      html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);

    if (ytDataMatch) {
      try {
        let braceCount = 0;
        let endIndex = 0;
        const src = ytDataMatch[1];
        for (let i = 0; i < src.length; i++) {
          if (src[i] === "{") braceCount++;
          else if (src[i] === "}") {
            braceCount--;
            if (braceCount === 0) { endIndex = i + 1; break; }
          }
        }
        ytData = JSON.parse(endIndex > 0 ? src.slice(0, endIndex) : src);
      } catch (e) {
        console.error("JSON parse error in channel extract", e);
      }
    }

    if (ytData) {
      bannerUrl = findBanner(ytData);
      logoUrl = findAvatar(ytData);
      channelName = findChannelName(ytData);
    }

    // Fallbacks
    if (!logoUrl) {
      const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i);
      logoUrl = ogImage ? ogImage[1] : "";
    }

    if (!channelName) {
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
      const metaTitle = html.match(/<title>([^<]+)<\/title>/i);
      channelName = ogTitle
        ? ogTitle[1].replace(" - YouTube", "")
        : metaTitle
        ? metaTitle[1].replace(" - YouTube", "")
        : "Unknown Channel";
    }

    // Normalize avatar to high-res
    if (logoUrl) {
      logoUrl = logoUrl.startsWith("//") ? `https:${logoUrl}` : logoUrl;
      logoUrl = logoUrl.replace(/=s\d+.*$/, "=s800-c-k-c0x00ffffff-no-rj");
    }

    if (bannerUrl) {
      bannerUrl = bannerUrl.startsWith("//") ? `https:${bannerUrl}` : bannerUrl;
    }

    const cacheHeaders = {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    };

    return NextResponse.json(
      { logoUrl, bannerUrl, channelName: decodeHTMLEntities(channelName.trim()) },
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error("Channel Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract channel data. Ensure the URL is public and valid." },
      { status: 500 }
    );
  }
}
