import { CategoryCircleCarousel, type CategoryCarouselItem } from "./category-circle-carousel";
import { cn } from "@/lib/utils";

interface CategoryCarouselBannerProps {
  items: CategoryCarouselItem[];
  className?: string;
}

/** Full-width category marquee — often placed after the hero and browse grid on the home page. */
export function CategoryCarouselBanner({ items, className }: CategoryCarouselBannerProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-zinc-200/70 bg-gradient-to-b from-white via-white to-muted/20",
        className
      )}
      aria-label="فئات دائرية"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.58_0.12_245/0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-1/4 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl animate-light-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-1/4 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-papaya/20 blur-3xl animate-light-pulse motion-reduce:animate-none [animation-delay:1.2s]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/35 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-5 md:py-6">
        <div className="mb-4 text-center md:mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/90 md:text-[11px]">
            العناية بالأطفال
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900 md:text-base">اختر فئة وابدأ رحلة تسوق آمنة</p>
        </div>
        <CategoryCircleCarousel items={items} />
      </div>
    </section>
  );
}
