import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { PointsTimeline } from "@/components/points/points-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getPointsHistory } from "@/lib/api";
import {
  extractPointsHistoryPayload,
  formatPointsInteger,
  pointsActivityStats,
  rowsFromPointsEntries,
} from "@/lib/points-history";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سجل النقاط",
    description: "تابع رصيد نقاط الولاء وحركات الكسب والاستخدام.",
  };
}

export default async function PointsHistoryPage() {
  let authRequired = false;
  let error: string | null = null;
  let payload: unknown = null;

  try {
    const res = await getPointsHistory();
    payload = res.data;
  } catch (e) {
    authRequired = true;
    error = e instanceof Error ? e.message : null;
  }

  if (authRequired) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-sky-950">سجل النقاط</h1>
        <p className="mt-4 text-muted-foreground">
          سجّل الدخول لعرض رصيد النقاط وسجل الحركات{error ? ` (${error})` : ""}.
        </p>
        <Button asChild className="mt-6">
          <Link href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.points)}`}>تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  const { balance, entries } = extractPointsHistoryPayload(payload);
  const rows = rowsFromPointsEntries(entries);
  const { earned, spent } = pointsActivityStats(rows);

  return (
    <div className="relative min-h-[60vh]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.72_0.175_62/0.14),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href={ROUTES.profile}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <ChevronLeft className="size-4 rotate-180" aria-hidden />
            الملف الشخصي
          </Link>
          <span className="text-sky-300" aria-hidden>
            /
          </span>
          <Link href={ROUTES.wallet} className="font-medium text-sky-700 hover:text-primary hover:underline">
            المحفظة
          </Link>
          <span className="text-sky-300" aria-hidden>
            /
          </span>
          <span className="font-medium text-sky-800">سجل النقاط</span>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-sky-950 md:text-3xl">نقاط الولاء</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              رصيدك الحالي وكل حركات الكسب أو الخصم مرتبة زمنياً. يمكنك الربط مع الطلبات عند توفر رقم الطلب.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.orders}>طلباتي</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={ROUTES.shop}>تصفح المتجر</Link>
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-sky-200/60 bg-gradient-to-br from-primary/12 via-white to-papaya/10 shadow-sm ring-1 ring-sky-100/80 sm:col-span-1 sm:row-span-2 sm:min-h-[11rem]">
            <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-5 shrink-0" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-wider text-primary/90">الرصيد</span>
              </div>
              <div>
                <p
                  className={cn(
                    "text-4xl font-extrabold tabular-nums tracking-tight text-sky-950 md:text-5xl",
                    balance == null && "text-2xl text-muted-foreground md:text-3xl"
                  )}
                  dir="ltr"
                >
                  {balance != null ? formatPointsInteger(balance) : "—"}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">نقطة متاحة</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/50 bg-white/90 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-emerald-800/90">إجمالي المكتسب</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-700" dir="ltr">
                {earned > 0 ? `+${formatPointsInteger(earned)}` : "—"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">من الحركات المعروضة</p>
            </CardContent>
          </Card>

          <Card className="border-rose-200/50 bg-white/90 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-rose-900/85">إجمالي المستخدم</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-rose-700" dir="ltr">
                {spent > 0 ? `−${formatPointsInteger(spent)}` : "—"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">من الحركات المعروضة</p>
            </CardContent>
          </Card>
        </div>

        <section aria-labelledby="points-history-heading">
          <h2 id="points-history-heading" className="mb-4 text-lg font-bold text-sky-950">
            السجل
          </h2>
          <PointsTimeline rows={rows} />
        </section>
      </div>
    </div>
  );
}
