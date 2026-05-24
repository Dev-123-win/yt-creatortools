import { NextResponse } from "next/server";

const ALLOWED_DOMAINS = [
  "youtube.com",
  "img.youtube.com",
  "yt3.ggpht.com",
  "yt3.googleusercontent.com",
  "lh3.googleusercontent.com",
  "i.ytimg.com"
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const hostname = parsedUrl.hostname;
    const isAllowed = ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith("." + domain));

    if (!isAllowed) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 400 });
    }

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
    }

    const blob = await response.blob();
    const contentType = response.headers.get("Content-Type") || "image/jpeg";

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
