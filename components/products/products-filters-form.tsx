"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  Loader2,
  Package,
  Search,
  Sparkles,
  Store,
  Tag,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "latest", label: "الأحدث أولاً" },
  { value: "oldest", label: "الأقدم أولاً" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
] as const;

const STOCK_OPTIONS = [
  { value: "all", label: "كل الحالات" },
  { value: "in_stock", label: "متوفر فقط" },
  { value: "out_of_stock", label: "غير متوفر" },
] as const;

const SEARCH_DEBOUNCE_MS = 420;
const PRICE_DEBOUNCE_MS = 520;

const ALL = "all";

export interface ProductsFilterDefaults {
  search: string;
  categoryId: string;
  vendorId: string;
  sort: string;
  stock: string;
  minPrice: string;
  maxPrice: string;
  featured: string;
}

function buildQueryParams(d: ProductsFilterDefaults): URLSearchParams {
  const p = new URLSearchParams();
  const s = d.search.trim();
  if (s) p.set("search", s);
  if (d.categoryId) p.set("category_id", d.categoryId);
  if (d.vendorId) p.set("vendor_id", d.vendorId);
  p.set("sort", d.sort && d.sort.length > 0 ? d.sort : "latest");
  if (d.stock) p.set("stock", d.stock);
  if (d.minPrice.trim()) p.set("min_price", d.minPrice.trim());
  if (d.maxPrice.trim()) p.set("max_price", d.maxPrice.trim());
  if (d.featured === "1") p.set("featured", "1");
  return p;
}

function filterHref(d: ProductsFilterDefaults): string {
  const q = buildQueryParams(d);
  const qs = q.toString();
  return qs ? `${ROUTES.products}?${qs}` : ROUTES.products;
}

interface CategoryOption {
  id: number;
  label: string;
}

interface VendorOption {
  id: number;
  label: string;
}

interface ProductsFiltersFormProps {
  categories: CategoryOption[];
  vendors: VendorOption[];
  defaults: ProductsFilterDefaults;
  className?: string;
  compact?: boolean;
  idSuffix?: string;
}

function FilterSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="mb-3.5 flex items-start gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground/80"
          aria-hidden
        >
          <Icon className="size-[1.05rem]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-sm font-semibold leading-tight text-foreground">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

const selectTriggerClass = cn(
  "h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-start text-sm font-medium text-foreground",
  "shadow-sm shadow-black/[0.02] transition-colors",
  "hover:border-input hover:bg-muted/40",
  "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
  "data-[size=default]:h-11 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
);

const selectContentClass =
  "z-[80] max-h-72 rounded-lg border border-border bg-popover p-1 shadow-lg";

