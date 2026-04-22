"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo-pets-zone.svg";

type Flake = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
  kind: "dot" | "logo";
};

function isSnowTrigger(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "button, input[type='submit'], input[type='button'], input[type='reset'], [data-slot='button']"
    )
  );
}

export function SnowOverlay() {
  const [flakes, setFlakes] = useState<Flake[]>([]);
  const idRef = useRef(0);
  const pathname = usePathname();
  const lastBurstRef = useRef(0);

  const burst = useCallback((kind: "route" | "interaction") => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = kind === "route" ? 64 : 36;
    const created: Flake[] = [];
    const base = idRef.current;
    for (let i = 0; i < count; i++) {
      const isLogo = Math.random() < 0.11;
      created.push({
        id: base + i,
        x: Math.random() * 100,
        delay: Math.random() * 0.45,
        duration: 4.2 + Math.random() * 3.2,
        size: isLogo ? 18 + Math.random() * 10 : 2.5 + Math.random() * 5.5,
        drift: -48 + Math.random() * 96,
        opacity: isLogo ? 0.22 + Math.random() * 0.2 : 0.45 + Math.random() * 0.48,
        kind: isLogo ? "logo" : "dot",
      });
    }
    idRef.current += count;
    setFlakes((prev) => [...prev, ...created]);

    window.setTimeout(() => {
      setFlakes((prev) => prev.filter((f) => !created.some((c) => c.id === f.id)));
    }, 10_000);
  }, []);

  useEffect(() => {
    burst("route");
  }, [pathname, burst]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!isSnowTrigger(e.target)) return;
      const now = Date.now();
      if (now - lastBurstRef.current < 220) return;
      lastBurstRef.current = now;
      burst("interaction");
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [burst]);

  if (flakes.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[35] overflow-hidden",
        "[mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]"
      )}
      aria-hidden
    >
      {flakes.map((f) =>
        f.kind === "logo" ? (
          <span
            key={f.id}
            className="snowflake-logo absolute -top-8"
            style={
              {
                left: `${f.x}%`,
                width: f.size,
                height: "auto",
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
                "--snow-drift": `${f.drift}px`,
                opacity: f.opacity,
              } as CSSProperties & { "--snow-drift": string }
            }
          >
            <Image
              src={LOGO_SRC}
              alt=""
              width={48}
              height={12}
              unoptimized
              className="h-auto w-full object-contain opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            />
          </span>
        ) : (
          <span
            key={f.id}
            className="snowflake-dot absolute -top-6"
            style={
              {
                left: `${f.x}%`,
                width: f.size,
                height: f.size,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
                "--snow-drift": `${f.drift}px`,
                opacity: f.opacity,
              } as CSSProperties & { "--snow-drift": string }
            }
          />
        )
      )}
    </div>
  );
}
