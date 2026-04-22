"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, Loader2, Star } from "lucide-react";
import { fetchProductForQuickViewAction } from "@/app/actions/products";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { needsProductDetailHydration } from "@/lib/product-api-helpers";
import {
  cartVariantIdForProduct,
  defaultCartVariantId,
  listProductVariants,
  type NormalizedVariant,
} from "@/lib/product-variants";
import {
  formatPrice,
  formatProductRating,
  imageSrcIsRemote,
  productDisplayName,
  productImageSrc,
} from "@/lib/product-utils";
import { vendorDisplayName } from "@/lib/vendor-utils";
import type { Product } from "@/types/api";
import { cn } from "@/lib/utils";

const selectClass = cn(
  "flex h-12 w-full rounded-xl border-2 border-sky-200/90 bg-white px-3 py-2 text-sm shadow-inner shadow-sky-900/5",
  "ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
);

function plainDescription(raw: string | undefined | null, max = 320): string {
  if (!raw || !String(raw).trim()) return "";
  const t = String(raw)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function pricesForSelection(product: Product, variant: NormalizedVariant | undefined) {
  const hasVariantPrice =
    variant != null &&
    (variant.sale_price != null ||
      variant.price != null ||
      variant.compare_at_price != null);
  if (hasVariantPrice) {
    const price = variant!.sale_price ?? variant!.price ?? product.sale_price ?? product.price;
    const compareRaw = variant!.compare_at_price ?? product.compare_at_price;
    const showCompare =
      compareRaw != null && String(compareRaw).trim() !== "" && String(compareRaw) !== String(price);
    return { price, compare: showCompare ? compareRaw : null };
  }
  return {
    price: product.sale_price ?? product.price,
    compare: product.compare_at_price,
  };
}

function mergeListingWithDetail(listing: Product, detail: Product): Product {
  return {
    ...listing,
    ...detail,
    is_favorite: listing.is_favorite ?? detail.is_favorite,
    variants: detail.variants ?? listing.variants,
    product_variants: detail.product_variants ?? listing.product_variants,
    variations: detail.variations ?? listing.variations,
    variant_list: detail.variant_list ?? listing.variant_list,
    options: detail.options ?? listing.options,
    variant: detail.variant ?? listing.variant,
    default_variant_id: detail.default_variant_id ?? listing.default_variant_id,
    variant_id: detail.variant_id ?? listing.variant_id,
    included: detail.included ?? listing.included,
    meta: detail.meta ?? listing.meta,
    relationships: detail.relationships ?? listing.relationships,
  };
}

export function ProductQuickViewDialog({
  product: listingProduct,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [resolved, setResolved] = useState<Product | null>(null);
  const [hydrateStatus, setHydrateStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [hydrateError, setHydrateError] = useState<string | null>(null);

  const effectiveProduct = resolved ?? listingProduct;
  const needFetch = needsProductDetailHydration(listingProduct);

  const loadDetail = useCallback(async () => {
    if (!needsProductDetailHydration(listingProduct)) return;
    setHydrateStatus("loading");
    setHydrateError(null);
    const r = await fetchProductForQuickViewAction(String(listingProduct.id));
    if (r.ok) {
      setResolved(mergeListingWithDetail(listingProduct, r.product));
      setHydrateStatus("ready");
    } else {
      setHydrateStatus("error");
      setHydrateError(r.error);
    }
  }, [listingProduct]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        setResolved(null);
        setHydrateStatus("idle");
        setHydrateError(null);
        return;
      }
      setResolved(null);
      setHydrateError(null);
      if (!needsProductDetailHydration(listingProduct)) {
        setHydrateStatus("ready");
        return;
      }
      setHydrateStatus("loading");
      void fetchProductForQuickViewAction(String(listingProduct.id)).then((r) => {
        if (r.ok) {
          setResolved(mergeListingWithDetail(listingProduct, r.product));
          setHydrateStatus("ready");
        } else {
          setHydrateStatus("error");
          setHydrateError(r.error);
        }
      });
    },
    [listingProduct]
  );

  const name = productDisplayName(effectiveProduct);
  const img = productImageSrc(effectiveProduct);
  const variants = useMemo(() => listProductVariants(effectiveProduct), [effectiveProduct]);
  /** While detail is loading, avoid product-id fallback so we do not POST the wrong `variant_id`. */
  const preset = useMemo(() => {
    if (needFetch && hydrateStatus === "loading") {
      return defaultCartVariantId(effectiveProduct);
    }
    return cartVariantIdForProduct(effectiveProduct);
  }, [effectiveProduct, needFetch, hydrateStatus]);

  const [selected, setSelected] = useState(() => {
    if (preset) return preset;
    if (variants.length === 1) return variants[0].id;
    return "";
  });

  useEffect(() => {
    if (!open) return;
    setSelected((prev) => {
      if (preset) return preset;
      if (variants.length === 1) return variants[0].id;
      if (prev && variants.some((v) => v.id === prev)) return prev;
      return "";
    });
  }, [open, preset, variants]);

  const selectedVariant = variants.find((v) => v.id === selected);
  const effectiveId =
    selected.trim() || preset || (variants.length === 1 ? variants[0].id : "");
  const showSelect = variants.length > 1;
  const canAdd = effectiveId.length > 0;
  const { price, compare } = pricesForSelection(effectiveProduct, selectedVariant);
  const blurb = plainDescription(effectiveProduct.short_description ?? effectiveProduct.description);

  const hydrating = needFetch && hydrateStatus === "loading";
  const hydrateFailed = needFetch && hydrateStatus === "error";
  const readyToPurchase = !needFetch || hydrateStatus === "ready";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton
        overlayClassName="z-50 bg-slate-900/50 backdrop-blur-[3px]"
        className={cn(
          "max-h-[min(92vh,900px)] max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden p-0 sm:max-w-[42rem] lg:max-w-[46rem]",
          "rounded-2xl border-2 border-sky-200/90 bg-white text-foreground shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)] ring-0",
          "[&_[data-slot=dialog-close]]:absolute [&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:end-3 [&_[data-slot=dialog-close]]:z-20",
          "[&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:border [&_[data-slot=dialog-close]]:border-sky-200/80",
          "[&_[data-slot=dialog-close]]:bg-white/95 [&_[data-slot=dialog-close]]:shadow-md"
        )}
      >
        {hydrating ? (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1 rounded-t-2xl bg-sky-100"
            aria-hidden
          >
            <div className="h-full w-full animate-pulse bg-primary/70" />
          </div>
        ) : null}

        <div
          className={cn(
            "grid w-full max-w-full grid-cols-1 md:grid-cols-2 md:items-stretch",
            "max-h-[min(92vh,880px)] overflow-y-auto md:overflow-hidden"
          )}
        >
          <div
            className={cn(
              "relative isolate min-h-[240px] w-full min-w-0 shrink-0 overflow-hidden",
              "border-b border-sky-100 bg-[linear-gradient(165deg,#f8fafc_0%,#ffffff_45%,#fff7ed_100%)]",
              "md:min-h-[min(520px,85vh)] md:border-b-0 md:border-e md:border-sky-100"
            )}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="(max-width:768px) 100vw, 340px"
              className="object-contain p-7 md:p-10"
              unoptimized={imageSrcIsRemote(img)}
            />
          </div>

          <div className="relative flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto bg-white p-6 sm:p-7 md:max-h-[min(92vh,880px)]">
            {hydrating ? (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/85 backdrop-blur-[1px]">
                <Loader2 className="size-9 animate-spin text-primary" aria-hidden />
                <p className="text-sm font-medium text-sky-800">جاري تحميل خيارات المنتج…</p>
              </div>
            ) : null}

            <DialogHeader className="gap-2.5 space-y-0 text-start pe-10">
              <DialogTitle className="text-start text-lg font-bold leading-snug text-sky-950 sm:text-xl">
                {name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                نافذة سريعة لاختيار خيار المنتج وإضافته للسلة
              </DialogDescription>
              {effectiveProduct.vendor &&
              effectiveProduct.vendor.id != null &&
              String(effectiveProduct.vendor.id).trim() !== "" ? (
                <Link
                  href={ROUTES.vendor(effectiveProduct.vendor.id)}
                  className="w-fit text-[12px] font-medium text-sky-600/90 hover:text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  من {vendorDisplayName(effectiveProduct.vendor)}
                </Link>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-sky-600/90">
                  <Star className="size-3.5 fill-papaya text-papaya" aria-hidden />
                  <span className="text-xs font-medium text-sky-700/75">
                    {formatProductRating(effectiveProduct.rating)}
                    {effectiveProduct.reviews_count != null ? (
                      <span className="text-sky-500/80"> ({effectiveProduct.reviews_count})</span>
                    ) : null}
                  </span>
                </div>
                {effectiveProduct.discount_percent ? (
                  <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive">
                    −{effectiveProduct.discount_percent}%
                  </span>
                ) : null}
              </div>
            </DialogHeader>

            <div className="flex flex-wrap items-end gap-2.5 rounded-xl bg-sky-50/80 px-3 py-2.5 ring-1 ring-sky-100/90">
              <span className="text-2xl font-extrabold tabular-nums text-primary sm:text-[1.65rem]">
                {formatPrice(price)}
              </span>
              {compare != null && String(compare) !== String(price) ? (
                <span className="text-sm font-medium text-sky-400 line-through decoration-sky-300">
                  {formatPrice(compare)}
                </span>
              ) : null}
            </div>

            {blurb ? (
              <p
                className="text-[13px] leading-relaxed text-slate-600 [overflow-wrap:anywhere]"
                dir="auto"
              >
                {blurb}
              </p>
            ) : null}

            {selectedVariant?.sku ? (
              <p className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/80">
                رمز SKU: <span className="tabular-nums font-semibold text-slate-900">{selectedVariant.sku}</span>
              </p>
            ) : null}

            {showSelect ? (
              <div className="w-full space-y-2">
                <Label
                  htmlFor={`qv-variant-${listingProduct.id}`}
                  className="mb-0 block text-xs font-semibold uppercase tracking-wide text-sky-900"
                >
                  خيار المنتج
                </Label>
                <select
                  id={`qv-variant-${listingProduct.id}`}
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  disabled={hydrating}
                  className={selectClass}
                  aria-label="اختيار متغير المنتج"
                >
                  <option value="">— اختر الخيار —</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                      {v.sku ? ` · ${v.sku}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {hydrateFailed ? (
              <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-950">
                <p className="font-medium">تعذر تحميل خيارات المنتج.</p>
                {hydrateError ? <p className="text-xs text-rose-800/90">{hydrateError}</p> : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-rose-300 bg-white"
                    onClick={() => void loadDetail()}
                  >
                    إعادة المحاولة
                  </Button>
                  <Button type="button" size="sm" className="bg-primary" asChild>
                    <Link href={ROUTES.product(listingProduct.id)} onClick={() => setOpen(false)}>
                      صفحة المنتج
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}

            {readyToPurchase && !canAdd && !showSelect ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
                لا يتوفر متغير للبيع لهذا المنتج حالياً. افتح صفحة التفاصيل أو تواصل مع المتجر.
              </p>
            ) : null}

            <Separator className="my-1 bg-sky-200/70" />

            <div className="mt-auto flex flex-col gap-3 pt-2">
              <AddToCartButton
                productId={listingProduct.id}
                variantId={canAdd && readyToPurchase && !hydrating ? effectiveId : ""}
                disabled={!canAdd || !readyToPurchase || hydrating || hydrateFailed}
                onSuccess={() => setOpen(false)}
                className="h-12 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/25"
              />
              <Button variant="outline" className="h-11 w-full rounded-2xl border-sky-200/80" asChild>
                <Link href={ROUTES.product(listingProduct.id)} className="gap-2" onClick={() => setOpen(false)}>
                  <span>كل التفاصيل والمواصفات</span>
                  <ChevronLeft className="size-4 opacity-70" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
