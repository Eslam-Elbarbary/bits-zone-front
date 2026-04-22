import Link from "next/link";
import { ChevronLeft, Package, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import type { PointsHistoryRow } from "@/lib/points-history";
import { formatPointsDelta, formatPointsInteger, pointsActivityStats } from "@/lib/points-history";
import { cn } from "@/lib/utils";

export function ProfilePointsSnapshot({
  balance,
  rows,
  error,
}: {
  balance: number | null;
  rows: PointsHistoryRow[];
  error: string | null;
}) {
  const { earned, spent } = pointsActivityStats(rows);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/12 via-white to-papaya/10 shadow-md ring-1 ring-primary/10 sm:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="size-3.5" aria-hidden />
              الرصيد الحالي
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold tabular-nums text-sky-950" dir="ltr">
              {balance != null ? formatPointsInteger(balance) : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">نقطة ولاء متاحة</CardContent>
        </Card>
        <Card className="border-emerald-100 bg-white/95 shadow-sm sm:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-emerald-800">مكتسب (من المعروض)</CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums text-emerald-700" dir="ltr">
              {earned > 0 ? `+${formatPointsInteger(earned)}` : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-rose-100 bg-white/95 shadow-sm sm:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-rose-900/80">مستخدم (من المعروض)</CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums text-rose-700" dir="ltr">
              {spent > 0 ? `−${formatPointsInteger(spent)}` : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {error ? (
        <p className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 text-sm text-amber-900">{error}</p>
      ) : null}

      <Card className="border-sky-100/90 shadow-sm ring-1 ring-sky-50">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-sky-100/80">
          <div>
            <CardTitle className="text-lg">آخر الحركات</CardTitle>
            <CardDescription className="text-xs">آخر ما يصل من سجل النقاط</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link href={ROUTES.points} className="inline-flex items-center gap-1">
              السجل الكامل
              <ChevronLeft className="size-4 opacity-70" aria-hidden />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {rows.length === 0 && !error ? (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد حركات نقاط بعد.</p>
          ) : (
            <ul className="divide-y divide-sky-100/80">
              {rows.map((row) => {
                const up = row.delta != null && row.delta > 0;
                const down = row.delta != null && row.delta < 0;
                return (
                  <li key={row.key} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                    <div className="flex min-w-0 items-start gap-2">
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          up && "bg-emerald-500/12 text-emerald-700",
                          down && "bg-rose-500/10 text-rose-700",
                          !up && !down && "bg-sky-100/80 text-sky-800"
                        )}
                      >
                        {up ? <TrendingUp className="size-4" /> : down ? <TrendingDown className="size-4" /> : <Sparkles className="size-4" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-sky-950">{row.label}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          {row.at ? <span>{row.at}</span> : null}
                          {row.orderId ? (
                            <Link
                              href={`${ROUTES.orders}/${row.orderId}`}
                              className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                            >
                              <Package className="size-3" aria-hidden />
                              طلب #{row.orderId}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      {row.delta != null ? (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "tabular-nums font-bold",
                            up && "border-emerald-200/60 bg-emerald-50 text-emerald-800",
                            down && "border-rose-200/60 bg-rose-50 text-rose-800"
                          )}
                          dir="ltr"
                        >
                          {formatPointsDelta(row.delta)}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
