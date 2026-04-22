import type { Product } from "@/types/api";

export interface NormalizedVariant {
  id: string;
  label: string;
  sku?: string | null;
  /** Present when API sends per-variant pricing */
  price?: number | string | null;
  sale_price?: number | string | null;
  compare_at_price?: number | string | null;
}

function coerceArray(raw: unknown): unknown[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object" && raw !== null && "data" in raw && Array.isArray((raw as { data: unknown }).data)) {
    return (raw as { data: unknown[] }).data;
  }
  return [];
}

/** Some APIs return `{ "1": {...}, "2": {...} }` instead of an array. */
function coerceVariantRows(raw: unknown): unknown[] {
  const fromArr = coerceArray(raw);
  if (fromArr.length > 0) return fromArr;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const vals = Object.values(raw as Record<string, unknown>);
    if (
      vals.length > 0 &&
      vals.every((v) => v !== null && typeof v === "object" && !Array.isArray(v))
    ) {
      return vals;
    }
  }
  return [];
}

function coerceScalarPrice(v: unknown): number | string | null {
  if (v == null) return null;
  if (typeof v === "number" || typeof v === "string") return v;
  return null;
}

function normalizeRow(v: unknown): NormalizedVariant | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const attrs =
    o.attributes && typeof o.attributes === "object" && !Array.isArray(o.attributes)
      ? (o.attributes as Record<string, unknown>)
      : null;
  let id: unknown =
    o.id ??
    o.variant_id ??
    o.product_variant_id ??
    o.variation_id ??
    o.product_variants_id;
  if ((id == null || String(id).trim() === "") && attrs) {
    id =
      attrs.id ??
      attrs.variant_id ??
      attrs.product_variant_id ??
      attrs.variation_id ??
      id;
  }
  if ((id == null || String(id).trim() === "") && o.pivot && typeof o.pivot === "object") {
    const pv = o.pivot as Record<string, unknown>;
    id = pv.product_variant_id ?? pv.variant_id ?? pv.id;
  }
  if (id == null || String(id).trim() === "") return null;
  const labelRaw = o.name ?? o.title ?? o.label ?? o.sku ?? attrs?.name ?? attrs?.title ?? attrs?.sku;
  const label =
    typeof labelRaw === "string" && labelRaw.trim()
      ? labelRaw.trim()
      : typeof o.sku === "string" && o.sku.trim()
        ? String(o.sku)
        : typeof attrs?.sku === "string" && attrs.sku.trim()
          ? String(attrs.sku)
          : `خيار ${id}`;
  const skuRaw = o.sku ?? attrs?.sku;
  return {
    id: String(id),
    label,
    sku: skuRaw != null ? String(skuRaw) : null,
    price: coerceScalarPrice(o.price ?? o.regular_price ?? attrs?.price ?? attrs?.regular_price),
    sale_price: coerceScalarPrice(o.sale_price ?? o.discounted_price ?? attrs?.sale_price),
    compare_at_price: coerceScalarPrice(
      o.compare_at_price ?? o.compare_price ?? attrs?.compare_at_price ?? attrs?.compare_price
    ),
  };
}

/** JSON:API-style `relationships.variants.data` (and similar). */
function extractFromRelationships(p: Record<string, unknown>): unknown[] {
  const rel = p.relationships;
  if (!rel || typeof rel !== "object") return [];
  const r = rel as Record<string, unknown>;
  const out: unknown[] = [];
  for (const key of [
    "variants",
    "product_variants",
    "productVariants",
    "ProductVariant",
    "variant",
  ]) {
    const node = r[key];
    if (!node || typeof node !== "object") continue;
    const data = (node as Record<string, unknown>).data;
    if (Array.isArray(data)) out.push(...data);
    else if (data && typeof data === "object") out.push(data);
  }
  return out;
}

/** JSON:API `included` entries that look like product variants. */
function extractFromIncluded(p: Record<string, unknown>): unknown[] {
  const inc = p.included;
  if (!Array.isArray(inc)) return [];
  return inc.filter((item) => {
    if (!item || typeof item !== "object") return false;
    const o = item as Record<string, unknown>;
    const typ = o.type;
    if (typeof typ === "string") {
      const t = typ.toLowerCase();
      if (t.includes("variant") || t.includes("sku")) return true;
    }
    return normalizeRow(item) !== null;
  });
}

/** Collect variant rows from common Laravel / multi-vendor API shapes. */
export function listProductVariants(product: Product): NormalizedVariant[] {
  const p = product as Record<string, unknown>;
  const keys = [
    "variants",
    "product_variants",
    "variations",
    "variant_list",
    "options",
    "variant_options",
    "inventory_variants",
    "skus",
    "stocks",
    "inventory",
    "inventories",
    "items",
    "lines",
    "rows",
    "all_variants",
    "sellable_variants",
    "active_variants",
    "default_variants",
  ];

  const seen = new Set<string>();
  const out: NormalizedVariant[] = [];

  function add(rows: NormalizedVariant[]) {
    for (const row of rows) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      out.push(row);
    }
  }

  add(
    extractFromRelationships(p)
      .map(normalizeRow)
      .filter((x): x is NormalizedVariant => x !== null)
  );
  add(
    extractFromIncluded(p)
      .map(normalizeRow)
      .filter((x): x is NormalizedVariant => x !== null)
  );

  const singleArr = p.variant;
  if (Array.isArray(singleArr) && singleArr.length > 0) {
    add(
      singleArr
        .map(normalizeRow)
        .filter((x): x is NormalizedVariant => x !== null)
    );
  }

  for (const k of keys) {
    const rows = coerceVariantRows(p[k])
      .map(normalizeRow)
      .filter((x): x is NormalizedVariant => x !== null);
    add(rows);
  }

  return out;
}

