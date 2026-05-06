import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/api";
import { ROUTES } from "@/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoryBrowseCard } from "@/components/sections/category-browse-card";
import { cn } from "@/lib/utils";

export function BrowseCategoryGrid({ categories }: { categories: Category[] }) {
  const list = categories.slice(0, 8);

  if (list.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden py-14 md:py-20",
        "bg-gradient-to-b from-muted/80 via-sky-50/40 to-muted/60"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,oklch(0.58_0.12_245/0.08),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-32 top-1/3 size-96 rounded-full bg-papaya/15 blur-3xl animate-light-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-24 bottom-1/4 size-72 rounded-full bg-primary/10 blur-3xl animate-light-pulse motion-reduce:animate-none [animation-delay:2s]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <div
          className="mb-8 flex flex-wrap items-end justify-between gap-4 opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none md:mb-10"
          style={{ animationDelay: "40ms" }}
        >
          <SectionHeading
            eyebrow="فئات"
            title="تصفح الفئات 🐾"
            subtitle="اختار اللي حيوانك محتاجه من الأكل، الرمل، الألعاب وكل المستلزمات بسهولة."
          />
          <Button
            size="sm"
            className="gap-1 rounded-xl bg-primary px-5 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] motion-reduce:active:scale-100"
            asChild
          >
            <Link href={ROUTES.categories}>
              كل الفئات
              <ChevronLeft className="size-4 transition-transform duration-200 group-hover/button:-translate-x-0.5" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {list.map((cat, index) => (
            <CategoryBrowseCard key={`${cat.id}-grid-${index}`} cat={cat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
