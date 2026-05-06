"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { addToCartAction } from "@/app/actions/cart";
import { dispatchCartUpdated } from "@/lib/cart-events";
import { cn } from "@/lib/utils";

function friendlyCartError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("variant") && m.includes("required")) {
    return "يجب اختيار خيار المنتج (المتغير) أو التأكد من توفر بيانات المتغير من الخادم.";
  }
  return message;
}

interface AddToCartButtonProps {
  productId: number;
  /** Sent as multipart `variant_id` — required by the cart API. */
  variantId: string;
  disabled?: boolean;
  className?: string;
  /** Called after a successful add (e.g. close quick-view dialog). */
  onSuccess?: () => void;
}

export function AddToCartButton({
  productId,
  variantId,
  disabled = false,
  className,
  onSuccess,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const resolved = String(variantId ?? "").trim();
  const canAdd = resolved.length > 0 && !disabled;

  return (
    <Button
      type="button"
      disabled={pending || !canAdd}
      title={!canAdd && !pending ? "اختر خيار المنتج من صفحة التفاصيل إن لزم" : undefined}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "shadow-sm transition-[box-shadow,transform] duration-200 hover:shadow-md active:scale-[0.98]",
        "motion-reduce:active:scale-100",
        className
      )}
      onClick={() => {
        if (!canAdd) return;
        startTransition(async () => {
          const result = await addToCartAction(String(productId), resolved);
          if (result.ok) {
            notify.success("تمت إضافة المنتج للسلة");
            dispatchCartUpdated();
            router.refresh();
            onSuccess?.();
          } else {
            notify.error(friendlyCartError(result.error));
          }
        });
      }}
    >
      {pending ? "جاري الإضافة..." : "أضف للسلة"}
    </Button>
  );
}
