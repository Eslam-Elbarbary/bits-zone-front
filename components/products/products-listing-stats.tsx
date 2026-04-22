"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Layers, Loader2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

type ListingStats = {
  count: number;
  hasMore: boolean;
  loadingMore: boolean;
};

const ProductsListingStatsContext = createContext<{
  stats: ListingStats;
  setListingStats: (patch: Partial<ListingStats>) => void;
} | null>(null);

export function ProductsListingStatsProvider({
  children,
  initialCount,
  initialHasMore,
}: {
  children: ReactNode;
  initialCount: number;
  initialHasMore: boolean;
}) {
  const [stats, setStats] = useState<ListingStats>({
    count: initialCount,
    hasMore: initialHasMore,
    loadingMore: false,
  });

  useEffect(() => {
    setStats((s) => ({
      ...s,
      count: initialCount,
      hasMore: initialHasMore,
      loadingMore: false,
    }));
  }, [initialCount, initialHasMore]);

  const setListingStats = useCallback((patch: Partial<ListingStats>) => {
    setStats((prev) => {
      const next = { ...prev, ...patch };
      if (
        next.count === prev.count &&
        next.hasMore === prev.hasMore &&
        next.loadingMore === prev.loadingMore
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ stats, setListingStats }),
    [stats, setListingStats]
  );

  return (
    <ProductsListingStatsContext.Provider value={value}>
      {children}
    </ProductsListingStatsContext.Provider>
  );
}

export function useProductsListingStatsOptional() {
  return useContext(ProductsListingStatsContext);
}

/** Professional summary for the products toolbar — uses live stats when provider is present. */
export function ProductsListingSummary({
  fallbackCount,
  fallbackHasMore,
}: {
  fallbackCount?: number;
  fallbackHasMore?: boolean;
}) {
  const optional = useProductsListingStatsOptional();
  const count = optional?.stats.count ?? fallbackCount ?? 0;
  const hasMore = optional?.stats.hasMore ?? fallbackHasMore ?? false;
  const loadingMore = optional?.stats.loadingMore ?? false;

  if (count === 0 && !loadingMore) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            "bg-sky-50/90 text-sky-600 ring-1 ring-sky-200/70"
          )}
          aria-hidden
        >
          <Layers className="size-[1.15rem] opacity-90" />
        </span>
        <p className="text-sm leading-snug text-muted-foreground">
          جرّب توسيع الفلاتر أو إزالة بعض المعايير.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          "bg-gradient-to-br from-primary/[0.12] to-sky-50 text-primary shadow-sm ring-1 ring-primary/15"
        )}
        aria-hidden
      >
        <Package className="size-[1.15rem]" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-600/80 md:text-[11px]">
          نتائج العرض
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-base font-bold leading-none text-sky-950 tabular-nums md:text-lg">
            {count}
            <span className="ms-1.5 text-sm font-semibold text-sky-900/90 md:text-base">منتج</span>
          </p>
          {loadingMore ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-sky-800 shadow-sm">
              <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden />
              تحديث القائمة…
            </span>
          ) : null}
        </div>
        {hasMore ? (
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground md:text-xs">
            المزيد يُحمَّل تلقائياً عند الاقتراب من أسفل الصفحة.
          </p>
        ) : count > 0 ? (
          <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-emerald-800/90 md:text-xs">
            تم عرض كل المنتجات المتاحة لهذه التصفية.
          </p>
        ) : null}
      </div>
    </div>
  );
}
