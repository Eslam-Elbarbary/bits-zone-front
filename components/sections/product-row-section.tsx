import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/api";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

interface ProductRowSectionProps {
  title: string;
  products: Product[];
  variant?: "default" | "deal";
  className?: string;
  queryHref?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function ProductRowSection({
  title,
  products,
  variant = "default",
  className,
  queryHref,
  subtitle,
  eyebrow,
}: ProductRowSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div
          className="mb-6 flex flex-wrap items-end justify-between gap-4 opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none"
          style={{ animationDelay: "40ms" }}
        >
          <SectionHeading title={title} subtitle={subtitle} eyebrow={eyebrow} />
          {queryHref ? (
            <Button
              size="sm"
              className={cn(
                "gap-1 bg-primary px-5 text-primary-foreground shadow-sm",
                "transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]",
                "motion-reduce:active:scale-100"
              )}
              asChild
            >
              <Link href={queryHref}>
                عرض الكل
                <ChevronLeft className="size-4 transition-transform duration-200 group-hover/button:-translate-x-0.5" />
              </Link>
            </Button>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((p, index) => (
            <div
              key={`${p.id}-row-${index}`}
              className="opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none"
              style={{ animationDelay: `${80 + Math.min(index, 11) * 55}ms` }}
            >
              <ProductCard product={p} variant={variant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
