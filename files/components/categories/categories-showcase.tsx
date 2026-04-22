import Link from "next/link";
import { ChevronLeft, FolderTree, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/api";
import { ROUTES } from "@/constants";
import { CategoriesSearchBar } from "@/components/categories/categories-search-bar";
import { CategoryDirectoryTile } from "@/components/categories/category-directory-tile";
import { NoticeBanner } from "@/components/shared/notice-banner";
import { SectionHeading } from "@/components/shared/section-heading";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { cn } from "@/lib/utils";

function rootCategories(cats: Category[]): Category[] {
  if (!cats.length) return [];
  const anyParent = cats.some((c) => c.parent_id != null && Number(c.parent_id) !== 0);
  if (!anyParent) return cats;
  return cats.filter((c) => c.parent_id == null || Number(c.parent_id) === 0);
}

interface CategoriesShowcaseProps {
  /** Categories to render (already filtered when searching) */
  categories: Category[];
  error: string | null;
  searchQuery: string;
  totalRoots: number;
}

export function CategoriesShowcase({
  categories,
  error,
  searchQuery,
  totalRoots,
}: CategoriesShowcaseProps) {
  return (
    <div
      className={cn(
        "relative min-h-svh overflow-hidden pb-16 pt-8 md:pb-24 md:pt-12",
        "bg-gradient-to-b from-sky-50/90 via-background to-muted/50"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,oklch(0.58_0.12_245/0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-40 top-24 size-[28rem] rounded-full bg-papaya/20 blur-3xl animate-light-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-32 bottom-32 size-80 rounded-full bg-primary/15 blur-3xl animate-light-pulse motion-reduce:animate-none [animation-delay:1.5s]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col items-center gap-6 text-center md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5" aria-hidden />
            دليل الفئات الكامل
          </div>
          <div className="max-w-2xl space-y-3">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.5rem]">
              جميع الفئات
            </h1>
            <p className="text-pretty text-sm text-muted-foreground md:text-base">
              تصفّح الفئات الرئيسية والفرعية في هيكل واحد واضح، مع بحث سريع وانتقال مباشر إلى المنتجات.
            </p>
          </div>
          <CategoriesSearchBar defaultQuery={searchQuery} />
          <Button variant="outline" size="sm" className="rounded-xl border-primary/25" asChild>
            <Link href={ROUTES.home} className="gap-1.5">
              <Home className="size-4" aria-hidden />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        {error ? (
          <NoticeBanner variant="error" title="تعذر تحميل الفئات" className="mb-8">
            {getUserFacingErrorDescription(error)}
          </NoticeBanner>
        ) : null}

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="الفئات الرئيسية"
            title="تصفح الفئات"
            subtitle={
              searchQuery
                ? `نتائج البحث: ${categories.length} من أصل ${totalRoots} فئة`
                : `${totalRoots} فئة رئيسية — اختر ما يناسبك`
            }
            className="max-w-xl"
          />
          <Button
            asChild
            className="gap-1 rounded-xl bg-primary px-5 shadow-md shadow-primary/20"
          >
            <Link href={ROUTES.products}>
              كل المنتجات
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        </div>

        {!error && categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 px-6 py-20 text-center shadow-inner backdrop-blur-sm">
            <FolderTree className="mb-4 size-14 text-muted-foreground/50" aria-hidden />
            <p className="text-lg font-medium text-foreground">لا توجد فئات مطابقة</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              جرّب كلمات أخرى أو امسح البحث لعرض كل الفئات.
            </p>
            <Button className="mt-6 rounded-xl" variant="secondary" asChild>
              <Link href={ROUTES.categories}>عرض كل الفئات</Link>
            </Button>
          </div>
        ) : null}

        {!error && categories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, index) => (
              <CategoryDirectoryTile key={`dir-${cat.id}-${index}`} cat={cat} index={index} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Server helper: roots + optional search */
export function prepareCategoryDirectoryList(
  all: Category[],
  searchQuery: string
): { roots: Category[]; filtered: Category[]; totalRoots: number } {
  const roots = rootCategories(all);
  const q = searchQuery.trim();
  const filtered = q
    ? roots.filter((c) => {
        const t = (
          (typeof c.name_ar === "string" ? c.name_ar : "") +
          " " +
          String(c.name ?? "")
        )
          .toLowerCase();
        return t.includes(q.toLowerCase());
      })
    : roots;
  return { roots, filtered, totalRoots: roots.length };
}
