import type { Metadata } from "next";
import {
  CategoriesShowcase,
  prepareCategoryDirectoryList,
} from "@/components/categories/categories-showcase";
import { extractList } from "@/lib/api-data";
import { getCategories } from "@/lib/api";
import { SITE_NAME } from "@/constants";
import type { Category } from "@/types/api";

export const metadata: Metadata = {
  title: "جميع الفئات",
  description: `تصفح كل فئات ${SITE_NAME} — بحث سريع وروابط مباشرة للمنتجات.`,
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qRaw = sp.q;
  const searchQuery = typeof qRaw === "string" ? qRaw.trim() : "";

  let all: Category[] = [];
  let error: string | null = null;

  try {
    const res = await getCategories({ per_page: "250", sort: "latest" });
    all = extractList<Category>(res.data);
  } catch (e) {
    error = e instanceof Error ? e.message : "تعذر تحميل الفئات";
  }

  const { filtered, totalRoots } = prepareCategoryDirectoryList(all, searchQuery);

  return (
    <CategoriesShowcase
      categories={filtered}
      totalRoots={totalRoots}
      searchQuery={searchQuery}
      error={error}
    />
  );
}
