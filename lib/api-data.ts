import type { Category, Product, Slider } from "@/types/api";
import {
  getCategories,
  getProducts,
  getSliders,
} from "@/lib/api";

export function extractList<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: T[] }).data;
  }
  return [];
}

export type HomeData = {
  sliders: Slider[];
  categories: Category[];
  featured: Product[];
  latest: Product[];
  apiError: string | null;
};

export async function loadHomeData(): Promise<HomeData> {
  try {
    const [slRes, catRes, featRes, latestRes] = await Promise.all([
      getSliders(),
      getCategories(),
      getProducts({ featured: "1", per_page: "8", sort: "latest" }),
      getProducts({ per_page: "8", sort: "latest" }),
    ]);

    return {
      sliders: extractList<Slider>(slRes.data),
      categories: extractList<Category>(catRes.data),
      featured: extractList<Product>(featRes.data),
      latest: extractList<Product>(latestRes.data),
      apiError: null,
    };
  } catch (e) {
    return {
      sliders: [],
      categories: [],
      featured: [],
      latest: [],
      apiError: e instanceof Error ? e.message : "تعذر الاتصال بالخادم",
    };
  }
}
