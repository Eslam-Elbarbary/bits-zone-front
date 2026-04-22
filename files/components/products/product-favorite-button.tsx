"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleProductFavoriteAction } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { dispatchFavoritesUpdated } from "@/lib/favorite-events";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

type Variant = "icon" | "inline";

export function ProductFavoriteButton({
  productId,
  initialFavorite,
  variant = "icon",
  className,
}: {
  productId: number;
  initialFavorite?: boolean;
  variant?: Variant;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fav, setFav] = useState(!!initialFavorite);
  useEffect(() => {
    setFav(!!initialFavorite);
  }, [initialFavorite]);

  return (
    <Button
      type="button"
      variant={variant === "icon" ? "secondary" : "outline"}
      size={variant === "icon" ? "icon" : "default"}
      disabled={pending}
      className={cn(
        variant === "icon" &&
          "size-9 shrink-0 rounded-full border border-white/90 bg-white/90 shadow-md shadow-sky-900/10 hover:bg-white",
        variant === "inline" && "h-12 rounded-2xl border-sky-200/80 sm:h-14",
        className
      )}
      aria-pressed={fav}
      aria-label={fav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          const prev = fav;
          setFav(!prev);
          const r = await toggleProductFavoriteAction(String(productId));
          if (!r.ok) {
            setFav(prev);
            notify.actionError(r.error);
            return;
          }
          notify.success(prev ? "أُزيلت من المفضلة" : "أُضيفت للمفضلة");
          dispatchFavoritesUpdated();
          router.refresh();
        });
      }}
    >
      <Heart
        className={cn(
          "size-[1.15rem]",
          fav ? "fill-papaya text-papaya" : "text-sky-700"
        )}
        aria-hidden
      />
      {variant === "inline" ? (
        <span className="ms-2 font-semibold">{fav ? "في المفضلة" : "أضف للمفضلة"}</span>
      ) : null}
    </Button>
  );
}
