"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGrid, Loader2 } from "lucide-react";
import { useProductsListingStatsOptional } from "@/components/products/products-listing-stats";
import { ProductCard } from "@/components/shared/product-card";
import { NoticeBanner } from "@/components/shared/notice-banner";
import type { Product } from "@/types/api";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { cn } from "@/lib/utils";

interface ProductsInfiniteGridProps {
  initialProducts: Product[];
  initialHasMore: boolean;
  /** Query params forwarded to `/api/products/load` (no `page`). */
  filterParams: Record<string, string>;
  perPage: number;
}

export function ProductsInfiniteGrid({
  initialProducts,
  initialHasMore,
  filterParams,
  perPage,
}: ProductsInfiniteGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPageRef = useRef(2);
  const hasMoreRef = useRef(initialHasMore);
  const loadingRef = useRef(false);
  const [allLoaded, setAllLoaded] = useState(!initialHasMore);
  const [hasMore, setHasMore] = useState(initialHasMore);
  /** Only the setter is stable; the full context value changes when stats change — do not depend on it or effects loop. */
  const setListingStats = useProductsListingStatsOptional()?.setListingStats;

  useEffect(() => {
    setProducts(initialProducts);
    nextPageRef.current = 2;
    hasMoreRef.current = initialHasMore;
    setHasMore(initialHasMore);
    setAllLoaded(!initialHasMore);
    setError(null);
  }, [initialProducts, initialHasMore]);

  useEffect(() => {
    if (!setListingStats) return;
    setListingStats({
      count: products.length,
      hasMore,
      loadingMore: loading,
    });
  }, [setListingStats, products.length, hasMore, loading]);

  const loadNext = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const next = nextPageRef.current;
    const qs = new URLSearchParams({
      ...filterParams,
      page: String(next),
      per_page: String(perPage),
    });

    try {
      const res = await fetch(`/api/products/load?${qs.toString()}`);
      const json = (await res.json()) as {
        success?: boolean;
        products?: Product[];
        hasMore?: boolean;
        error?: string;
      };

      if (!json.success) {
        throw new Error(json.error ?? "تعذر تحميل المزيد");
      }

      const incoming = Array.isArray(json.products) ? json.products : [];

      if (incoming.length === 0) {
        hasMoreRef.current = false;
        setHasMore(false);
        setAllLoaded(true);
      } else {
        setProducts((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          const merged = [...prev];
          for (const p of incoming) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }
          return merged;
        });
        nextPageRef.current = next + 1;
        const more = !!json.hasMore;
        hasMoreRef.current = more;
        setHasMore(more);
        if (!more) setAllLoaded(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر تحميل المزيد");
      hasMoreRef.current = false;
      setHasMore(false);
      setAllLoaded(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [filterParams, perPage]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadNext();
        }
      },
      { root: null, rootMargin: "280px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [loadNext]);

  return (
    <section className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LayoutGrid className="size-4 text-primary/70" aria-hidden />
        <span>شبكة المنتجات</span>
      </div>

      <div
        className={cn(
          "rounded-[1.75rem] border border-sky-200/45 bg-white/40 p-4 shadow-modern ring-1 ring-white/60 backdrop-blur-md sm:p-5 md:p-6",
          "dark:bg-card/20 dark:ring-white/[0.06]"
        )}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.map((p, index) => (
            <ProductCard key={`${p.id}-inf-${index}`} product={p} />
          ))}
        </div>
      </div>

      <div ref={sentinelRef} className="flex min-h-16 flex-col items-center justify-center gap-3 py-4">
        {loading ? (
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border border-sky-200/60 bg-white/70 px-5 py-2.5 text-sm font-medium text-sky-900",
              "shadow-modern backdrop-blur-xl dark:border-white/10 dark:bg-card/50 dark:text-zinc-200"
            )}
          >
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden />
            <span>جاري تحميل المزيد…</span>
          </div>
        ) : null}
        {allLoaded && products.length > 0 ? (
          <p className="text-center text-xs text-muted-foreground">تم عرض كل المنتجات المتاحة لهذه التصفية.</p>
        ) : null}
        {error ? (
          <NoticeBanner variant="error" title="تعذر تحميل المزيد" className="max-w-md" role="alert">
            {getUserFacingErrorDescription(error)}
          </NoticeBanner>
        ) : null}
      </div>
    </section>
  );
}
