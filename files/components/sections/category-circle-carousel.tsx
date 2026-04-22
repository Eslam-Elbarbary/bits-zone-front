"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { imageSrcIsRemote } from "@/lib/product-utils";

export interface CategoryCarouselItem {
  id: number;
  label: string;
  href: string;
  imageUrl: string | null;
}

const TONE = [
  {
    grad: "from-primary/30 via-primary/12 to-primary/5",
    ring: "ring-primary/25",
    hover:
      "hover:shadow-glow hover:ring-primary/50",
  },
  {
    grad: "from-papaya/35 via-papaya/15 to-papaya/5",
    ring: "ring-papaya/30",
    hover: "hover:shadow-glow-papaya hover:ring-papaya/55",
  },
  {
    grad: "from-sky-400/20 via-primary/10 to-muted",
    ring: "ring-primary/18",
    hover: "hover:shadow-glow hover:ring-primary/40",
  },
] as const;

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface CategoryCircleCarouselProps {
  items: CategoryCarouselItem[];
}

export function CategoryCircleCarousel({ items }: CategoryCircleCarouselProps) {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  if (items.length === 0) return null;

  if (reducedMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {items.map((item, index) => (
          <CarouselItem key={`${item.id}-rm-${index}`} item={item} index={index} />
        ))}
      </div>
    );
  }

  const loop = [...items, ...items];

  return (
    <div className="group/carousel overflow-hidden" dir="ltr">
      <div
        className={cn(
          "marquee-track flex w-max gap-5 pb-1 pt-0.5 md:gap-7",
          "animate-category-marquee",
          "group-hover/carousel:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: `${Math.max(28, Math.min(56, items.length * 3.2))}s`,
        }}
      >
        {loop.map((item, index) => (
          <CarouselItem key={`${item.id}-${index}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function CarouselItem({ item, index }: { item: CategoryCarouselItem; index: number }) {
  const tone = TONE[index % TONE.length];
  const showImg = item.imageUrl && item.imageUrl.length > 0;

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      className={cn(
        "group/item flex w-[4.75rem] shrink-0 flex-col items-center gap-2 text-center md:w-[5.5rem]"
      )}
    >
      <span
        className={cn(
          "relative flex size-[4.25rem] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br shadow-modern ring-2 transition-all duration-300 ease-out",
          "md:size-[5.25rem]",
          "hover:-translate-y-1.5 hover:scale-[1.06] hover:shadow-modern-lg",
          "motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0",
          tone.grad,
          tone.ring,
          tone.hover
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-black/[0.07] to-transparent opacity-50"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          aria-hidden
        >
          <span className="absolute -start-full top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 motion-reduce:opacity-0" />
        </span>
        {showImg ? (
          <Image
            src={item.imageUrl!}
            alt=""
            width={84}
            height={84}
            className="relative z-[1] size-[70%] object-contain drop-shadow-sm md:size-[72%]"
            unoptimized={imageSrcIsRemote(item.imageUrl!)}
          />
        ) : (
          <Grid3x3 className="relative z-[1] size-8 text-primary/90 md:size-9" aria-hidden />
        )}
      </span>
      <span className="line-clamp-2 max-w-[5.5rem] text-[11px] font-semibold leading-tight text-zinc-800 transition-colors duration-200 group-hover/item:text-primary md:text-xs">
        {item.label}
      </span>
    </Link>
  );
}
