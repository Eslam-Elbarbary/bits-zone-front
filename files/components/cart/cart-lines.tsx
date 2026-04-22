"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import {
  lineDisplayTitle,
  lineProductId,
  lineQuantity,
  lineUnitPrice,
  lineVariantId,
  parseCartMoney,
} from "@/lib/cart-utils";
import { formatPrice, imageSrcIsRemote } from "@/lib/product-utils";
import { notify, alert } from "@/lib/notify";
import { removeCartItemAction, updateCartQuantityAction } from "@/app/actions/cart";
import { dispatchCartUpdated } from "@/lib/cart-events";

export type CartDisplayLine = { line: unknown; imageSrc: string };

export type CartLiveSummaryProps = {
  tax?: number | string;
  shipping?: number | string;
  discount?: number | string;
  couponLabel?: string | null;
};

type RowState = {
  key: string;
  line: unknown;
  imageSrc: string;
  qty: number;
};

const SYNC_DEBOUNCE_MS = 420;

function lineSubtotal(line: unknown, qty: number): number | null {
  const u = lineUnitPrice(line);
  if (u == null) return null;
  const un = typeof u === "number" ? u : parseFloat(String(u));
  if (!Number.isFinite(un)) return null;
  return un * qty;
}

function sumRowsSubtotal(rows: RowState[]): number {
  return rows.reduce((acc, r) => acc + (lineSubtotal(r.line, r.qty) ?? 0), 0);
}

