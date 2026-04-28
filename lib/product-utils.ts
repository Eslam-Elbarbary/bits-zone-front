import type { Product } from "@/types/api";

/** Same origin rules as `lib/api.ts` getBaseUrl — for resolving `/storage/...` URLs */
function getApiPublicOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";
  if (!raw) return "";
  let base = raw.replace(/\/+$/, "");
  if (base.toLowerCase().endsWith("/api")) {
    base = base.slice(0, -4).replace(/\/+$/, "");
  }
  return base;
}

/**
 * Turn API image fields into a string URL: handles strings, nested objects, and relative paths.
 */
export function extractUrlFromUnknown(value: unknown): string | null {
  if (value == null) return null;

  if (typeof value === "string") {
    const s = value.trim();
    return s || null;
  }

  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    const keys = [
      "url",
      "full_url",
      "src",
      "path",
      "link",
      "image",
      "file",
      "original_url",
    ] as const;
    for (const k of keys) {
      const nested = o[k];
      if (typeof nested === "string" && nested.trim()) {
        return nested.trim();
      }
    }
  }

  return null;
}

/** Absolute URL safe for `next/image` `src` */
export function resolveImageSrc(value: unknown): string {
  const extracted = extractUrlFromUnknown(value);
  if (!extracted) return "/ui/placeholder-product.svg";

  if (/^https?:\/\//i.test(extracted)) {
    return extracted;
  }

  if (extracted.startsWith("//")) {
    return `https:${extracted}`;
  }

  const origin = getApiPublicOrigin();
  const path = extracted.startsWith("/") ? extracted : `/${extracted}`;

  if (origin) {
    return `${origin}${path}`;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return "/ui/placeholder-product.svg";
}

function collectImageCandidates(product: Product): unknown[] {
  const candidates: unknown[] = [];
  const p = product as Record<string, unknown>;
  if (product.image != null) candidates.push(product.image);
  if (product.thumb_image != null) candidates.push(product.thumb_image);
  if (p.main_image != null) candidates.push(p.main_image);
  if (p.cover_image != null) candidates.push(p.cover_image);
  if (p.primary_image != null) candidates.push(p.primary_image);
  if (Array.isArray(product.images)) {
    for (const item of product.images) {
      candidates.push(item);
    }
  }
  if (Array.isArray(p.media)) {
    for (const item of p.media as unknown[]) {
      candidates.push(item);
    }
  }
  return candidates;
}

/** Ordered unique gallery URLs (main / gallery images). */
export function productGalleryImages(product: Product): string[] {
  const placeholder = "/ui/placeholder-product.svg";
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of collectImageCandidates(product)) {
    const extracted = extractUrlFromUnknown(c);
    if (!extracted) continue;
    const src = resolveImageSrc(extracted);
    if (src === placeholder) continue;
    if (seen.has(src)) continue;
    seen.add(src);
    out.push(src);
  }
  if (out.length === 0) out.push(placeholder);
  return out;
}

export function productImageSrc(product: Product): string {
  const gallery = productGalleryImages(product);
  return gallery[0] ?? "/ui/placeholder-product.svg";
}

export function imageSrcIsRemote(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function productDisplayName(product: Product): string {
  if (product.name_ar && String(product.name_ar).trim()) {
    return String(product.name_ar);
  }
  return String(product.name ?? "");
}

export function formatPrice(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(n);
}

/** Average rating for cards/detail; API may omit or send non-numeric values. */
export function formatProductRating(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(1);
}

/** Stable list for React keys — API may return duplicate ids. */
export function dedupeProductsById(products: Product[]): Product[] {
  const map = new Map<number, Product>();
  for (const p of products) {
    if (!map.has(p.id)) map.set(p.id, p);
  }
  return [...map.values()];
}