function singularVariantId(product: Product): string | null {
  const p = product as Record<string, unknown>;
  const keys = [
    "variant",
    "product_variant",
    "default_variant",
    "first_variant",
    "selected_variant",
    "sellable_variant",
    "active_variant",
    "main_variant",
    "min_price_variant",
    "cheapest_variant",
    "primary_variant",
  ] as const;
  for (const key of keys) {
    const v = p[key];
    if (Array.isArray(v) && v.length === 1) {
      const row = normalizeRow(v[0]);
      if (row) return row.id;
      continue;
    }
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    const id = o.id ?? o.variant_id ?? o.product_variant_id;
    if (id != null && String(id).trim() !== "") return String(id);
  }
  return null;
}

/**
 * Resolves `variant_id` for POST /api/cart/:productId (multipart).
 * Returns null when the customer must choose among multiple variants.
 */
function metaVariantId(p: Record<string, unknown>): string | null {
  const meta = p.meta;
  if (!meta || typeof meta !== "object") return null;
  const m = meta as Record<string, unknown>;
  for (const key of [
    "default_variant_id",
    "variant_id",
    "sellable_variant_id",
    "active_variant_id",
    "cart_variant_id",
  ]) {
    const v = m[key];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return null;
}

/** Some APIs expose `*_variant_id` only on custom keys. */
function dynamicVariantIdKeys(p: Record<string, unknown>): string | null {
  for (const [k, v] of Object.entries(p)) {
    if (!/_?variant_?id$/i.test(k) && !/^variant$/i.test(k)) continue;
    if (k === "variant_id" || k === "default_variant_id") continue;
    if (v != null && String(v).trim() !== "" && typeof v !== "object") return String(v);
  }
  return null;
}

/** Subtrees unlikely to hold the cart `variant_id` — avoid false positives from unrelated nested ids. */
const DEEP_SCAN_SKIP_KEYS = new Set([
  "vendor",
  "category",
  "user",
  "seller",
  "reviews",
  "images",
  "media",
  "description",
  "short_description",
  "name",
  "name_ar",
]);

/**
 * Laravel APIs often nest the sellable variant id under `stock`, `inventory`, `offer`, etc.
 * Shallow helpers miss these; collect scalar `*_variant_id` fields up to a limited depth.
 */
function deepCollectVariantIdScalars(node: unknown, maxDepth: number): string[] {
  if (maxDepth <= 0 || node == null || typeof node !== "object") return [];
  if (Array.isArray(node)) {
    const out: string[] = [];
    for (const el of node) {
      out.push(...deepCollectVariantIdScalars(el, maxDepth - 1));
    }
    return out;
  }
  const o = node as Record<string, unknown>;
  const found: string[] = [];
  for (const [k, v] of Object.entries(o)) {
    const lk = k.toLowerCase();
    if (DEEP_SCAN_SKIP_KEYS.has(lk)) continue;
    const isVariantScalarKey =
      lk === "variant_id" ||
      lk === "default_variant_id" ||
      lk === "product_variant_id" ||
      lk.endsWith("_variant_id");
    if (
      isVariantScalarKey &&
      v != null &&
      typeof v !== "object" &&
      String(v).trim() !== ""
    ) {
      found.push(String(v));
    }
    if (v != null && typeof v === "object") {
      found.push(...deepCollectVariantIdScalars(v, maxDepth - 1));
    }
  }
  return found;
}

function uniqueSingleOrNull(values: string[]): string | null {
  const u = [...new Set(values)];
  if (u.length === 1) return u[0];
  return null;
}

export function defaultCartVariantId(product: Product): string | null {
  const p = product as Record<string, unknown>;
  for (const key of [
    "default_variant_id",
    "variant_id",
    "defaultVariantId",
    "selected_variant_id",
    "first_variant_id",
    "primary_variant_id",
    "product_variant_id",
    "cart_variant_id",
    "min_price_variant_id",
    "lowest_price_variant_id",
  ]) {
    const v = p[key];
    if (v != null && String(v).trim() !== "") return String(v);
  }

  const fromMeta = metaVariantId(p);
  if (fromMeta) return fromMeta;

  const dynamic = dynamicVariantIdKeys(p);
  if (dynamic) return dynamic;

  const singular = singularVariantId(product);
  if (singular) return singular;

  const list = listProductVariants(product);
  if (list.length === 1) return list[0].id;

  const deep = uniqueSingleOrNull(deepCollectVariantIdScalars(p, 10));
  if (deep) return deep;

  return null;
}

/**
 * Id to send as multipart `variant_id` when adding to cart.
 * Extends {@link defaultCartVariantId} with a last resort: when the API sends no variant rows at all,
 * some backends still expect `variant_id` to be the product id (implicit default variant).
 * Do not use this for {@link needsProductDetailHydration} — keep fetching detail until a real id is found.
 */
export function cartVariantIdForProduct(product: Product): string | null {
  const resolved = defaultCartVariantId(product);
  if (resolved) return resolved;
  const p = product as Record<string, unknown>;
  if (listProductVariants(product).length === 0 && p.id != null && String(p.id).trim() !== "") {
    return String(p.id);
  }
  return null;
}

export function requiresVariantChoice(product: Product): boolean {
  return listProductVariants(product).length > 1 && defaultCartVariantId(product) === null;
}
