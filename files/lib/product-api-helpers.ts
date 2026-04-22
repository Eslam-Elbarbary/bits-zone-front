import type { Product } from "@/types/api";
import { defaultCartVariantId, listProductVariants } from "@/lib/product-variants";

/** JSON:API resources often nest fields under `attributes`. */
function flattenJsonApiResource(p: Product): Product {
  const o = p as Record<string, unknown>;
  const attrs = o.attributes;
  if (attrs && typeof attrs === "object" && !Array.isArray(attrs)) {
    return { ...(attrs as Record<string, unknown>), ...o } as Product;
  }
  return p;
}

/** Merge `included` / `relationships` / `meta` from an envelope onto the product record. */
function mergeApiEnvelopeOntoProduct(envelope: Record<string, unknown>, product: Product): Product {
  const out = { ...product } as Record<string, unknown>;
  for (const k of ["included", "meta", "relationships", "links"] as const) {
    if (envelope[k] != null && out[k] == null) out[k] = envelope[k];
  }
  return flattenJsonApiResource(out as Product);
}

/** Keys often sent next to `product` on the same JSON object (Laravel resource wrappers). */
const SIBLING_VARIANT_KEYS = [
  "variants",
  "product_variants",
  "variations",
  "variant_list",
  "options",
  "variant_options",
  "stocks",
  "inventory",
  "inventories",
] as const;

const SIBLING_SCALAR_KEYS = [
  "default_variant_id",
  "variant_id",
  "first_variant_id",
  "primary_variant_id",
  "selected_variant_id",
] as const;

/** Merge variant-related fields from a parent object onto the product payload. */
function mergeSiblingFieldsIntoProduct(parent: Record<string, unknown>, product: Product): Product {
  const out = { ...product } as Record<string, unknown>;
  for (const k of SIBLING_VARIANT_KEYS) {
    const v = parent[k];
    if (v != null && out[k] == null) out[k] = v;
  }
  for (const k of SIBLING_SCALAR_KEYS) {
    const v = parent[k];
    if (v != null && out[k] == null) out[k] = v;
  }
  for (const k of ["variant", "product_variant", "default_variant", "first_variant", "selected_variant"] as const) {
    if (parent[k] != null && out[k] == null) {
      out[k] = parent[k];
    }
  }
  for (const k of ["included", "meta", "relationships", "links"] as const) {
    const v = parent[k];
    if (v != null && out[k] == null) out[k] = v;
  }
  return out as Product;
}

/** Unwraps common API envelope shapes to a `Product` (same logic as product detail page). */
export function extractProductFromApiData(data: unknown): Product | null {
  if (!data) return null;
  if (typeof data === "object" && data !== null && "id" in data) {
    return flattenJsonApiResource(data as Product);
  }
  if (
    typeof data === "object" &&
    data !== null &&
    "product" in data &&
    typeof (data as { product: unknown }).product === "object"
  ) {
    const p = (data as { product: Product }).product;
    if (p && "id" in p) {
      return flattenJsonApiResource(mergeSiblingFieldsIntoProduct(data as Record<string, unknown>, p));
    }
  }
  if (typeof data === "object" && data !== null && "data" in data) {
    const envelope = data as Record<string, unknown>;
    const inner = envelope.data;
    if (inner !== data) {
      const extracted = extractProductFromApiData(inner);
      if (!extracted) return null;
      return mergeApiEnvelopeOntoProduct(envelope, extracted);
    }
  }
  return null;
}

/**
 * Use with full `ApiEnvelope` (or any response object that has top-level `included` / `meta`).
 * Listing/detail callers should prefer this over `extractProductFromApiData(res.data)` alone.
 */
export function extractProductFromApiResponse(res: unknown): Product | null {
  if (!res || typeof res !== "object") return null;
  const envelope = res as Record<string, unknown>;
  if (!("data" in envelope)) return null;
  const extracted = extractProductFromApiData(envelope.data);
  if (!extracted) return null;
  return mergeApiEnvelopeOntoProduct(envelope, extracted);
}

/**
 * Card/list payloads often omit `variants` or default variant ids. Detail GET usually has them.
 * Fetch when we cannot add to cart from listing data alone.
 */
export function needsProductDetailHydration(product: Product): boolean {
  if (defaultCartVariantId(product)) return false;
  const n = listProductVariants(product).length;
  if (n > 1) return false;
  return true;
}
