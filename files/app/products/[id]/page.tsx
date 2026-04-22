import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronLeft,
  Home,
  Layers,
  Package,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tag,
} from "lucide-react";
import { ProductDetailEngagement } from "@/components/products/product-detail-engagement";
import { ProductDetailGallery } from "@/components/products/product-detail-gallery";
import { ProductFavoriteButton } from "@/components/products/product-favorite-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { getProductById } from "@/lib/api";
import { categoryDisplayName, stockStatusLabel } from "@/lib/product-detail-utils";
import { extractProductFromApiResponse } from "@/lib/product-api-helpers";
import {
  formatPrice,
  formatProductRating,
  imageSrcIsRemote,
  productDisplayName,
  productGalleryImages,
  resolveImageSrc,
} from "@/lib/product-utils";
import { ProductAddToCartBlock } from "@/components/products/product-add-to-cart-block";
import { vendorDisplayName } from "@/lib/vendor-utils";
import type { Product, Vendor } from "@/types/api";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getProductById(id);
    const p = extractProductFromApiResponse(res);
    if (p) {
      return {
        title: productDisplayName(p),
        description:
          typeof p.short_description === "string"
            ? p.short_description
            : productDisplayName(p),
      };
    }
  } catch {
    /* ignore */
  }
  return { title: "تفاصيل المنتج" };
}

