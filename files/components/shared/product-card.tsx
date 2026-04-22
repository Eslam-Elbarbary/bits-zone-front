"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/api";
import { ROUTES } from "@/constants";
import { ProductQuickViewDialog } from "@/components/products/product-quick-view-dialog";
import { vendorDisplayName } from "@/lib/vendor-utils";
import {
  formatPrice,
  formatProductRating,
  imageSrcIsRemote,
  productDisplayName,
  productImageSrc,
} from "@/lib/product-utils";
import { ProductFavoriteButton } from "@/components/products/product-favorite-button";
import { cn } from "@/lib/utils";

type Variant = "default" | "deal";

interface ProductCardProps {
  product: Product;
  variant?: Variant;
  className?: string;
}

export function ProductCard({ product, variant = "default", className }: ProductCardProps) {
  const name = productDisplayName(product);
  const img = productImageSrc(product);
  const price = product.sale_price ?? product.price;
  const compare = product.compare_at_price;
  const isDeal = variant === "deal";
  const vendorVerified =
    product.vendor &&
    typeof product.vendor === "object" &&
    (product.vendor as { is_verified?: boolean }).is_verified === true;
  return (
    <article
      className={cn(
        "group/pc flex h-full flex-col overflow-hidden rounded-3xl border border-sky-200/45 bg-white/90 shadow-md shadow-sky-900/[0.05] ring-1 ring-white/90",
        "backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/15",
        "motion-reduce:transform-none motion-reduce:hover:translate-y-0 motion-reduce:transition-none",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sky-50 via-white to-papaya/10">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_55%)]"
          aria-hidden
        />
        <Link
          href={ROUTES.product(product.id)}
          className="absolute inset-0 z-[1]"
          aria-label={name}
        />
        <Image
          src={img}
          alt=""
          fill
          className={cn(
            "object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover/pc:scale-[1.05] motion-reduce:group-hover/pc:scale-100"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={imageSrcIsRemote(img)}
        />

        <div className="absolute start-2.5 top-2.5 z-[2] flex max-w-[80%] flex-col gap-1">
          {vendorVerified ? (
            <Badge className="w-fit rounded-lg border-0 bg-primary/95 px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm backdrop-blur-sm">
              معتمد
            </Badge>
          ) : null}
          {product.featured && !vendorVerified ? (
            <Badge className="w-fit rounded-lg border-0 bg-sky-600/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              مميز
            </Badge>
          ) : null}
          {product.discount_percent ? (
            <Badge
              variant="destructive"
              className="w-fit rounded-lg px-2 py-0.5 text-[10px] font-bold shadow-sm"
            >
              −{product.discount_percent}%
            </Badge>
          ) : null}
        </div>

        {isDeal ? (
          <Badge className="absolute end-2.5 top-2.5 z-[2] rounded-lg border-0 bg-papaya px-2.5 py-1 text-[10px] font-bold text-papaya-foreground shadow-md">
            عرض
          </Badge>
        ) : null}

        <div className="absolute bottom-3 end-3 z-[3]">
          <ProductFavoriteButton productId={product.id} initialFavorite={product.is_favorite === true} />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[2] flex justify-center bg-gradient-to-t from-sky-950/25 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover/pc:opacity-100 motion-reduce:opacity-0">
          <span className="pointer-events-none rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-sky-900 shadow-lg ring-1 ring-sky-200/60">
            عرض التفاصيل
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-sky-100/80 p-4 pt-3.5">
        <Link
          href={ROUTES.product(product.id)}
          className="line-clamp-2 min-h-[2.75rem] text-start text-[0.9375rem] font-bold leading-snug text-sky-950 transition-colors hover:text-primary"
        >
          {name}
        </Link>

        {product.vendor &&
        product.vendor.id != null &&
        String(product.vendor.id).trim() !== "" ? (
          <Link
            href={ROUTES.vendor(product.vendor.id)}
            className="line-clamp-1 text-start text-[11px] font-medium text-sky-600/90 transition-colors hover:text-primary hover:underline"
          >
            من {vendorDisplayName(product.vendor)}
          </Link>
        ) : null}

        <div className="flex items-center gap-1.5 text-sky-600/90">
          <Star className="size-3.5 fill-papaya text-papaya" aria-hidden />
          <span className="text-xs font-medium text-sky-700/75">
            {formatProductRating(product.rating)}
            {product.reviews_count != null ? (
              <span className="text-sky-500/80"> ({product.reviews_count})</span>
            ) : null}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-end gap-2 border-t border-sky-100/60 pt-3">
          <span className="text-xl font-extrabold tabular-nums text-primary">{formatPrice(price)}</span>
          {compare != null && String(compare) !== String(price) ? (
            <span className="text-sm font-medium text-sky-400 line-through decoration-sky-300">
              {formatPrice(compare)}
            </span>
          ) : null}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="h-10 flex-1 rounded-xl border-sky-200/80 bg-white/80 text-xs font-semibold text-sky-800 hover:bg-sky-50 hover:text-primary"
            asChild
          >
            <Link href={ROUTES.product(product.id)} className="gap-1">
              تفاصيل
              <ChevronLeft className="size-3.5 opacity-70" aria-hidden />
            </Link>
          </Button>
          <ProductQuickViewDialog product={product}>
            <Button
              type="button"
              className="h-10 flex-[1.15] rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
              onClick={(e) => e.stopPropagation()}
            >
              أضف للسلة
            </Button>
          </ProductQuickViewDialog>
        </div>
      </div>
    </article>
  );
}
