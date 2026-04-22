import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Wallet } from "lucide-react";
import { WalletTimeline } from "@/components/wallet/wallet-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getWalletHistory } from "@/lib/api";
import { formatPrice } from "@/lib/product-utils";
import {
  extractWalletHistoryPayload,
  rowsFromWalletEntries,
  walletActivityStats,
} from "@/lib/wallet-history";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سجل المحفظة",
    description: "رصيد المحفظة وحركات الإيداع والسحب بالريال.",
  };
}

export default async function WalletHistoryPage() {
  let authRequired = false;
  let error: string | null = null;
  let payload: unknown = null;

  try {
    const res = await getWalletHistory();
    payload = res.data;
  } catch (e) {
    authRequired = true;
    error = e instanceof Error ? e.message : null;
  }

  if (authRequired) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-sky-950">سجل المحفظة</h1>
        <p className="mt-4 text-muted-foreground">
          سجّل الدخول لعرض رصيد المحفظة والحركات{error ? ` (${error})` : ""}.
        </p>
        <Button asChild className="mt-6">
          <Link href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.wallet)}`}>تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  const { balance, entries } = extractWalletHistoryPayload(payload);
  const rows = rowsFromWalletEntries(entries);
  const { credited, debited } = walletActivityStats(rows);

  return (
    <div className="relative min-h-[60vh]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.65_0.14_160/0.12),transparent)]"
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
          <Link href={ROUTES.points} className="font-medium text-sky-700 hover:text-primary hover:underline">
            سجل النقاط
          </Link>
          <span className="text-sky-300" aria-hidden>
            /
          </span>
          <span className="font-medium text-sky-800">المحفظة</span>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-sky-950 md:text-3xl">المحفظة</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              رصيدك بالريال السعودي وآخر الحركات: شحن رصيد، خصم من طلب، أو استرجاع. يمكنك فتح الطلب المرتبط عند
              توفر رقمه.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.orders}>طلباتي</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href={ROUTES.checkout}>إتمام الطلب</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={ROUTES.shop}>تصفح المتجر</Link>
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-500/10 via-white to-sky-50/40 shadow-md ring-1 ring-emerald-100/50 sm:col-span-1 sm:row-span-2 sm:min-h-[11rem]">
            <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
              <div className="flex items-center gap-2 text-emerald-800">
                <Wallet className="size-5 shrink-0" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800/90">الرصيد</span>
              </div>
              <div>
                <p
                  className={cn(
                    "text-3xl font-extrabold tabular-nums tracking-tight text-sky-950 md:text-4xl",
                    balance == null && "text-2xl text-muted-foreground md:text-3xl"
                  )}
                  dir="ltr"
                >
                  {balance != null ? formatPrice(balance) : "—"}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">رصيد متاح (تقريبي)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/40 bg-white/95 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-emerald-800/90">إجمالي الإيداعات (من المعروض)</p>
              <p className="mt-2 text-xl font-bold tabular-nums text-emerald-700 md:text-2xl" dir="ltr">
                {credited > 0 ? formatPrice(credited) : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200/40 bg-white/95 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-rose-900/85">إجمالي الخصومات (من المعروض)</p>
              <p className="mt-2 text-xl font-bold tabular-nums text-rose-700 md:text-2xl" dir="ltr">
                {debited > 0 ? formatPrice(debited) : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        <section aria-labelledby="wallet-history-heading">
          <h2 id="wallet-history-heading" className="mb-4 text-lg font-bold text-sky-950">
            السجل
          </h2>
          <WalletTimeline rows={rows} />
        </section>
      </div>
    </div>
  );
}
