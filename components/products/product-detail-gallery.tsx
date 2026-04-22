"use client";

import { useState } from "react";
import Image from "next/image";
import { imageSrcIsRemote } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

interface ProductDetailGalleryProps {
  alt: string;
  images: string[];
  className?: string;
}

export function ProductDetailGallery({ alt, images, className }: ProductDetailGalleryProps) {
  const list = images.length > 0 ? images : ["/ui/placeholder-product.svg"];
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, list.length - 1);
  const main = list[safeIndex] ?? list[0];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-[1.75rem] border border-sky-200/50 bg-gradient-to-br from-sky-50 via-white to-papaya/15",
          "shadow-[0_20px_50px_-20px_oklch(0.58_0.145_245/0.25)] ring-1 ring-white/90 backdrop-blur-sm"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.95),transparent_55%)]"
          aria-hidden
        />
        <Image
          src={main}
          alt={alt}
          fill
          className="object-contain p-6 sm:p-8 md:p-10"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={imageSrcIsRemote(main)}
        />
      </div>
      {list.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white/90 transition-all sm:size-[4.5rem]",
                i === safeIndex
                  ? "border-primary shadow-md shadow-primary/15 ring-2 ring-primary/20"
                  : "border-sky-100/80 opacity-90 hover:border-sky-300 hover:opacity-100"
              )}
              aria-label={`صورة ${i + 1}`}
              aria-current={i === safeIndex ? "true" : undefined}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-contain p-1.5"
                sizes="72px"
                unoptimized={imageSrcIsRemote(src)}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
