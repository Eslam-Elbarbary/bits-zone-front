import type { Product } from "@/types/api";

type PaginatorMeta = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

function isProductArray(v: unknown): v is Product[] {
  return Array.isArray(v) && (v.length === 0 || (typeof v[0] === "object" && v[0] != null && "id" in v[0]));
}

/**
 * Normalize Laravel-style paginated JSON or plain arrays from GET /api/products.
 */
export function normalizeProductsList(
  data: unknown,
  requestedPerPage: number
): { products: Product[]; hasMore: boolean } {
  const perPage = Math.max(1, requestedPerPage);

  if (isProductArray(data)) {
    return {
      products: data,
      hasMore: data.length >= perPage,
    };
  }

  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;

    if (isProductArray(o.data)) {
      let hasMore = o.data.length >= perPage;
      const meta = o.meta as PaginatorMeta | undefined;
      if (meta && typeof meta.current_page === "number" && typeof meta.last_page === "number") {
        hasMore = meta.current_page < meta.last_page;
      } else if (
        typeof o.current_page === "number" &&
        typeof o.last_page === "number"
      ) {
        hasMore = o.current_page < o.last_page;
      }
      return { products: o.data, hasMore };
    }
  }

  return { products: [], hasMore: false };
}
