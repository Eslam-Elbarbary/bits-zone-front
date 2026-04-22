"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/api";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

interface FeaturedProductsCarouselProps {
  title: string;
  products: Product[];
  className?: string;
  queryHref?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function FeaturedProductsCarousel({
  title,
  products,
  className,
  queryHref,
  subtitle,
  eyebrow,
}: FeaturedProductsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByDir = useCallback((dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.82, 320);
    const sign = dir === "next" ? 1 : -1;
    // Horizontal strip uses RTL so the first product sits on the right; scroll deltas match RTL scrollLeft behavior.
    const rtl = getComputedStyle(el).direction === "rtl";
    const delta = rtl ? -sign * amount : sign * amount;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      className={cn(
        "relative overflow-hidden py-12 md:py-16",
        "bg-gradient-to-b from-sky-50/90 via-white to-primary/[0.04]",
        className
      )}
      aria-labelledby="featured-carousel-heading"
    >
      <div
        className="pointer-events-none absolute -start-24 top-1/4 size-72 rounded-full bg-primary/[0.09] blur-3xl animate-light-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-20 bottom-1/4 size-56 rounded-full bg-papaya/15 blur-3xl animate-light-pulse motion-reduce:animate-none [animation-delay:1.4s]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/25 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <div
          className="mb-8 flex flex-wrap items-end justify-between gap-4 opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none"
          style={{ animationDelay: "40ms" }}
        >
          <div className="min-w-0 flex-1">
            <SectionHeading
              titleId="featured-carousel-heading"
              title={title}
              subtitle={subtitle}
              eyebrow={eyebrow}
            />
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="size-10 rounded-full border-primary/20 bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white"
                aria-label="السابق"
                onClick={() => scrollByDir("prev")}
              >
                <ChevronRight className="size-5" aria-hidden />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="size-10 rounded-full border-primary/20 bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white"
                aria-label="التالي"
                onClick={() => scrollByDir("next")}
              >
                <ChevronLeft className="size-5" aria-hidden />
              </Button>
            </div>
            {queryHref ? (
              <Button
                size="sm"
                className={cn(
                  "gap-1 rounded-xl bg-primary px-5 text-primary-foreground shadow-md shadow-primary/20",
                  "transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]",
                  "motion-reduce:active:scale-100"
                )}
                asChild
              >
                <Link href={queryHref}>
                  عرض الكل
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 start-0 z-[2] w-10 bg-gradient-to-e from-sky-50/95 to-transparent md:w-14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 end-0 z-[2] w-10 bg-gradient-to-s from-transparent to-sky-50/95 md:w-14"
            aria-hidden
          />

          <div
            ref={scrollerRef}
            dir="rtl"
            className={cn(
              "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none]",
              "scroll-smooth motion-reduce:scroll-auto",
              "[&::-webkit-scrollbar]:hidden"
            )}
          >
            {products.map((p, index) => (
              <div
                key={`${p.id}-featured-${index}`}
                className={cn(
                  "w-[min(86vw,288px)] shrink-0 snap-center sm:w-[260px] md:w-[272px]",
                  "opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none",
                  "motion-safe:[animation-duration:0.65s]"
                )}
                style={{ animationDelay: `${100 + Math.min(index, 10) * 70}ms` }}
              >
                <div
                  className={cn(
                    "relative h-full rounded-[1.35rem] p-[1px]",
                    "bg-gradient-to-br from-primary/35 via-white/80 to-papaya/25",
                    "shadow-[0_12px_40px_-12px_rgba(14,116,188,0.25)]",
                    "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_20px_50px_-14px_rgba(14,116,188,0.35)]",
                    "motion-reduce:hover:translate-y-0"
                  )}
                >
                  <div className="h-full rounded-[1.3rem] bg-white/40 p-0.5 backdrop-blur-[2px]">
                    <ProductCard
                      product={p}
                      className={cn(
                        "border-white/60 bg-white/75 shadow-modern ring-primary/10",
                        "motion-safe:group-hover/card:ring-primary/25"
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
