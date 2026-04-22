import type { Metadata } from "next";
import { ProductSearchForm } from "@/components/search/product-search-form";

export const metadata: Metadata = {
  title: "بحث",
  description: "ابحث في المنتجات",
};

function initialSearch(sp: Record<string, string | string[] | undefined>): string {
  const v = sp.search;
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v[0]) return v[0];
  return "";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const defaultSearch = initialSearch(sp);

  return (
    <div className="relative mx-auto max-w-xl px-4 py-12 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,oklch(0.55_0.12_245/0.07)_1px,transparent_0)] bg-[length:22px_22px]"
        aria-hidden
      />
      <header className="text-center">
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          بحث المنتجات
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground md:text-base">
          اكتب ما تبحث عنه ثم انتقل إلى قائمة المنتجات المصفاة.
        </p>
      </header>
      <div className="mt-10">
        <ProductSearchForm defaultSearch={defaultSearch} />
      </div>
    </div>
  );
}
