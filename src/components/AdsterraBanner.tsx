"use client";

import { useEffect, useRef } from "react";

type AdVariant = "strip" | "rectangle";

interface AdConfig {
  key: string;
  width: number;
  height: number;
  src: string;
}

const AD_CONFIGS: Record<AdVariant, AdConfig> = {
  /** 320×50 — horizontal strip banner */
  strip: {
    key: "96039399f3ec34f6457842cdbfdf7463",
    width: 320,
    height: 50,
    src: "https://www.highperformanceformat.com/96039399f3ec34f6457842cdbfdf7463/invoke.js",
  },
  /** 300×250 — medium rectangle (highest IAB CTR format) */
  rectangle: {
    key: "f0f4628b551349ecee0b9b1d5946708c",
    width: 300,
    height: 250,
    src: "https://www.highperformanceformat.com/f0f4628b551349ecee0b9b1d5946708c/invoke.js",
  },
};

interface AdsterraBannerProps {
  variant?: AdVariant;
  showLabel?: boolean;
  className?: string;
}

/**
 * Client-only Adsterra ad component.
 *
 * Why useEffect + imperative injection:
 *   Adsterra's invoke.js adds a className to the <script> tag after it loads.
 *   That mutates the DOM in a way SSR cannot predict → hydration mismatch.
 *   By never touching the DOM during SSR we side-step this entirely.
 *
 * Why IIFE for atOptions:
 *   atOptions is a global variable. If two AdsterraBanner instances load on the
 *   same page and both write atOptions before their invoke.js fires, the second
 *   write clobbers the first — the first ad then uses the wrong config.
 *   Wrapping the config + invoke call in an IIFE gives each ad its own closure
 *   so they can never race against each other.
 */
export function AdsterraBanner({
  variant = "strip",
  showLabel = true,
  className = "",
}: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const cfg = AD_CONFIGS[variant];

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;

    const container = containerRef.current;

    // Wrap config + invoke inside a self-executing function so two ads on the
    // same page each get their own atOptions and never clobber each other.
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.text = `
      (function() {
        var atOptions = {
          'key'    : '${cfg.key}',
          'format' : 'iframe',
          'height' : ${cfg.height},
          'width'  : ${cfg.width},
          'params' : {}
        };
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '${cfg.src}';
        // Append to THIS container so Adsterra renders inside it
        var c = document.currentScript
          ? document.currentScript.parentNode
          : document.body;
        c.appendChild(s);
      })();
    `;
    container.appendChild(configScript);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {showLabel && (
        <span
          className="text-[#c6c6cb]"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Sponsored
        </span>
      )}
      <div
        ref={containerRef}
        suppressHydrationWarning
        className="overflow-hidden rounded-xl opacity-80 hover:opacity-100 transition-opacity"
        style={{ minWidth: cfg.width, minHeight: cfg.height }}
      />
    </div>
  );
}
