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
  strip: {
    key: "96039399f3ec34f6457842cdbfdf7463",
    width: 320,
    height: 50,
    src: "https://www.highperformanceformat.com/96039399f3ec34f6457842cdbfdf7463/invoke.js",
  },
  rectangle: {
    key: "f0f4628b551349ecee0b9b1d5946708c",
    width: 300,
    height: 250,
    src: "https://www.highperformanceformat.com/f0f4628b551349ecee0b9b1d5946708c/invoke.js",
  },
};

/* ─── Module-level sequential queue ──────────────────────────────────────
 * Problem: multiple AdsterraBanner instances on the same page all write to
 * the GLOBAL window.atOptions before their async invoke.js fires. The last
 * write wins, so every ad ends up using the last component's config.
 *
 * Solution: serialize ad loading via a queue. Each ad's configScript +
 * invokeScript only runs after the PREVIOUS ad's invokeScript has fired
 * its onload (or times out). This guarantees atOptions is stable for each
 * invoke call with no race conditions.
 * ─────────────────────────────────────────────────────────────────────── */
type Task = () => void;
const queue: Task[] = [];
let busy = false;
const TIMEOUT_MS = 4000; // move on if invoke.js takes too long

function next() {
  if (busy || queue.length === 0) return;
  busy = true;
  queue.shift()!();
}

function done() {
  busy = false;
  next();
}

function enqueue(task: Task) {
  queue.push(task);
  next();
}

/* ─── Component ─────────────────────────────────────────────────────── */
interface AdsterraBannerProps {
  variant?: AdVariant;
  showLabel?: boolean;
  className?: string;
}

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

    enqueue(() => {
      let timer: ReturnType<typeof setTimeout>;

      // 1. Set global atOptions right before the invoke script — no other
      //    ad can overwrite it between these two synchronous statements
      //    because nothing else runs between them in the JS event loop.
      const configScript = document.createElement("script");
      configScript.type = "text/javascript";
      configScript.text = [
        "window.atOptions = {",
        `  'key'    : '${cfg.key}',`,
        `  'format' : 'iframe',`,
        `  'height' : ${cfg.height},`,
        `  'width'  : ${cfg.width},`,
        `  'params' : {}`,
        "};",
      ].join("\n");
      container.appendChild(configScript);

      // 2. Load invoke.js and release the queue when done
      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = cfg.src;

      const release = () => {
        clearTimeout(timer);
        done();
      };

      invokeScript.onload = release;
      invokeScript.onerror = release;          // don't stall queue on network error
      timer = setTimeout(release, TIMEOUT_MS); // safety fallback

      container.appendChild(invokeScript);
    });
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
