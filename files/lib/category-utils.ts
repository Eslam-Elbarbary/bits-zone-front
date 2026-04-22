import type { Category } from "@/types/api";

export function categoryDisplayName(cat: Category): string {
  if (typeof cat.name_ar === "string" && cat.name_ar.trim()) return cat.name_ar;
  return String(cat.name ?? "");
}

/** Flat list for filters: roots + one level of children with parent prefix. */
export function flattenCategoriesForFilter(categories: Category[]): { id: number; label: string }[] {
  const out: { id: number; label: string }[] = [];
  for (const c of categories) {
    out.push({ id: c.id, label: categoryDisplayName(c) });
    const kids = Array.isArray(c.children) ? c.children : [];
    for (const k of kids) {
      out.push({
        id: k.id,
        label: `${categoryDisplayName(c)} › ${categoryDisplayName(k)}`,
      });
    }
  }
  return out;
}