function Breadcrumb({
  name,
  categoryLabel,
  categoryHref,
}: {
  name: string;
  categoryLabel: string;
  categoryHref: string;
}) {
  return (
    <nav
      className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-sky-700/80"
      aria-label="مسار التنقل"
    >
      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 transition-colors hover:bg-sky-100/60 hover:text-primary"
      >
        <Home className="size-3.5 opacity-80" aria-hidden />
        الرئيسية
      </Link>
      <ChevronLeft className="size-3.5 text-sky-400" aria-hidden />
      <Link
        href={ROUTES.shop}
        className="rounded-lg px-1.5 py-0.5 transition-colors hover:bg-sky-100/60 hover:text-primary"
      >
        المتجر
      </Link>
      {categoryLabel ? (
        <>
          <ChevronLeft className="size-3.5 text-sky-400" aria-hidden />
          <Link
            href={categoryHref}
            className="max-w-[10rem] truncate rounded-lg px-1.5 py-0.5 transition-colors hover:bg-sky-100/60 hover:text-primary sm:max-w-xs"
          >
            {categoryLabel}
          </Link>
        </>
      ) : null}
      <ChevronLeft className="size-3.5 text-sky-400" aria-hidden />
      <span className="max-w-[min(100%,14rem)] truncate font-medium text-foreground sm:max-w-md">{name}</span>
    </nav>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product: Product | null = null;
  try {
    const res = await getProductById(id);
    product = extractProductFromApiResponse(res);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const name = productDisplayName(product);
  const gallery = productGalleryImages(product);
  const price = product.sale_price ?? product.price;
  const compare = product.compare_at_price;
  const showCompare =
    compare != null &&
    String(compare).trim() !== "" &&
    formatPrice(compare) !== formatPrice(price);
  const category = product.category;
  const categoryLabel = categoryDisplayName(category);
  const categoryHref =
    category?.id != null ? `${ROUTES.shop}?category_id=${category.id}` : ROUTES.shop;
  const vendor = product.vendor;
  const vendorModel = vendor && typeof vendor === "object" ? (vendor as Vendor) : null;
  const vendorVerified =
    vendorModel != null && vendorModel.is_verified === true;
  const rawVendorId = vendorModel?.id;
  const vendorStoreHref =
    rawVendorId != null && String(rawVendorId).trim() !== ""
      ? ROUTES.vendor(rawVendorId as string | number)
      : null;
  const vendorLabel = vendorModel ? vendorDisplayName(vendorModel) : "";
  const vendorImageRaw = vendorModel?.image ?? null;
  const vendorImageResolved =
    vendorImageRaw != null ? resolveImageSrc(vendorImageRaw) : null;
  const vendorImage =
    vendorImageResolved && vendorImageResolved !== "/ui/placeholder-product.svg"
      ? vendorImageResolved
      : null;
  const stockLabel = stockStatusLabel(product.stock_status);
  const sku = product.sku && String(product.sku).trim() ? String(product.sku).trim() : null;

  return (
    <div className="relative mx-auto max-w-7xl px-3 py-8 sm:px-4 md:py-12 lg:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-80 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,oklch(0.72_0.175_62/0.18),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-20 top-40 h-72 w-72 rounded-full bg-primary/[0.08] blur-3xl md:top-48"
        aria-hidden
      />

      <Breadcrumb name={name} categoryLabel={categoryLabel} categoryHref={categoryHref} />

      <article className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14">
        <ProductDetailGallery alt={name} images={gallery} />

        <div
          className={cn(
            "flex flex-col rounded-[1.75rem] border border-sky-200/50 bg-white/70 p-6 shadow-[0_24px_60px_-28px_oklch(0.58_0.145_245/0.22)] ring-1 ring-white/90",
            "backdrop-blur-xl supports-[backdrop-filter]:bg-white/58 sm:p-8"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            {product.featured ? (
              <Badge className="rounded-lg border-0 bg-gradient-to-l from-primary to-primary/85 px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground shadow-sm">
                <Sparkles className="ms-1 size-3 opacity-95" aria-hidden />
                مميز
              </Badge>
            ) : null}
            {product.discount_percent != null && product.discount_percent > 0 ? (
              <Badge
                variant="destructive"
                className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold shadow-sm"
              >
                خصم {product.discount_percent}%
              </Badge>
            ) : null}
            {stockLabel ? (
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-lg border-sky-200/60 bg-sky-50/90 text-xs font-semibold text-sky-900",
                  /غير متوفر|unavailable/i.test(stockLabel) && "border-destructive/20 bg-destructive/[0.07] text-destructive"
                )}
              >
                <Package className="ms-1 size-3.5 opacity-80" aria-hidden />
                {stockLabel}
              </Badge>
            ) : null}
            {vendorVerified ? (
              <Badge className="rounded-lg border-0 bg-emerald-600/95 px-2.5 py-0.5 text-[11px] font-bold text-white">
                <BadgeCheck className="ms-1 size-3.5" aria-hidden />
                بائع معتمد
              </Badge>
            ) : null}
          </div>

          <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-sky-950 sm:text-3xl md:text-[2rem] md:leading-snug">
            {name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {sku ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50/90 px-2.5 py-1 font-mono text-xs text-sky-800 ring-1 ring-sky-100">
                <Tag className="size-3.5 text-primary/80" aria-hidden />
                SKU: {sku}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 text-sky-800">
              <Star className="size-4 fill-papaya text-papaya" aria-hidden />
              <span className="font-semibold tabular-nums text-foreground">
                {formatProductRating(product.rating)}
              </span>
              {product.reviews_count != null ? (
                <span className="text-muted-foreground">({product.reviews_count} تقييم)</span>
              ) : null}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-sky-100/80 bg-gradient-to-l from-sky-50/50 to-papaya/10 p-4 ring-1 ring-white/60">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                السعر
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold tabular-nums text-primary sm:text-4xl">
                  {formatPrice(price)}
                </span>
                {showCompare ? (
                  <span className="text-lg font-medium text-sky-400 line-through decoration-sky-300">
                    {formatPrice(compare)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={categoryHref}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-sky-200/50 bg-white/60 p-3 text-start shadow-sm transition-all",
                "hover:border-primary/25 hover:bg-white/90 hover:shadow-md"
              )}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Layers className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground">الفئة</p>
                <p className="truncate font-semibold text-foreground">
                  {categoryLabel || "غير مصنّف"}
                </p>
                <p className="text-xs text-primary">عرض منتجات الفئة ←</p>
              </div>
            </Link>

            {vendorModel && vendorLabel.trim() ? (
              <Link
                href={vendorStoreHref ?? ROUTES.vendors}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-sky-200/50 bg-white/60 p-3 text-start shadow-sm transition-all",
                  "hover:border-primary/25 hover:bg-white/90 hover:shadow-md"
                )}
              >
                <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-50 ring-1 ring-sky-100">
                  {vendorImage ? (
                    <Image
                      src={vendorImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                      unoptimized={imageSrcIsRemote(vendorImage)}
                    />
                  ) : (
                    <Store className="size-5 text-sky-600" aria-hidden />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">البائع</p>
                  <p className="truncate font-semibold text-foreground">{vendorLabel}</p>
                  <p className="text-xs text-primary">
                    {vendorStoreHref ? "زيارة صفحة المتجر ←" : "تصفح دليل المتاجر ←"}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-sky-200/60 bg-sky-50/30 p-3 text-start">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100/50 text-sky-500">
                  <Store className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">البائع</p>
                  <p className="text-sm text-muted-foreground">لا تتوفر بيانات بائع لهذا المنتج</p>
                </div>
              </div>
            )}
          </div>

          {typeof product.short_description === "string" && product.short_description.trim() ? (
            <p className="mt-6 rounded-xl border border-sky-100/80 bg-sky-50/40 px-4 py-3 text-sm leading-relaxed text-sky-900/90">
              {product.short_description.trim()}
            </p>
          ) : null}

          <Separator className="my-8 bg-sky-100/80" />

          <div>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
              <ShoppingBag className="size-5 text-primary" aria-hidden />
              عن المنتج
            </h2>
            {typeof product.description === "string" && product.description.trim() ? (
              <div
                className={cn(
                  "prose prose-sm max-w-none text-sky-900/85 prose-headings:text-sky-950 prose-a:text-primary",
                  "prose-p:leading-relaxed prose-li:marker:text-primary"
                )}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : typeof product.short_description === "string" && product.short_description.trim() ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                لم يُضف وصف تفصيلي. يمكنك الاعتماد على الملخص أعلاه أو التواصل معنا للاستفسار.
              </p>
            ) : (
              <p className="rounded-xl border border-dashed border-sky-200/70 bg-sky-50/20 px-4 py-6 text-center text-sm text-muted-foreground">
                لا يوجد وصف مفصّل لهذا المنتج حالياً. رمز المنتج: {sku ?? product.id}
              </p>
            )}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:flex-wrap">
            <ProductAddToCartBlock
              key={product.id}
              product={product}
              className="sm:max-w-md sm:flex-1"
            />
            <ProductFavoriteButton
              productId={product.id}
              initialFavorite={product.is_favorite === true}
              variant="inline"
              className="sm:min-w-[11rem]"
            />
            <Button variant="outline" size="lg" className="h-12 rounded-2xl border-sky-200/80 sm:h-14" asChild>
              <Link href={ROUTES.shop} className="gap-2">
                <ChevronLeft className="size-4" aria-hidden />
                متابعة التسوق
              </Link>
            </Button>
          </div>

          <ProductDetailEngagement productId={product.id} productName={name} />
        </div>
      </article>
    </div>
  );
}
