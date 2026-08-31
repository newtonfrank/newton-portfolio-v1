"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { duration } from "@/lib/motion";

/**
 * Resolves when the page's hero-critical work has actually landed: the web
 * fonts (which the marquee must be measured against) and one caller-registered
 * asset.
 *
 * `duration.loader` is a ceiling, not a target. If either signal never arrives
 * — a decode that fails, an `onLoad` a cached image never fires — readiness is
 * declared anyway, so nothing downstream can strand.
 */
export function useSiteReady(): { ready: boolean; markAssetReady: () => void } {
  const [ready, setReady] = useState(false);
  const assetLanded = useRef(false);
  const fontsLanded = useRef(false);

  const settle = useCallback(() => {
    if (assetLanded.current && fontsLanded.current) setReady(true);
  }, []);

  const markAssetReady = useCallback(() => {
    assetLanded.current = true;
    settle();
  }, [settle]);

  useEffect(() => {
    let alive = true;

    void document.fonts.ready.then(() => {
      if (!alive) return;
      fontsLanded.current = true;
      settle();
    });

    const cap = window.setTimeout(() => {
      if (alive) setReady(true);
    }, duration.loader * 1000);

    return () => {
      alive = false;
      window.clearTimeout(cap);
    };
  }, [settle]);

  return { ready, markAssetReady };
}
