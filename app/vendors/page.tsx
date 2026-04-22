import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Store } from "lucide-react";
import { VendorCard } from "@/components/vendors/vendor-card";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/shared/notice-banner";
import { ROUTES } from "@/constants";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { extractList } from "@/lib/api-data";
import { getVendors } from "@/lib/api";
import type { Vendor } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "المتاجر",
    description: "تعرّف على البائعين المعتمدين وتسوّق من متاجرهم في مكان واحد.",
  };
}

export default async function VendorsPage() {
  let vendors: Vendor[] = [];
  let message: string | null = null;

  try {
    const res = await getVendors({ per_page: "60", sort: "latest" });
    vendors = extractList<Vendor>(res.data);
  } catch (e) {
    message = e instanceof Error ? e.message : "تعذر تحميل المتاجر";
  }

  return (
    <div className="relative min-h-[60vh]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 h-64 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,oklch(0.58_0.12_245/0.12),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href={ROUTES.shop}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <ChevronLeft className="size-4 rotate-180" aria-hidden />
            المتجر
          </Link>
          <span className="text-sky-300">/</span>
          <span className="font-medium text-sky-800">المتاجر</span>
        </div>

        <header className="mb-10 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/80 px-3 py-1 text-[11px] font-semibold text-sky-800 shadow-sm">
            <Store className="size-3.5 text-primary" aria-hidden />
            سوق متعدد البائعين
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-sky-950 md:text-4xl">المتاجر والبائعون</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            اختر متجراً لعرض صفحته والتعرّف على منتجاته، ثم تسوّق من صفحة المنتجات مع تصفية تلقائية حسب البائع.
          </p>
        </header>

        {message ? (
          <NoticeBanner variant="error" title="تعذر تحميل المتاجر" className="mb-8">
            {getUserFacingErrorDescription(message)}
          </NoticeBanner>
        ) : null}

        {!message && vendors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-sky-200/80 bg-sky-50/40 px-6 py-16 text-center">
            <p className="text-muted-foreground">لا يوجد متاجر للعرض حالياً.</p>
            <Button asChild className="mt-4">
              <Link href={ROUTES.shop}>العودة للمتجر</Link>
            </Button>
          </div>
        ) : null}

        {vendors.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vendors.map((v) => (
              <li key={String(v.id)}>
                <VendorCard vendor={v} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
