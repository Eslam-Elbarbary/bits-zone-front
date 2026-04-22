import { NextRequest, NextResponse } from "next/server";
import { getProductsFresh } from "@/lib/api";
import { normalizeProductsList } from "@/lib/products-response";
import type { ProductsQueryParams } from "@/types/api";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const params: ProductsQueryParams = {
    search: sp.get("search") ?? undefined,
    category_id: sp.get("category_id") ?? undefined,
    vendor_id: sp.get("vendor_id") ?? undefined,
    featured: sp.get("featured") ?? undefined,
    min_price: sp.get("min_price") ?? undefined,
    max_price: sp.get("max_price") ?? undefined,
    stock: sp.get("stock") ?? undefined,
    sort: sp.get("sort") ?? undefined,
    per_page: sp.get("per_page") ?? "12",
    page: sp.get("page") ?? undefined,
  };

  const perPage = Math.max(1, Math.min(48, parseInt(params.per_page ?? "12", 10) || 12));
  params.per_page = String(perPage);

  try {
    const res = await getProductsFresh(params);
    const { products, hasMore } = normalizeProductsList(res.data, perPage);
    return NextResponse.json({
      success: true,
      products,
      hasMore,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "فشل تحميل المنتجات";
    return NextResponse.json({ success: false, error: message, products: [], hasMore: false }, { status: 502 });
  }
}
