import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronLeft, Package, Star, Store } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { extractList } from "@/lib/api-data";
import { getProducts, getVendorById } from "@/lib/api";
import { normalizeProductsList } from "@/lib/products-response";
import { imageSrcIsRemote } from "@/lib/product-utils";
import { VendorStoreLocations } from "@/components/vendors/vendor-store-locations";
import {
  extractVendorFromPayload,
  extractVendorLocations,
  formatVendorRating,
  vendorDisplayName,
  vendorHeroImage,
  vendorProductsCount,
} from "@/lib/vendor-utils";
import type { Product, Vendor } from "@/types/api";
import { cn } from "@/lib/utils";

const PREVIEW_COUNT = 8;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getVendorById(id);
    const v = extractVendorFromPayload(res.data);
    if (v) {
      const name = vendorDisplayName(v);
      return { title: `${name} — متجر`, description: `منتجات وعروض ${name}` };
    }
  } catch {
    /* fall through */
  }
  return { title: "متجر" };
}

export default async function VendorStorefrontPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let vendor: Vendor | null = null;
  try {
    const res = await getVendorById(id);
    vendor = extractVendorFromPayload(res.data);
  } catch {
    notFound();
  }

  if (!vendor) {
    notFound();
  }

  const name = vendorDisplayName(vendor);
  const hero = vendorHeroImage(vendor);
  const verified = vendor.is_verified === true;
  const countHint = vendorProductsCount(vendor);
  const shopHref = `${ROUTES.products}?vendor_id=${encodeURIComponent(String(vendor.id))}`;
  const storeLocations = extractVendorLocations(vendor);

  const desc =
    typeof vendor.description === "string" && vendor.description.trim()
      ? vendor.description.trim()
      : typeof vendor.bio === "string" && vendor.bio.trim()
        ? vendor.bio.trim()
        : null;

  let preview: Product[] = [];
  let previewNote: string | null = null;
  try {
    const pres = await getProducts({
      vendor_id: String(vendor.id),
      per_page: String(PREVIEW_COUNT),
      sort: "latest",
      page: "1",
    });
    const parsed = normalizeProductsList(pres.data, PREVIEW_COUNT);
    preview = parsed.products;
  } catch (e) {
    previewNote = e instanceof Error ? e.message : "تعذر تحميل المنتجات";
  }

  return (
    <div className="relative min-h-[50vh]">
      <div
        className={cn(
          "relative overflow-hidden border-b border-sky-100/80 bg-gradient-to-l from-sky-100/40 via-white to-papaya/10"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.72_0.175_62/0.14),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href={ROUTES.vendors} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              <ChevronLeft className="size-4 rotate-180" aria-hidden />
              كل المتاجر
            </Link>
            <span className="text-sky-300">/</span>
            <Link href={ROUTES.shop} className="font-medium text-sky-700 hover:text-primary hover:underline">
              المتجر
            </Link>
            <span className="text-sky-300">/</span>
            <span className="font-medium text-sky-900">{name}</span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-sky-50 shadow-lg ring-4 ring-sky-100/80 md:mx-0 md:size-36">
              {hero ? (
                <Image
                  src={hero}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="144px"
                  priority
                  unoptimized={imageSrcIsRemote(hero)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sky-300">
                  <Store className="size-14" aria-hidden />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 text-center md:text-start">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {verified ? (
                  <Badge className="border-0 bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    <BadgeCheck className="ms-1 size-3.5" aria-hidden />
                    بائع معتمد
                  </Badge>
                ) : null}
                <Badge variant="secondary" className="text-[11px] font-semibold">
                  متجر #{vendor.id}
                </Badge>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 md:text-4xl">{name}</h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-sky-800 md:justify-start">
                <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                  <Star className="size-4 fill-papaya text-papaya" aria-hidden />
                  {formatVendorRating(vendor)}
                </span>
                {countHint != null && countHint > 0 ? (
                  <span className="text-muted-foreground tabular-nums">{countHint} منتج تقريباً</span>
                ) : null}
              </div>
              {desc ? (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-start">{desc}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Button asChild size="lg" className="rounded-xl px-6 font-bold shadow-md">
                  <Link href={shopHref}>
                    <Package className="ms-2 size-4" aria-hidden />
                    كل منتجات هذا المتجر
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <Link href={ROUTES.vendors}>متاجر أخرى</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {storeLocations.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pb-6">
          <VendorStoreLocations locations={storeLocations} />
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-sky-950 md:text-2xl">منتجات مختارة</h2>
            <p className="mt-1 text-sm text-muted-foreground">عيّنات من أحدث ما يقدّمه المتجر في الكتالوج.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href={shopHref}>عرض الكل في المتجر</Link>
          </Button>
        </div>

        {previewNote ? (
          <p className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 text-sm text-amber-900">{previewNote}</p>
        ) : null}

        {preview.length === 0 && !previewNote ? (
          <p className="rounded-2xl border border-dashed border-sky-200/70 bg-sky-50/30 py-12 text-center text-muted-foreground">
            لا توجد منتجات معروضة لهذا المتجر في الصفحة الأولى. جرّب صفحة المتجر الكاملة.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {preview.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