export function CartLines({
  displayLines,
  liveSummary,
}: {
  displayLines: CartDisplayLine[];
  liveSummary?: CartLiveSummaryProps;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const syncTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const serverSig = useMemo(
    () =>
      displayLines
        .map(({ line }) => `${lineProductId(line)}|${lineVariantId(line) ?? ""}|${lineQuantity(line)}`)
        .join(";"),
    [displayLines]
  );

  const displayLinesRef = useRef(displayLines);
  displayLinesRef.current = displayLines;

  const [rows, setRows] = useState<RowState[]>(() =>
    displayLines.map(({ line, imageSrc }) => ({
      key: `${lineProductId(line)}-${lineVariantId(line) ?? "x"}`,
      line,
      imageSrc,
      qty: lineQuantity(line),
    }))
  );

  /** Only reset local rows when server cart data changes (not on every RSC re-render). */
  useEffect(() => {
    const dl = displayLinesRef.current;
    setRows(
      dl.map(({ line, imageSrc }) => ({
        key: `${lineProductId(line)}-${lineVariantId(line) ?? "x"}`,
        line,
        imageSrc,
        qty: lineQuantity(line),
      }))
    );
  }, [serverSig]);

  const scheduleQuantitySync = useCallback(
    (key: string, productId: string, variantId: string | undefined, nextQty: number) => {
      if (syncTimers.current[key]) {
        clearTimeout(syncTimers.current[key]);
      }
      syncTimers.current[key] = setTimeout(() => {
        delete syncTimers.current[key];
        startTransition(async () => {
          try {
            await updateCartQuantityAction(productId, nextQty, variantId);
            dispatchCartUpdated();
          } catch (err) {
            notify.actionError(err instanceof Error ? err.message : "فشل تحديث الكمية");
            router.refresh();
          }
        });
      }, SYNC_DEBOUNCE_MS);
    },
    [router, startTransition]
  );

  useEffect(() => {
    return () => {
      Object.values(syncTimers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const liveSubtotal = useMemo(() => sumRowsSubtotal(rows), [rows]);

  const liveGrand = useMemo(() => {
    if (!liveSummary) return liveSubtotal;
    const tax = parseCartMoney(liveSummary.tax) ?? 0;
    const ship = parseCartMoney(liveSummary.shipping) ?? 0;
    const disc = parseCartMoney(liveSummary.discount) ?? 0;
    return liveSubtotal - Math.abs(disc) + tax + ship;
  }, [liveSubtotal, liveSummary]);

  if (displayLines.length === 0) {
    return (
      <p className="rounded-2xl border border-sky-100/80 bg-card/90 p-10 text-center text-muted-foreground shadow-sm">
        السلة فارغة.{" "}
        <Link href={ROUTES.shop} className="font-semibold text-primary hover:underline">
          تابع التسوق
        </Link>
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-sky-100/90 overflow-hidden rounded-2xl border border-sky-200/50 bg-card shadow-sm ring-1 ring-sky-50/80">
        {rows.map((row, idx) => {
          const pid = lineProductId(row.line);
          const vid = lineVariantId(row.line);
          const title = lineDisplayTitle(row.line);
          const unit = lineUnitPrice(row.line);
          const rowTotal = lineSubtotal(row.line, row.qty);

          if (!pid) {
            return (
              <li key={idx} className="flex gap-4 p-5">
                <p className="text-sm text-muted-foreground">عنصر غير معروف في السلة</p>
              </li>
            );
          }

          return (
            <li
              key={row.key}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5"
            >
              <Link
                href={ROUTES.product(pid)}
                className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-sky-50/80 to-muted ring-1 ring-sky-100/60 sm:size-32"
              >
                <Image
                  src={row.imageSrc}
                  alt=""
                  fill
                  className="object-contain p-2"
                  sizes="(max-width:640px)112px,128px"
                  unoptimized={imageSrcIsRemote(row.imageSrc)}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div>
                  <Link
                    href={ROUTES.product(pid)}
                    className="text-base font-bold leading-snug text-sky-950 hover:text-primary hover:underline sm:text-lg"
                  >
                    {title}
                  </Link>
                  <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
                    {unit != null ? (
                      <div className="text-sm">
                        <span className="text-muted-foreground">سعر الوحدة </span>
                        <span className="font-semibold tabular-nums text-sky-900">
                          {formatPrice(unit)}
                        </span>
                      </div>
                    ) : null}
                    {rowTotal != null ? (
                      <div className="text-sm">
                        <span className="text-muted-foreground">المجموع </span>
                        <span className="text-lg font-extrabold tabular-nums text-primary">
                          {formatPrice(rowTotal)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">الكمية</span>
                    <input
                      type="number"
                      min={1}
                      value={row.qty}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "") {
                          setRows((prev) =>
                            prev.map((r) => (r.key === row.key ? { ...r, qty: 1 } : r))
                          );
                          scheduleQuantitySync(row.key, pid, vid, 1);
                          return;
                        }
                        const raw = parseInt(v, 10);
                        const next = Number.isNaN(raw) ? 1 : Math.max(1, raw);
                        setRows((prev) =>
                          prev.map((r) => (r.key === row.key ? { ...r, qty: next } : r))
                        );
                        scheduleQuantitySync(row.key, pid, vid, next);
                      }}
                      className="h-10 w-20 rounded-xl border border-input bg-background px-2 text-center text-sm font-semibold tabular-nums shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                      disabled={pending}
                      aria-label="الكمية"
                    />
                  </label>
                </div>
              </div>

              <div className="flex shrink-0 justify-end sm:flex-col sm:justify-start">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full border-rose-200/80 text-rose-600 hover:bg-rose-50"
                  disabled={pending}
                  aria-label="حذف من السلة"
                  onClick={async () => {
                    const ok = await alert.confirm({
                      title: "حذف المنتج؟",
                      text: "سيتم إزالة هذا المنتج من السلة.",
                      confirmText: "حذف",
                      cancelText: "إلغاء",
                    });
                    if (!ok) return;
                    setRows((prev) => prev.filter((r) => r.key !== row.key));
                    startTransition(async () => {
                      try {
                        await removeCartItemAction(pid, vid);
                        notify.success("تم الحذف");
                        dispatchCartUpdated();
                        router.refresh();
                      } catch (err) {
                        notify.actionError(err instanceof Error ? err.message : "فشل الحذف");
                        router.refresh();
                      }
                    });
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {liveSummary ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-sky-200/50 bg-gradient-to-br from-card via-card to-sky-50/30 p-6 shadow-md ring-1 ring-sky-100/50">
          <h2 className="text-lg font-bold text-sky-950">ملخص السلة</h2>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span className="tabular-nums font-semibold text-sky-900">{formatPrice(liveSubtotal)}</span>
          </div>
          {liveSummary.shipping != null && String(liveSummary.shipping).trim() !== "" ? (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">الشحن</span>
              <span className="tabular-nums font-medium">{formatPrice(liveSummary.shipping)}</span>
            </div>
          ) : null}
          {liveSummary.tax != null && String(liveSummary.tax).trim() !== "" ? (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">الضريبة</span>
              <span className="tabular-nums font-medium">{formatPrice(liveSummary.tax)}</span>
            </div>
          ) : null}
          {liveSummary.couponLabel ? (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-primary">
              <span>كوبون مطبّق</span>
              <span className="font-mono text-xs font-semibold" dir="ltr">
                {liveSummary.couponLabel}
              </span>
            </div>
          ) : null}
          {(() => {
            const d = liveSummary.discount;
            if (d == null || String(d).trim() === "") return null;
            const dNum = typeof d === "number" ? d : parseFloat(String(d));
            if (!Number.isFinite(dNum) || dNum === 0) return null;
            return (
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <span>الخصم</span>
                <span className="tabular-nums font-medium">−{formatPrice(Math.abs(dNum))}</span>
              </div>
            );
          })()}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sky-200/70 pt-4 text-lg">
            <span className="font-bold text-sky-950">الإجمالي</span>
            <span className="tabular-nums font-extrabold text-primary">{formatPrice(liveGrand)}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
