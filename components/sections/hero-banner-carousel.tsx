"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Slider } from "@/types/api";
import { ROUTES } from "@/constants";
import { resolveImageSrc } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6200;

type NormalizedSlide = {
  key: string;
  imageSrc: string | null;
  title: string;
  description: string;
  href: string;
  placeholderEmoji: string;
};

const FALLBACK_DESCRIPTION =
  "منتجات مختارة بعناية لراحة الأم والطفل — جودة موثوقة، أسعار واضحة، وتوصيل حتى باب منزلك.";

const FALLBACK_SLIDES: NormalizedSlide[] = [
  {
    key: "fb-1",
    imageSrc: null,
    title: "عناية كاملة لطفلك في مكان واحد",
    description: "تغذية، حفاضات، ملابس وألعاب آمنة — مع توصيل سريع ودعم يهتم بتفاصيلك.",
    href: ROUTES.products,
    placeholderEmoji: "👶",
  },
  {
    key: "fb-2",
    imageSrc: null,
    title: "عروض الشتاء الدافئة",
    description: "مستلزمات موسمية وقطع مختارة بأسعار مريحة — تسوّق بثقة من بيتك.",
    href: `${ROUTES.products}?sort=latest`,
    placeholderEmoji: "🧸",
  },
  {
    key: "fb-3",
    imageSrc: null,
    title: "جودة تليق بصغارك",
    description: FALLBACK_DESCRIPTION,
    href: `${ROUTES.products}?featured=1`,
    placeholderEmoji: "⭐",
  },
];

function normalizeSliders(sliders: Slider[]): NormalizedSlide[] {
  if (!sliders.length) return FALLBACK_SLIDES;

  const mapped = sliders.map((s, index) => {
    const raw = s.image != null ? resolveImageSrc(s.image) : null;
    const imageSrc = raw && raw !== "/ui/placeholder-product.svg" ? raw : null;
    return {
      key: `s-${s.id}-${index}`,
      imageSrc,
      title: s.title?.trim() || FALLBACK_SLIDES[index % FALLBACK_SLIDES.length]!.title,
      description: FALLBACK_DESCRIPTION,
      href: s.link?.trim() || ROUTES.products,
      placeholderEmoji: FALLBACK_SLIDES[index % FALLBACK_SLIDES.length]!.placeholderEmoji,
    };
  });

  return mapped.length > 0 ? mapped : FALLBACK_SLIDES;
}

const HERO_SNOW = Array.from({ length: 56 }, (_, i) => ({
  id: i,
  left: ((i * 47) % 100) + (i % 5) * 0.15,
  delay: ((i * 0.11) % 2.4) + (i % 8) * 0.04,
  duration: 3.6 + (i % 7) * 0.42,
  size: 2 + (i % 5) * 1.05,
  drift: -40 + (i % 14) * 6,
}));

const FLOATING_ANIMALS = [
  {
    emoji: "🐰",
    className:
      "bottom-[9%] start-[4%] text-[2rem] sm:text-4xl md:text-5xl animate-animal-float-a drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] [animation-delay:0.15s]",
  },
  {
    emoji: "🐻",
    className:
      "bottom-[14%] end-[6%] text-[1.85rem] sm:text-4xl md:text-[2.75rem] animate-animal-float-b drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)] [animation-delay:0.45s]",
  },
  {
    emoji: "🦊",
    className:
      "top-[26%] start-[8%] text-[1.65rem] sm:text-3xl md:text-4xl animate-animal-waddle opacity-95 drop-shadow-md [animation-delay:0.1s]",
  },
  {
    emoji: "🐧",
    className:
      "top-[20%] end-[10%] text-[1.5rem] sm:text-3xl md:text-4xl animate-animal-float-c opacity-90 drop-shadow-md [animation-delay:0.6s]",
  },
  {
    emoji: "🦁",
    className:
      "bottom-[7%] start-[38%] text-[1.5rem] sm:text-3xl opacity-85 animate-animal-float-b drop-shadow-sm [animation-delay:0.3s] max-md:hidden",
  },
  {
    emoji: "🐼",
    className:
      "bottom-[20%] start-[48%] text-[1.4rem] sm:text-3xl animate-animal-float-a opacity-80 [animation-delay:0.9s] md:start-[52%]",
  },
] as const;

function HeroBannerSnow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[18] overflow-hidden" aria-hidden>
      {HERO_SNOW.map((f) => (
        <span
          key={f.id}
          className="hero-banner-snowflake absolute -top-4"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              animationIterationCount: "infinite",
              "--hero-snow-drift": `${f.drift}px`,
            } as CSSProperties & { "--hero-snow-drift": string }
          }
        />
      ))}
    </div>
  );
}

function HeroBannerAnimals() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[19] overflow-hidden motion-reduce:hidden"
      aria-hidden
    >
      {FLOATING_ANIMALS.map((a, i) => (
        <span
          key={i}
          className={cn("absolute select-none motion-safe:will-change-transform", a.className)}
          role="presentation"
        >
          {a.emoji}
        </span>
      ))}
    </div>
  );
}

