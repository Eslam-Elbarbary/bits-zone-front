import type { Category } from "@/types/api";

const PLACEHOLDER = "/ui/placeholder-product.svg";

export function categoryDisplayName(category: Category | undefined | null): string {
  if (!category) return "";
  const ar = category.name_ar;
  if (ar && String(ar).trim()) return String(ar).trim();
  return String(category.name ?? "").trim();
}

/** Map common API stock tokens to readable Arabic. */
export function stockStatusLabel(raw: string | undefined | null): string {
  if (!raw) return "";
  const s = String(raw).toLowerCase().replace(/-/g, "_");
  const map: Record<string, string> = {
    in_stock: "متوفر",
    instock: "متوفر",
    available: "متوفر",
    out_of_stock: "غير متوفر",
    outofstock: "غير متوفر",
    unavailable: "غير متوفر",
    on_backorder: "طلب مسبق",
    backorder: "طلب مسبق",
    preorder: "طلب مسبق",
  };
  return map[s] ?? raw;
}

export function productHasRealGallery(images: string[]): boolean {
  return images.length > 1 || (images.length === 1 && images[0] !== PLACEHOLDER);
}
