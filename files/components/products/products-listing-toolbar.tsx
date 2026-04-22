"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky toolbar under the site header. Measures the real <header> height so `sticky` stays
 * aligned on all breakpoints (mobile nav row, resizes, safe areas).
 */
export function ProductsListingToolbar({ children }: { children: ReactNode }) {
  const [topPx, setTopPx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => {
      const bottom = header.getBoundingClientRect().bottom;
      if (Number.isFinite(bottom) && bottom > 0) setTopPx(bottom);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={cn(
        " z-[38] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        "-mx-1 rounded-2xl border border-sky-200/60 bg-white/95 p-3.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] sm:p-4",
        "ring-1 ring-sky-100/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/88",
        topPx == null &&
          "top-[calc(6.75rem+env(safe-area-inset-top,0px))] md:top-[calc(4.5rem+env(safe-area-inset-top,0px))]"
      )}
      style={topPx != null ? { top: topPx } : undefined}
    >
      {children}
    </div>
  );
}
