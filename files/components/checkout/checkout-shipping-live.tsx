"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

export function CheckoutShippingLive({
  initialTotal,
  initialError,
}: {
  initialTotal: number | null;
  initialError?: string | null;
}) {
  const [total, setTotal] = useState<number | null>(initialTotal);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(initialError ?? null);

  const fetchShip = useCallback(async (addressId: string) => {
    if (!addressId.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/checkout/shipping-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_id: parseInt(addressId, 10) }),
      });
      const j = (await r.json()) as { ok?: boolean; message?: string; total_shipping?: number | null };
      if (!j.ok) {
        setErr(typeof j.message === "string" ? j.message : "تعذر حساب الشحن");
        setTotal(null);
        return;
      }
      const t = j.total_shipping;
      setTotal(typeof t === "number" && Number.isFinite(t) ? t : null);
    } catch {
      setErr("تعذر الاتصال بالخادم");
      setTotal(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sel = document.querySelector<HTMLSelectElement>('select[name="address_id"]');
    if (!sel) return;
    const onChange = () => fetchShip(sel.value);
    sel.addEventListener("change", onChange);
    return () => sel.removeEventListener("change", onChange);
  }, [fetchShip]);

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm shadow-sm",
        err
          ? "border-amber-200/80 bg-amber-50/40 ring-1 ring-amber-100/60"
          : "border-sky-100/80 bg-gradient-to-l from-sky-50/50 to-white ring-1 ring-sky-100/50"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-sky-800/90">تقدير الشحن</span>
        {loading ? (
          <span className="text-[11px] font-medium text-primary animate-pulse">جاري التحديث…</span>
        ) : null}
      </div>
      {err ? (
        <p className="mt-1 text-sm font-medium text-amber-900">{err}</p>
      ) : (
        <p className="mt-2 text-xl font-extrabold tabular-nums text-primary" dir="ltr">
          {total != null ? formatPrice(total) : "—"}
        </p>
      )}
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        يُحسب تلقائياً عند تغيير عنوان التوصيل. المبلغ النهائي قد يُحدَّث عند تأكيد الطلب.
      </p>
    </div>
  );
}
