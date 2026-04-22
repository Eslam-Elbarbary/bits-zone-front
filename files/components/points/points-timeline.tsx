import Link from "next/link";
import { Package, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import type { PointsHistoryRow } from "@/lib/points-history";
import { formatPointsDelta, formatPointsInteger } from "@/lib/points-history";
import { cn } from "@/lib/utils";

function timeDateTimeAttr(raw: string): string {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toISOString();
}

export function PointsTimeline({ rows }: { rows: PointsHistoryRow[] }) {
  if (rows.length === 0) {
    return (
      <Card className="border-dashed border-sky-200/80 bg-gradient-to-br from-sky-50/40 via-white to-papaya/5">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-4 ring-primary/5">
            <Sparkles className="size-8" aria-hidden />
          </div>
          <div className="max-w-sm space-y-2">
            <p className="text-lg font-bold text-sky-950">لا يوجد سجل بعد</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              عند كسب أو استخدام النقاط في طلباتك ستظهر الحركات هنا بشكل مرتب.
            </p>
          </div>
          <Link
            href={ROUTES.shop}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            تصفح المنتجات
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="grid gap-3" aria-label="سجل النقاط">
      {rows.map((row) => {
        const positive = row.delta != null && row.delta > 0;
        const negative = row.delta != null && row.delta < 0;
        const neutral = row.delta === 0 || row.delta == null;

        return (
          <li key={row.key}>
            <Card
              className={cn(
                "overflow-hidden border-sky-100/90 transition-shadow hover:shadow-md",
                positive &&
                  "border-s-4 border-s-emerald-500/35 bg-gradient-to-l from-emerald-50/30 to-transparent",
                negative && "border-s-4 border-s-rose-400/35 bg-gradient-to-l from-rose-50/25 to-transparent"
              )}
            >
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ring-2 ring-white",
                      positive && "bg-emerald-500/15 text-emerald-700",
                      negative && "bg-rose-500/12 text-rose-700",
                      neutral && "bg-sky-100/80 text-sky-800"
                    )}
                    aria-hidden
                  >
                    {positive ? (
                      <TrendingUp className="size-5" />
                    ) : negative ? (
                      <TrendingDown className="size-5" />
                    ) : (
                      <Sparkles className="size-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1 text-start">
                    <p className="font-semibold leading-snug text-sky-950">{row.label}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {row.at ? (
                        <time dateTime={row.atRaw ? timeDateTimeAttr(row.atRaw) : undefined}>{row.at}</time>
                      ) : null}
                      {row.orderId ? (
                        <Link
                          href={`${ROUTES.orders}/${row.orderId}`}
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          <Package className="size-3.5 shrink-0" aria-hidden />
                          طلب #{row.orderId}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-sky-100/80 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:text-end">
                  {row.delta != null ? (
                    <span
                      className={cn(
                        "text-lg font-extrabold tabular-nums tracking-tight",
                        positive && "text-emerald-700",
                        negative && "text-rose-700",
                        neutral && "text-sky-800"
                      )}
                      dir="ltr"
                    >
                      {formatPointsDelta(row.delta)}
                      <span className="ms-1 text-xs font-semibold text-muted-foreground">نقطة</span>
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                  {row.balanceAfter != null ? (
                    <span className="text-[11px] font-medium text-muted-foreground tabular-nums" dir="ltr">
                      الرصيد بعدها: {formatPointsInteger(row.balanceAfter)}
                    </span>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
