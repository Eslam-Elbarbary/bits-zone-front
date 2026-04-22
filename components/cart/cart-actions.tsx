"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Tag, Trash2 } from "lucide-react";
import { applyCouponAction, clearCartAction } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dispatchCartUpdated } from "@/lib/cart-events";
import { notify, alert } from "@/lib/notify";

export function CartActions() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pendingCoupon, startCoupon] = useTransition();
  const [pendingClear, startClear] = useTransition();

  return (
    <div className="mt-6 grid gap-6 rounded-2xl border border-sky-200/50 bg-card/60 p-5 shadow-sm sm:grid-cols-2 sm:items-start">
      <div>
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Tag className="size-4 text-primary" aria-hidden />
          كوبون الخصم
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">أدخل كود الخصم ثم اضغط تطبيق.</p>
        <form
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            startCoupon(async () => {
              try {
                await applyCouponAction(code);
                notify.success("تم تطبيق الكوبون");
                setCode("");
                dispatchCartUpdated();
                router.refresh();
              } catch (err) {
                notify.actionError(err instanceof Error ? err.message : "تعذر تطبيق الكوبون");
              }
            });
          }}
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <Label htmlFor="cart-coupon-code" className="sr-only">
              كود الكوبون
            </Label>
            <Input
              id="cart-coupon-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="أدخل الكود"
              dir="ltr"
              className="text-start"
              disabled={pendingCoupon}
            />
          </div>
          <Button type="submit" disabled={pendingCoupon || !code.trim()} className="shrink-0">
            {pendingCoupon ? "جاري التطبيق…" : "تطبيق"}
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-destructive/15 bg-destructive/[0.04] p-4">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Trash2 className="size-4 text-destructive" aria-hidden />
          تفريغ السلة
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">يزيل جميع المنتجات من السلة.</p>
        <Button
          type="button"
          variant="destructive"
          className="w-full sm:w-auto"
          disabled={pendingClear}
          onClick={async () => {
            const ok = await alert.confirm({
              title: "تفريغ السلة؟",
              text: "سيتم إزالة جميع المنتجات من السلة.",
              confirmText: "تفريغ",
              cancelText: "إلغاء",
            });
            if (!ok) return;
            startClear(async () => {
              try {
                await clearCartAction();
                notify.success("تم تفريغ السلة");
                dispatchCartUpdated();
                router.refresh();
              } catch (err) {
                notify.actionError(err instanceof Error ? err.message : "تعذر تفريغ السلة");
              }
            });
          }}
        >
          {pendingClear ? "جاري التفريغ…" : "تفريغ السلة بالكامل"}
        </Button>
      </div>
    </div>
  );
}