export function HeroBannerCarousel({ sliders }: { sliders: Slider[] }) {
  const slides = useMemo(() => normalizeSliders(sliders), [sliders]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const n = slides.length;
  const safeIndex = ((active % n) + n) % n;

  useEffect(() => {
    if (n <= 1 || paused) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % n);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [n, paused]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => {
        const next = i + dir;
        if (next < 0) return n - 1;
        if (next >= n) return 0;
        return next;
      });
    },
    [n]
  );

  return (
    <div
      className={cn(
        "group/hero-banner relative overflow-hidden rounded-3xl shadow-xl shadow-sky-900/10 ring-1 ring-sky-200/60",
        "transition-[box-shadow,transform] duration-500 ease-out",
        "hover:shadow-2xl hover:shadow-primary/15 hover:ring-primary/25",
        "bg-gradient-to-br from-sky-50 via-white to-primary/[0.06]"
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_20%,oklch(0.58_0.12_245/0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-20 top-1/4 size-64 rounded-full bg-papaya/20 blur-3xl animate-light-pulse motion-reduce:animate-none"
        aria-hidden
      />

      <div className="relative z-[1] grid min-h-[300px] md:grid-cols-2 md:min-h-[320px] lg:min-h-[340px]">
        {/* Visual column — stacked crossfade */}
        <div className="relative min-h-[220px] w-full overflow-hidden bg-gradient-to-br from-sky-100/90 via-primary/10 to-papaya/25 md:min-h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.key}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                index === safeIndex ? "z-[2] opacity-100" : "z-[1] opacity-0"
              )}
              aria-hidden={index !== safeIndex}
            >
              {slide.imageSrc ? (
                <Image
                  src={slide.imageSrc}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-200/40 via-white/60 to-papaya/30">
                  <span
                    className="text-7xl drop-shadow-md motion-safe:animate-animal-float-c sm:text-8xl"
                    aria-hidden
                  >
                    {slide.placeholderEmoji}
                  </span>
                  <span className="rounded-full bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary/80 ring-1 ring-primary/15 backdrop-blur-sm">
                    خطوات صغيرة
                  </span>
                </div>
              )}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent md:from-black/20"
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* Copy column — stacked crossfade */}
        <div className="relative min-h-[240px] overflow-hidden bg-gradient-to-br from-primary via-primary/92 to-sky-600 text-primary-foreground md:min-h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.key}
              className={cn(
                "absolute inset-0 flex flex-col justify-center gap-4 px-6 py-8 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-10 md:py-10 lg:py-12",
                index === safeIndex ? "z-[2] opacity-100" : "pointer-events-none z-[1] opacity-0"
              )}
              aria-hidden={index !== safeIndex}
            >
              <div
                className="pointer-events-none absolute -start-12 top-1/2 size-48 -translate-y-1/2 rounded-full bg-white/15 blur-3xl animate-light-pulse motion-reduce:animate-none"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-8 end-0 size-36 rounded-full bg-papaya/30 blur-2xl animate-light-pulse motion-reduce:animate-none [animation-delay:1.8s]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden opacity-35 motion-reduce:hidden"
                aria-hidden
              >
                <div className="absolute inset-0 w-[200%] -translate-x-1/4 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.2)_50%,transparent_60%)] animate-shimmer-sweep" />
              </div>
              {index === safeIndex ? (
                <h1 className="relative text-balance text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                  {slide.title}
                </h1>
              ) : (
                <h2 className="relative text-balance text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                  {slide.title}
                </h2>
              )}
              <p className="relative max-w-md text-sm leading-relaxed text-primary-foreground/90 md:text-base">
                {slide.description}
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="relative w-fit rounded-xl px-8 font-bold text-primary shadow-lg shadow-black/10"
              >
                <Link href={slide.href}>تسوق الآن</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <HeroBannerSnow />
      <HeroBannerAnimals />

      {n > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[32] flex justify-center gap-2 md:bottom-4">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "pointer-events-auto h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                  i === safeIndex
                    ? "w-8 bg-white shadow-md shadow-black/20 ring-2 ring-white/50"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                )}
                aria-label={`شريحة ${i + 1}`}
                aria-current={i === safeIndex}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute end-2 top-1/2 z-[32] flex size-10 -translate-y-1/2 rounded-full border border-white/35 bg-white/92 text-primary shadow-lg backdrop-blur-sm hover:bg-white sm:end-3 sm:size-11"
            onClick={() => go(1)}
            aria-label="الشريحة التالية"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute start-2 top-1/2 z-[32] flex size-10 -translate-y-1/2 rounded-full border border-white/35 bg-white/92 text-primary shadow-lg backdrop-blur-sm hover:bg-white sm:start-3 sm:size-11"
            onClick={() => go(-1)}
            aria-label="الشريحة السابقة"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </Button>
        </>
      ) : null}
    </div>
  );
}
