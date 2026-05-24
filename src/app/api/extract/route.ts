import { NextResponse } from "next/server";

// ── Rate Limiting ────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 30; // requests per minute per IP

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
    .replace(/&gt;/g, ">")
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"');
}

// ── YouTube Video ID Extractor ───────────────────────────────
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  url = url.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  if (url.includes("/shorts/")) {
    const m = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
    if (m) return m[1];
  }
  if (url.includes("/live/")) {
    const m = url.match(/\/live\/([a-zA-Z0-9_-]{11})/i);
    if (m) return m[1];
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v && v.length === 11) return v;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1).split("?")[0];
      if (id.length === 11) return id;
    }
  } catch {}

  const regExp =
    /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(\/shorts\/)|(live\/))\??v?=?([^#&?]*).*/i;
  const match = url.match(regExp);
  const id =
    match &&
    (match[7]?.length === 11 || match[8]?.length === 11 || match[9]?.length === 11)
      ? match[7]?.length === 11
        ? match[7]
        : match[8]?.length === 11
        ? match[8]
        : match[9]
      : null;
  return id || null;
}

// ── Fetch headers that bypass consent pages ──────────────────
const YT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+219; VISITOR_INFO1_LIVE=; YSC=;",
  Referer: "https://www.google.com/",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
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

function findDescription(obj: unknown): string {
  return (
    deepFind<string>(obj, (o) => {
      if (o.attributedDescription && typeof (o.attributedDescription as Record<string,unknown>).content === "string")
        return (o.attributedDescription as Record<string,unknown>).content as string;
      if (o.description && Array.isArray((o.description as Record<string,unknown>).runs))
        return ((o.description as Record<string,unknown>).runs as Array<{text?:string}>).map((r) => r.text || "").join("");
      return null;
    }) || ""
  );
}

function findTags(obj: unknown): string[] {
  return (
    deepFind<string[]>(obj, (o) => {
      if (o.tags && Array.isArray(o.tags) && (o.tags as unknown[]).length > 0) {
        return (o.tags as unknown[])
          .map((t) => {
            if (typeof t === "string") return t;
            const to = t as Record<string,unknown>;
            return (to.simpleText as string) || (to.text as string) || "";
          })
          .filter(Boolean);
      }
      return null;
    }) || []
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

    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        {
          error:
            "Invalid YouTube URL format. Please paste a standard Video, Shorts, or Live stream link.",
        },
        { status: 400 }
      );
    }

    // 1. oEmbed for reliable title
    let title = "";
    try {
      const oEmbedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (oEmbedRes.ok) {
        const d = await oEmbedRes.json();
        title = d.title || "";
      }
    } catch {}

    // 2. Fetch main page
    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(canonicalUrl, { headers: YT_HEADERS });
    const html = await response.text();

    // Detect consent redirect
    if (
      html.includes("consent.youtube.com") ||
      html.includes("consent.google.com")
    ) {
      // Try noembed as fallback
      try {
        const noembedRes = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
        );
        if (noembedRes.ok) {
          const d = await noembedRes.json();
          title = title || d.title || "";
        }
      } catch {}
    }

    // 3. Title fallback
    if (!title) {
      const ogTitle =
        html.match(/<meta property="og:title" content="([^"]+)"/i) ||
        html.match(/<meta name="title" content="([^"]+)"/i);
      const stdTitle = html.match(/<title>([^<]+)<\/title>/i);
      title = ogTitle
        ? ogTitle[1]
        : stdTitle
        ? stdTitle[1].replace(" - YouTube", "")
        : "Unknown Title";
    }
    title = decodeHTMLEntities(title).trim();

    // 4. Parse ytInitialData
    let tags: string[] = [];
    let description = "";
    let ytData: unknown = null;

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
      } catch {}
    }

    if (ytData) {
      description = findDescription(ytData);
      const parsedTags = findTags(ytData);
      if (parsedTags.length > 0) tags = parsedTags;
    }

    // 5. Keywords meta fallback for tags
    if (tags.length === 0) {
      const kwMatch = html.match(/<meta name="keywords" content="([^"]+)"/i);
      if (kwMatch) tags = kwMatch[1].split(",").map((t) => decodeHTMLEntities(t.trim()));
    }

    // 6. Description meta fallback
    if (!description) {
      const descMatch =
        html.match(/<meta name="description" content="([^"]+)"/i) ||
        html.match(/<meta property="og:description" content="([^"]+)"/i);
      description = descMatch ? descMatch[1] : "";
    }
    description = decodeHTMLEntities(description).trim();

    // 7. Clean tags
    tags = Array.from(
      new Set(
        tags
          .map((t) => t.replace(/^#/, "").trim())
          .filter((t) => t.length > 0)
      )
    );

    // 8. Extract hashtags from description
    const hashtagRegex = /#[\w\p{L}\p{N}_]+/gu;
    const hashtags = Array.from(
      new Set((description.match(hashtagRegex) || []).map((t) => t.trim()))
    ).filter(Boolean);

    const cacheHeaders = {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    };

    return NextResponse.json(
      { tags, title, description, hashtags },
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract video data. Make sure the URL is public and valid." },
      { status: 500 }
    );
  }
}