export function ProductsFiltersForm({
  categories,
  vendors,
  defaults,
  className,
  compact,
  idSuffix = "",
}: ProductsFiltersFormProps) {
  const router = useRouter();
  const sid = (base: string) => (idSuffix ? `${base}-${idSuffix}` : base);

  const [values, setValues] = useState<ProductsFilterDefaults>(defaults);
  const [pendingSearch, setPendingSearch] = useState(false);
  const [pendingPrice, setPendingPrice] = useState(false);

  const valuesRef = useRef(values);
  valuesRef.current = values;

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      if (priceTimer.current) clearTimeout(priceTimer.current);
    };
  }, []);

  const push = useCallback(
    (next: ProductsFilterDefaults) => {
      const href = filterHref(next);
      router.replace(href, { scroll: false });
      /** Re-run the Server Component so searchParams + product list match the new query (replace alone can leave stale RSC data). */
      router.refresh();
    },
    [router]
  );

  const applyImmediate = useCallback(
    (patch: Partial<ProductsFilterDefaults>) => {
      const next = { ...valuesRef.current, ...patch };
      valuesRef.current = next;
      setValues(next);
      /** Router updates must not run inside a setState updater — defer past this render. */
      queueMicrotask(() => {
        push(next);
      });
    },
    [push]
  );

  const scheduleSearch = useCallback(
    (search: string) => {
      setPendingSearch(true);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        searchTimer.current = null;
        setPendingSearch(false);
        const next = { ...valuesRef.current, search };
        valuesRef.current = next;
        setValues(next);
        push(next);
      }, SEARCH_DEBOUNCE_MS);
    },
    [push]
  );

  const schedulePrice = useCallback(() => {
    setPendingPrice(true);
    if (priceTimer.current) clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      priceTimer.current = null;
      setPendingPrice(false);
      const next = valuesRef.current;
      push(next);
    }, PRICE_DEBOUNCE_MS);
  }, [push]);

  const applying = pendingSearch || pendingPrice;

  const categoryValue = values.categoryId || ALL;
  const vendorValue = values.vendorId || ALL;
  const stockValue = values.stock || ALL;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          compact ? "space-y-3" : "space-y-4"
        )}
      >
        {applying ? (
          <div
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/80 px-3 py-2 text-xs font-medium text-foreground"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden />
            جاري تحديث النتائج…
          </div>
        ) : null}

        <FilterSection
          icon={Search}
          title="بحث ذكي"
          description="ابحث بالاسم أو الوسم أو المعرف داخل النتائج."
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute end-3 top-1/2 size-[1.125rem] -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={sid("products-search")}
              type="search"
              placeholder="مثال: طعام قطط، رقم الصنف…"
              dir="rtl"
              value={values.search}
              onChange={(e) => {
                const v = e.target.value;
                setValues((prev) => {
                  const next = { ...prev, search: v };
                  valuesRef.current = next;
                  return next;
                });
                scheduleSearch(v);
              }}
              className="h-11 border-input bg-background pe-11 text-sm placeholder:text-muted-foreground md:text-sm"
              aria-label="بحث في المنتجات"
            />
          </div>
        </FilterSection>

        <FilterSection icon={Package} title="الفئة" description="حدّد تصنيفاً واحداً أو اعرض كل الفئات.">
          <Label htmlFor={sid("products-category")} className="sr-only">
            الفئة
          </Label>
          <Select
            value={categoryValue}
            onValueChange={(v) => applyImmediate({ categoryId: v === ALL ? "" : v })}
          >
            <SelectTrigger id={sid("products-category")} className={selectTriggerClass} aria-label="تصفية حسب الفئة">
              <SelectValue placeholder="كل الفئات" />
            </SelectTrigger>
            <SelectContent className={selectContentClass} position="popper">
              <SelectItem value={ALL}>كل الفئات</SelectItem>
            {categories.map((c, idx) => (
              <SelectItem key={`cat-${c.id}-${idx}`} value={String(c.id)}>
                {c.label}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <FilterSection
          icon={Store}
          title="المتجر"
          description="تصفية منتجات بائع محدد أو كل المتاجر."
        >
          <Label htmlFor={sid("products-vendor")} className="sr-only">
            المتجر
          </Label>
          <Select
            value={vendorValue}
            onValueChange={(v) => applyImmediate({ vendorId: v === ALL ? "" : v })}
          >
            <SelectTrigger id={sid("products-vendor")} className={selectTriggerClass} aria-label="تصفية حسب المتجر">
              <SelectValue placeholder="كل المتاجر" />
            </SelectTrigger>
            <SelectContent className={selectContentClass} position="popper">
              <SelectItem value={ALL}>كل المتاجر</SelectItem>
              {vendors.map((v, idx) => (
                <SelectItem key={`vendor-${v.id}-${idx}`} value={String(v.id)}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {vendors.length === 0 ? (
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              <Link href={ROUTES.vendors} className="font-semibold text-primary underline-offset-4 hover:underline">
                تصفح دليل المتاجر
              </Link>{" "}
              ثم ارجع لاختيار بائع من القائمة.
            </p>
          ) : null}
        </FilterSection>

        <FilterSection
          icon={ArrowDownUp}
          title="الترتيب والتوفر"
          description="ترتيب النتائج وحالة المخزون كما في المتاجر الكبرى."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor={sid("products-sort")}
                className="text-xs font-medium text-foreground"
              >
                ترتيب العرض
              </Label>
              <Select
                value={values.sort || "latest"}
                onValueChange={(v) => applyImmediate({ sort: v })}
              >
                <SelectTrigger id={sid("products-sort")} className={selectTriggerClass} aria-label="ترتيب المنتجات">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClass} position="popper">
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={sid("products-stock")}
                className="text-xs font-medium text-foreground"
              >
                التوفر
              </Label>
              <Select
                value={stockValue}
                onValueChange={(v) => applyImmediate({ stock: v === ALL ? "" : v })}
              >
                <SelectTrigger id={sid("products-stock")} className={selectTriggerClass} aria-label="تصفية حسب التوفر">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClass} position="popper">
                  {STOCK_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          icon={Wallet}
          title="نطاق السعر"
          description="بالريال السعودي — يُطبَّق بعد توقف الكتابة قليلاً."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={sid("min_price")} className="text-xs font-medium text-foreground">
                من
              </Label>
              <div
                className={cn(
                  "flex min-h-11 w-full items-stretch overflow-hidden rounded-lg border border-input bg-background shadow-sm",
                  "transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/35"
                )}
                dir="ltr"
              >
                <input
                  id={sid("min_price")}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder="0"
                  value={values.minPrice}
                  onChange={(e) => {
                    const minPrice = e.target.value;
                    setValues((prev) => {
                      const next = { ...prev, minPrice };
                      valuesRef.current = next;
                      return next;
                    });
                    schedulePrice();
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm font-semibold text-foreground tabular-nums outline-none placeholder:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span
                  className="flex shrink-0 items-center border-s border-border bg-muted/50 px-3 text-xs font-semibold tabular-nums text-muted-foreground"
                  aria-hidden
                >
                  ر.س
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={sid("max_price")} className="text-xs font-medium text-foreground">
                إلى
              </Label>
              <div
                className={cn(
                  "flex min-h-11 w-full items-stretch overflow-hidden rounded-lg border border-input bg-background shadow-sm",
                  "transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/35"
                )}
                dir="ltr"
              >
                <input
                  id={sid("max_price")}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder="∞"
                  value={values.maxPrice}
                  onChange={(e) => {
                    const maxPrice = e.target.value;
                    setValues((prev) => {
                      const next = { ...prev, maxPrice };
                      valuesRef.current = next;
                      return next;
                    });
                    schedulePrice();
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm font-semibold text-foreground tabular-nums outline-none placeholder:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span
                  className="flex shrink-0 items-center border-s border-border bg-muted/50 px-3 text-xs font-semibold tabular-nums text-muted-foreground"
                  aria-hidden
                >
                  ر.س
                </span>
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection icon={Tag} title="عروض مميزة" description="إظهار المنتجات المعلّمة كمميزة فقط.">
          <label
            htmlFor={sid("featured")}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-3.5 transition-colors",
              "hover:border-primary/30 hover:bg-muted/30",
              values.featured === "1" && "border-primary/35 bg-primary/[0.06] ring-1 ring-primary/15"
            )}
          >
            <input
              id={sid("featured")}
              type="checkbox"
              checked={values.featured === "1"}
              onChange={(e) => applyImmediate({ featured: e.target.checked ? "1" : "" })}
              className="mt-0.5 size-4 shrink-0 rounded border-input text-primary focus:ring-2 focus:ring-ring/40"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
                منتجات مميزة فقط
              </span>
              <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
                يقتصر العرض على العناصر المختارة من المتجر كعروض أو picks.
              </span>
            </span>
          </label>
        </FilterSection>

        <div className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">تلميح:</span> الخيارات تُحدَّث الرابط فوراً. البحث والسعر
          يتأخران جزءاً من الثانية لتفادي الوميض أثناء الكتابة.
        </div>
      </div>

      <div
        className={cn(
          "shrink-0 border-t border-border bg-background pt-4",
          "pb-[max(1rem,env(safe-area-inset-bottom))]"
        )}
      >
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-lg border-border bg-background text-sm font-semibold shadow-sm hover:bg-muted/60"
          asChild
        >
          <Link href={ROUTES.products}>إعادة ضبط كل الفلاتر</Link>
        </Button>
        <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
          يعيد هذا الرابط الصفحة بدون معايير — كبداية جديدة للبحث.
        </p>
      </div>
    </div>
  );
}
