"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { Grid3x3, Layers, Package, Sparkles, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/api";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const ICONS = [Grid3x3, Package, Tag, Layers, Sparkles, Package, Grid3x3, Tag] as const;

const THEMES = [
  {
    mesh: "from-sky-300/35 via-cyan-200/25 to-blue-100/50",
    border: "border-sky-200/60",
    iconBox: "bg-sky-500/15 text-sky-700 ring-sky-400/25",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(14,165,233,0.35)]",
    ringHover: "hover:ring-sky-400/35",
    animal: "🐰",
    float: "animate-animal-float-a",
    floatDelay: "[animation-delay:0s]",
  },
  {
    mesh: "from-amber-200/40 via-orange-100/35 to-papaya/25",
    border: "border-amber-200/55",
    iconBox: "bg-amber-500/15 text-amber-800 ring-amber-400/30",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(251,191,36,0.32)]",
    ringHover: "hover:ring-amber-400/40",
    animal: "🐻",
    float: "animate-animal-float-b",
    floatDelay: "[animation-delay:0.35s]",
  },
  {
    mesh: "from-violet-200/35 via-fuchsia-100/30 to-pink-50/45",
    border: "border-violet-200/50",
    iconBox: "bg-violet-500/15 text-violet-800 ring-violet-400/25",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(167,139,250,0.35)]",
    ringHover: "hover:ring-violet-400/35",
    animal: "🦊",
    float: "animate-animal-waddle",
    floatDelay: "[animation-delay:0.2s]",
  },
  {
    mesh: "from-emerald-200/35 via-teal-100/30 to-cyan-50/50",
    border: "border-emerald-200/55",
    iconBox: "bg-emerald-500/15 text-emerald-800 ring-emerald-400/25",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(52,211,153,0.32)]",
    ringHover: "hover:ring-emerald-400/40",
    animal: "🐼",
    float: "animate-animal-float-c",
    floatDelay: "[animation-delay:0.5s]",
  },
  {
    mesh: "from-rose-200/35 via-pink-100/35 to-red-50/40",
    border: "border-rose-200/50",
    iconBox: "bg-rose-500/15 text-rose-800 ring-rose-400/25",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(244,114,182,0.32)]",
    ringHover: "hover:ring-rose-400/35",
    animal: "🦁",
    float: "animate-animal-float-a",
    floatDelay: "[animation-delay:0.6s]",
  },
  {
    mesh: "from-indigo-200/35 via-blue-100/30 to-sky-50/45",
    border: "border-indigo-200/50",
    iconBox: "bg-indigo-500/15 text-indigo-800 ring-indigo-400/25",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(99,102,241,0.3)]",
    ringHover: "hover:ring-indigo-400/35",
    animal: "🐧",
    float: "animate-animal-float-b",
    floatDelay: "[animation-delay:0.15s]",
  },
  {
    mesh: "from-lime-200/30 via-green-100/25 to-emerald-50/45",
    border: "border-lime-200/50",
    iconBox: "bg-lime-600/15 text-lime-900 ring-lime-500/25",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(132,204,22,0.28)]",
    ringHover: "hover:ring-lime-400/35",
    animal: "🦆",
    float: "animate-animal-float-c",
    floatDelay: "[animation-delay:0.45s]",
  },
  {
    mesh: "from-fuchsia-200/35 via-purple-100/30 to-violet-50/40",
    border: "border-fuchsia-200/50",
    iconBox: "bg-fuchsia-500/15 text-fuchsia-900 ring-fuchsia-400/25",
    glow: "hover:shadow-[0_24px_56px_-16px_rgba(217,70,239,0.3)]",
    ringHover: "hover:ring-fuchsia-400/35",
    animal: "🐨",
    float: "animate-animal-waddle",
    floatDelay: "[animation-delay:0.25s]",
  },
] as const;

function categoryTitle(cat: Category): string {
  if (typeof cat.name_ar === "string" && cat.name_ar.trim()) return cat.name_ar;
  return String(cat.name ?? "");
}

function subCategoryName(sub: Category): string {
  return categoryTitle(sub);
}

interface CategoryBrowseCardProps {
  cat: Category;
  index: number;
}

