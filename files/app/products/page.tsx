import type { Metadata } from "next";
import Link from "next/link";
import { Package, Store } from "lucide-react";
import { ProductsFiltersForm, type ProductsFilterDefaults } from "@/components/products/products-filters-form";
import {
  ProductsListingStatsProvider,
  ProductsListingSummary,
} from "@/components/products/products-listing-stats";
import { NoticeBanner } from "@/components/shared/notice-banner";
import { ProductsShopLayout } from "@/components/products/products-shop-layout";
import { ProductsInfiniteGrid } from "@/components/products/products-infinite-grid";
import { ROUTES } from "@/constants";
import { extractList } from "@/lib/api-data";
import { getCategories, getProductsFresh, getVendors } from "@/lib/api";
import { flattenCategoriesForFilter } from "@/lib/category-utils";
import { normalizeProductsList } from "@/lib/products-response";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { vendorDisplayName } from "@/lib/vendor-utils";
import type { Category, Product, ProductsQueryParams, Vendor } from "@/types/api";

const PER_PAGE = 12;

/** Query-driven page — must re-fetch on every filter change (client calls router.refresh). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "جميع المنتجات",
    description: "تصفح منتجات العناية بالحيوانات الأليفة — بحث، فئات، ترتيب، وفلاتر سعر وتوفر.",
  };
}

function qp(
  sp: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

function toFilterParams(q: ProductsQueryParams): Record<string, string> {
  const out: Record<string, string> = {};
  const add = (k: keyof ProductsQueryParams, v: string | undefined) => {
    if (v !== undefined && v !== "") out[k] = v;
  };
  add("search", q.search);
  add("category_id", q.category_id);
  add("vendor_id", q.vendor_id);
  add("featured", q.featured);
  add("min_price", q.min_price);
  add("max_price", q.max_price);
  add("stock", q.stock);
  out.sort = q.sort ?? "latest";
  return out;
}

function countActiveFilters(d: ProductsFilterDefaults): number {
  let n = 0;
  if (d.search.trim()) n += 1;
  if (d.categoryId) n += 1;
  if (d.vendorId) n += 1;
  if (d.stock) n += 1;
  if (d.minPrice || d.maxPrice) n += 1;
  if (d.featured === "1") n += 1;
  if (d.sort && d.sort !== "latest") n += 1;
  return n;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query: ProductsQueryParams = {
    search: qp(sp, "search"),
    category_id: qp(sp, "category_id"),
    vendor_id: qp(sp, "vendor_id"),
    featured: qp(sp, "featured"),
    min_price: qp(sp, "min_price"),
    max_price: qp(sp, "max_price"),
    stock: qp(sp, "stock"),
    sort: qp(sp, "sort") ?? "latest",
    per_page: String(PER_PAGE),
    page: "1",
  };

  const filterParams = toFilterParams(query);

  let products: Product[] = [];
  let hasMore = false;
  let message: string | null = null;

  let categories: Category[] = [];
  let vendorsList: Vendor[] = [];
  try {
    const catRes = await getCategories({ per_page: "100", sort: "latest" });
    categories = extractList<Category>(catRes.data);
  } catch {
    categories = [];
  }
  try {
    const venRes = await getVendors({ per_page: "100", sort: "latest" });
    vendorsList = extractList<Vendor>(venRes.data);
  } catch {
    vendorsList = [];
  }

  let vendorOptions = vendorsList.map((v) => ({
    id: v.id,
    label: vendorDisplayName(v),
  }));
  const vendorIdFromQuery = (query.vendor_id ?? "").trim();
  const selectedVendor =
    vendorIdFromQuery.length > 0
      ? vendorsList.find((v) => String(v.id) === vendorIdFromQuery)
      : undefined;
  if (
    vendorIdFromQuery.length > 0 &&
    !vendorOptions.some((o) => String(o.id) === vendorIdFromQuery)
  ) {
    const parsed = Number.parseInt(vendorIdFromQuery, 10);
    if (!Number.isNaN(parsed)) {
      vendorOptions = [
        ...vendorOptions,
        { id: parsed, label: `متجر #${vendorIdFromQuery}` },
      ];
    }
  }

  try {
    const res = await getProductsFresh(query);
    const parsed = normalizeProductsList(res.data, PER_PAGE);
    products = parsed.products;
    hasMore = parsed.hasMore;
  } catch (e) {
    message = e instanceof Error ? e.message : "فشل تحميل المنتجات";
  }

  const gridKey = JSON.stringify(filterParams);
  const categoryOptions = flattenCategoriesForFilter(categories);

  const filterDefaults: ProductsFilterDefaults = {
    search: query.search ?? "",
    categoryId: query.category_id ?? "",
    vendorId: query.vendor_id ?? "",
    sort: query.sort ?? "latest",
    stock: query.stock ?? "",
    minPrice: query.min_price ?? "",
    maxPrice: query.max_price ?? "",
    featured: query.featured === "1" ? "1" : "",
  };

  const activeFilterCount = countActiveFilters(filterDefaults);

  const filtersForm = (
    <ProductsFiltersForm
      key={gridKey}
      categories={categoryOptions}
      vendors={vendorOptions}
      defaults={filterDefaults}
      idSuffix="shop"
    />
  );

  const toolbarHint = !message ? (
    <ProductsListingSummary fallbackCount={products.length} fallbackHasMore={hasMore} />
  ) : null;

  return (
    <ProductsListingStatsProvider initialCount={products.length} initialHasMore={hasMore}>
      <div className="relative mx-auto max-w-7xl px-3 py-8 sm:px-4 md:py-12 lg:px-6">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.72_0.175_62/0.22),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute start-0 top-32 h-64 w-64 rounded-full bg-primary/[0.07] blur-3xl md:top-40"
          aria-hidden
        />

        <header className="relative mb-10 text-balance md:mb-12">
          <p className="inline-flex items-center gap-2 text-muted-foreground">
            <Package className="size-4 shrink-0 text-primary/80" strokeWidth={2} aria-hidden />
            <span className="text-sm font-medium leading-none">معرض المنتجات</span>
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-tight">
            استكشف المنتجات
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            صف كامل العرض للبطاقات، والفلاتر في لوحة جانبية تفتح عند الطلب — اختر الفئة أو السعر أو الترتيب وستُحدَّث
            النتائج فوراً.
          </p>
          {selectedVendor ? (
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-sky-800/90">
              <Store className="size-4 shrink-0 text-primary" aria-hidden />
              <span>
                تعرض النتائج منتجات{" "}
                <Link
                  href={ROUTES.vendor(selectedVendor.id)}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {vendorDisplayName(selectedVendor)}
                </Link>
                . يمكنك{" "}
                <Link href={ROUTES.vendors} className="font-medium text-primary underline-offset-4 hover:underline">
                  تصفح كل المتاجر
                </Link>{" "}
                أو تغيير البائع من الفلاتر.
              </span>
            </p>
          ) : null}
        </header>

        <ProductsShopLayout activeFilterCount={activeFilterCount} filters={filtersForm} toolbarHint={toolbarHint}>
          {message ? (
            <NoticeBanner variant="error" title="تعذر تحميل المنتجات" className="mb-2 shadow-modern">
              {getUserFacingErrorDescription(message)}
            </NoticeBanner>
          ) : null}
          {!message && products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-sky-200/70 bg-gradient-to-b from-white/90 to-sky-50/30 px-6 py-16 text-center shadow-inner shadow-sky-900/[0.03] backdrop-blur-sm">
              <p className="mx-auto max-w-md text-muted-foreground">
                لا توجد منتجات مطابقة لخياراتك. افتح «الفلاتر» وجرّب تعديل البحث أو الفئة أو نطاق السعر.
              </p>
            </div>
          ) : null}
          {!message && products.length > 0 ? (
            <ProductsInfiniteGrid
              key={gridKey}
              initialProducts={products}
              initialHasMore={hasMore}
              filterParams={filterParams}
              perPage={PER_PAGE}
            />
          ) : null}
        </ProductsShopLayout>
      </div>
    </ProductsListingStatsProvider>
  );
}
