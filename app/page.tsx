import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { CategoryCarouselBanner } from "@/components/sections/category-carousel-banner";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustStrip } from "@/components/sections/trust-strip";
import { GlassPromoRow } from "@/components/sections/glass-promo-row";
import { BrowseCategoryGrid } from "@/components/sections/browse-category-grid";
import { ProductRowSection } from "@/components/sections/product-row-section";
import { FeaturedProductsCarousel } from "@/components/sections/featured-products-carousel";
import { loadHomeData } from "@/lib/api-data";
import { PET_QUICK_CATEGORIES, ROUTES, SITE_NAME } from "@/constants";
import { dedupeProductsById, resolveImageSrc } from "@/lib/product-utils";
import type { Category } from "@/types/api";

function categoryLabel(cat: Category): string {
  if (typeof cat.name_ar === "string" && cat.name_ar.trim()) return cat.name_ar;
  return String(cat.name ?? "");
}

function buildCategoryCarouselItems(categories: Category[]) {
  if (categories.length > 0) {
    const seen = new Set<number>();
    const out: {
      id: number;
      label: string;
      href: string;
      imageUrl: string | null;
    }[] = [];
    for (const cat of categories.slice(0, 24)) {
      if (seen.has(cat.id)) continue;
      seen.add(cat.id);
      out.push({
        id: cat.id,
        label: categoryLabel(cat),
        href: `${ROUTES.shop}?category_id=${cat.id}`,
        imageUrl: cat.image != null ? resolveImageSrc(cat.image) : null,
      });
    }
    return out;
  }
  return PET_QUICK_CATEGORIES.map((c, i) => ({
    id: -(i + 1),
    label: c.label,
    href: `${ROUTES.shop}?search=${encodeURIComponent(c.label)}`,
    imageUrl: null as string | null,
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SITE_NAME,
    description:
      "PETS ZONE وجهتك الموثوقة لمستلزمات الحيوانات الأليفة في مصر: أطعمة أصلية، منتجات نظافة وعناية، ألعاب وإكسسوارات، مع شحن سريع وخدمة عملاء مميزة.",
    openGraph: {
      title: SITE_NAME,
      description:
        "تسوّق أفضل مستلزمات الحيوانات الأليفة من PETS ZONE بجودة موثوقة وأسعار مناسبة وشحن سريع داخل مصر.",
    },
  };
}

export default async function HomePage() {
  const { sliders, categories, featured, latest, apiError } = await loadHomeData();
  const featuredUnique = dedupeProductsById(featured).slice(0, 12);
  const hotDealsSource = featured.length >= 4 ? featured : latest;
  const hotDeals = dedupeProductsById(hotDealsSource).slice(0, 4);
  const latestUnique = dedupeProductsById(latest);
  const carouselItems = buildCategoryCarouselItems(categories);

  return (
    <>
      {apiError ? (
        <div className="mx-auto flex max-w-7xl items-center gap-2 border-b border-papaya/25 bg-accent px-4 py-3 text-sm text-accent-foreground">
          <AlertCircle className="size-4 shrink-0 text-papaya" aria-hidden />
          <p>
            تنبيه: لم نتمكن من تحميل البيانات من الـ API ({apiError}). تأكد من ضبط{" "}
            <code className="rounded bg-papaya/15 px-1 text-foreground">NEXT_PUBLIC_API_BASE_URL</code> في{" "}
            <code className="rounded bg-papaya/15 px-1 text-foreground">.env.local</code>.
          </p>
        </div>
      ) : null}
      <HeroSection sliders={sliders} />
      <GlassPromoRow />
      <BrowseCategoryGrid categories={categories} />
      <CategoryCarouselBanner items={carouselItems} />
      <FeaturedProductsCarousel
        title="منتجات مميزة"
        subtitle="مختارات موثوقة لعناية حيوانك — من الأكل والرمل حتى الألعاب والعلاج"
        eyebrow="مختارات المحرر"
        products={featuredUnique}
        queryHref="/products?featured=1"
      />
      <ProductRowSection
        title="عروض ساخنة"
        subtitle="فرص لا تفوّتها"
        eyebrow="وفّر الآن"
        products={hotDeals}
        variant="deal"
        className="bg-muted"
        queryHref="/products?sort=price_asc"
      />
      <ProductRowSection
        title="أحدث المنتجات"
        subtitle="وصل حديثاً إلى المتجر"
        eyebrow="وصل حديثاً"
        products={latestUnique}
        className="bg-white"
        queryHref="/products?sort=latest"
      />
      <TrustStrip />
    </>
  );
}