export function CategoryBrowseCard({ cat, index }: CategoryBrowseCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[index % THEMES.length]!;
  const Icon = ICONS[index % ICONS.length];
  const title = categoryTitle(cat);
  const children = Array.isArray(cat.children) ? cat.children : [];
  const subs = children.slice(0, 6);
  const count = typeof cat.products_count === "number" ? cat.products_count : undefined;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--glow-x", `${x}%`);
    el.style.setProperty("--glow-y", `${y}%`);
  }, []);

  const onLeave = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--glow-x", "50%");
    el.style.setProperty("--glow-y", "40%");
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none",
        "[--glow-x:50%] [--glow-y:40%]"
      )}
      style={{ animationDelay: `${80 + Math.min(index, 7) * 55}ms` }}
    >
      <Card
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn(
          "group/cat-card relative h-full gap-0 overflow-hidden rounded-3xl border bg-white/40 py-0 shadow-modern ring-1 ring-black/[0.04]",
          "backdrop-blur-2xl backdrop-saturate-150",
          "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-1.5 hover:bg-white/55",
          theme.border,
          theme.glow,
          theme.ringHover,
          "hover:ring-2 motion-reduce:hover:translate-y-0",
          "motion-reduce:transition-none"
        )}
      >
        {/* Animated color mesh — each card different */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-[40%] bg-gradient-to-br opacity-90 motion-safe:animate-category-mesh-drift motion-reduce:animate-none",
            theme.mesh
          )}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-white/35 to-transparent"
          aria-hidden
        />

        {/* Proximity glass spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover/cat-card:opacity-100 motion-reduce:opacity-0"
          style={{
            background:
              "radial-gradient(420px circle at var(--glow-x) var(--glow-y), rgba(255,255,255,0.55), rgba(255,255,255,0.08) 38%, transparent 55%)",
          }}
          aria-hidden
        />

        {/* Shimmer rail on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-0 transition-opacity duration-500 group-hover/cat-card:opacity-100 motion-reduce:hidden"
          aria-hidden
        >
          <div className="absolute inset-0 w-[200%] -translate-x-full bg-[linear-gradient(105deg,transparent_42%,rgba(255,255,255,0.55)_50%,transparent_58%)] transition-transform duration-700 group-hover/cat-card:translate-x-full motion-reduce:transition-none" />
        </div>

        {/* Large animal watermark */}
        <span
          className={cn(
            "pointer-events-none absolute -bottom-6 -end-4 z-0 select-none text-[5.5rem] leading-none opacity-[0.12] drop-shadow-sm sm:text-[6.5rem]",
            "motion-safe:will-change-transform",
            theme.float,
            theme.floatDelay
          )}
          aria-hidden
        >
          {theme.animal}
        </span>
        <span
          className={cn(
            "pointer-events-none absolute -top-2 start-2 z-0 text-4xl opacity-[0.08] motion-safe:animate-animal-float-b motion-reduce:animate-none sm:text-5xl",
            "[animation-delay:1s]"
          )}
          aria-hidden
        >
          {theme.animal}
        </span>

        <CardContent className="relative z-[2] p-5 sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl ring-2 ring-white/60 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover/cat-card:scale-110 group-hover/cat-card:shadow-md motion-reduce:group-hover/cat-card:scale-100",
                theme.iconBox
              )}
            >
              <Icon className="size-5 sm:size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-balance font-bold leading-snug text-zinc-900">{title}</h3>
              {count !== undefined ? (
                <p className="mt-1 text-xs font-medium text-zinc-500">{count} منتج تقريباً</p>
              ) : null}
            </div>
          </div>
          <ul className="space-y-0 border-t border-zinc-200/60 pt-3 backdrop-blur-[2px]">
            {subs.length > 0 ? (
              subs.map((sub) => {
                const subCount =
                  typeof sub.products_count === "number" ? sub.products_count : undefined;
                return (
                  <li key={`${cat.id}-sub-${sub.id}`}>
                    <Link
                      href={`${ROUTES.products}?category_id=${sub.id}`}
                      className="flex items-center justify-between gap-2 rounded-xl py-2.5 ps-1 text-sm text-zinc-700 transition-all duration-200 hover:bg-white/70 hover:ps-2 hover:text-primary hover:shadow-sm"
                    >
                      <span className="truncate">{subCategoryName(sub)}</span>
                      {subCount !== undefined ? (
                        <span className="shrink-0 text-xs tabular-nums text-zinc-400">({subCount})</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })
            ) : (
              <li>
                <Link
                  href={`${ROUTES.products}?category_id=${cat.id}`}
                  className="block rounded-xl py-2.5 text-sm font-semibold text-primary transition-colors hover:underline"
                >
                  تصفّح كل منتجات {title}
                </Link>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
