"use client";

import { useEffect, useMemo, useState } from "react";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Label } from "@/components/ui/label";
import { cartVariantIdForProduct, listProductVariants } from "@/lib/product-variants";
import type { Product } from "@/types/api";
import { cn } from "@/lib/utils";

const selectClass = cn(
  "flex h-11 w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-sm shadow-sm",
  "ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
);

export function ProductAddToCartBlock({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const variants = useMemo(() => listProductVariants(product), [product]);
  const preset = useMemo(() => cartVariantIdForProduct(product), [product]);

  const [selected, setSelected] = useState(() => {
    if (preset) return preset;
    if (variants.length === 1) return variants[0].id;
    return "";
  });

  useEffect(() => {
    setSelected((prev) => {
      if (preset) return preset;
      if (variants.length === 1) return variants[0].id;
      if (prev && variants.some((v) => v.id === prev)) return prev;
      return "";
    });
  }, [preset, variants]);

  const effectiveId =
    selected.trim() || preset || (variants.length === 1 ? variants[0].id : "");

  const showSelect = variants.length > 1;
  const canAdd = effectiveId.length > 0;

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {showSelect ? (
        <div className="w-full">
          <Label
            htmlFor="product-variant-select"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            خيار المنتج
          </Label>
          <select
            id="product-variant-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
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

      {!canAdd && !showSelect ? (
        <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm text-amber-950">
          لا يتوفر معرّف متغير لهذا المنتج من الخادم. جرّب تحديث الصفحة أو التواصل مع الدعم.
        </p>
      ) : null}

      <AddToCartButton
        productId={product.id}
        variantId={canAdd ? effectiveId : ""}
        disabled={!canAdd}
        className="h-12 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/25 sm:h-14"
      />
    </div>
  );
}
