import type { Cart, Product } from "@/types/api";
import { extractUrlFromUnknown, productImageSrc, resolveImageSrc } from "@/lib/product-utils";

/** Shown when no image URL can be resolved from the cart line or product API. */
export const CART_LINE_PLACEHOLDER_IMAGE = "/ui/placeholder-product.svg";

/** Scalar / nested image fields often present on cart lines and variants (GET /api/cart). */
function firstImageFromLooseRecord(obj: Record<string, unknown>): string | null {
  const keys = [
    "image",
    "thumbnail",
    "thumb",
    "photo",
    "picture",
    "cover_image",
    "product_image",
    "thumb_image",
    "main_image",
    "primary_image",
    "image_url",
    "img",
    "featured_image",
    "file_url",
    "file",
  ] as const;
  for (const k of keys) {
    const extracted = extractUrlFromUnknown(obj[k]);
    if (extracted) {
      const src = resolveImageSrc(extracted);
      if (src !== CART_LINE_PLACEHOLDER_IMAGE) return src;
    }
  }
  for (const arrKey of ["images", "media"] as const) {
    const arr = obj[arrKey];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      const extracted = extractUrlFromUnknown(item);
      if (extracted) {
        const src = resolveImageSrc(extracted);
        if (src !== CART_LINE_PLACEHOLDER_IMAGE) return src;
      }
    }
  }
  return null;
}

/** Any string path/url on nested objects (some Laravel resources use odd keys). */
function firstImageDeepScan(obj: unknown, depth: number): string | null {
  if (depth <= 0 || obj == null) return null;
  if (typeof obj === "string") {
    const s = obj.trim();
    if (!s) return null;
    if (/storage\/|\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(s) || s.startsWith("http")) {
      const src = resolveImageSrc(s);
      if (src !== CART_LINE_PLACEHOLDER_IMAGE) return src;
    }
    return null;
  }
  if (typeof obj !== "object") return null;
  if (Array.isArray(obj)) {
    for (const el of obj) {
      const found = firstImageDeepScan(el, depth - 1);
      if (found) return found;
    }
    return null;
  }
  const o = obj as Record<string, unknown>;
  for (const v of Object.values(o)) {
    const found = firstImageDeepScan(v, depth - 1);
    if (found) return found;
  }
  return null;
}

/**
 * Image URL for a cart row from the API envelope.
 * Prefer the **variant** (matches `variant_id` on the line), then line-level thumbnails,
 * then nested `product` — avoids showing the wrong gallery image when only the variant differs.
 */
export function cartLineImageSrc(line: unknown): string {
  if (!line || typeof line !== "object") return CART_LINE_PLACEHOLDER_IMAGE;
  const o = line as Record<string, unknown>;

  const variant = o.variant ?? o.product_variant ?? o.productVariant;
  if (variant && typeof variant === "object") {
    const fromVariant = firstImageFromLooseRecord(variant as Record<string, unknown>);
    if (fromVariant) return fromVariant;
  }

  const fromLine = firstImageFromLooseRecord(o);
  if (fromLine) return fromLine;

  const product = o.product;
  if (product && typeof product === "object" && product !== null && "id" in product) {
    const fromProduct = productImageSrc(product as Product);
    if (fromProduct !== CART_LINE_PLACEHOLDER_IMAGE) return fromProduct;
  }

  const deep = firstImageDeepScan(o, 5);
  return deep ?? CART_LINE_PLACEHOLDER_IMAGE;
}

/** Product/line title when `product` is missing or minimal. */
export function lineDisplayTitle(line: unknown): string {
  if (!line || typeof line !== "object") return "منتج";
  const o = line as Record<string, unknown>;
  const direct =
    o.product_name ??
    o.name ??
    o.title ??
    o.product_title ??
    (typeof o.product === "object" && o.product !== null
      ? (o.product as Record<string, unknown>).name_ar ??
        (o.product as Record<string, unknown>).name
      : undefined);
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const p = o.product;
  if (p && typeof p === "object" && p !== null && "id" in p) {
    const pr = p as Product;
    if (pr.name_ar && String(pr.name_ar).trim()) return String(pr.name_ar);
    if (pr.name) return String(pr.name);
  }
  return "منتج";
}

/** Unit price for one item (before quantity). */
export function lineUnitPrice(line: unknown): number | string | undefined {
  if (!line || typeof line !== "object") return undefined;
  const o = line as Record<string, unknown>;
  const keys = [
    "unit_price",
    "price",
    "sale_price",
    "product_price",
    "amount",
    "item_price",
    "variant_price",
  ] as const;
  for (const k of keys) {
    const v = o[k];
    if (v != null && String(v).trim() !== "") return v as number | string;
  }
  const variant = o.variant ?? o.product_variant ?? o.productVariant;
  if (variant && typeof variant === "object") {
    const v = variant as Record<string, unknown>;
    const pv = v.sale_price ?? v.price ?? v.unit_price;
    if (pv != null && String(pv).trim() !== "") return pv as number | string;
  }
  const prod = o.product;
  if (prod && typeof prod === "object") {
    const p = prod as Record<string, unknown>;
    const pv = p.sale_price ?? p.price;
    if (pv != null && String(pv).trim() !== "") return pv as number | string;
  }
  return undefined;
}

/**
 * Line total for display. Prefer **unit_price × quantity** when a unit price exists — some APIs
 * put the unit amount in `total` / `subtotal` on the row, which breaks after qty changes.
 */
export function lineRowTotal(line: unknown): number | string | undefined {
  if (!line || typeof line !== "object") return undefined;
  const unit = lineUnitPrice(line);
  const q = lineQuantity(line);
  if (unit !== undefined) {
    const un = typeof unit === "number" ? unit : parseFloat(String(unit));
    if (Number.isFinite(un)) return un * q;
  }
  const o = line as Record<string, unknown>;
  const unambiguousKeys = [
    "line_total",
    "row_total",
    "item_total",
    "line_subtotal",
    "total_price",
  ] as const;
  for (const k of unambiguousKeys) {
    const v = o[k];
    if (v != null && String(v).trim() !== "") return v as number | string;
  }
  return undefined;
}

/** Parse numeric amounts from API strings/numbers (cart lines, totals). */
export function parseCartMoney(v: unknown): number | null {
  if (v === undefined || v === null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Read cart payload; unwrap nested `data` when items live there. */
function cartRootRecord(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const o = data as Record<string, unknown>;
  if (Array.isArray(o.items) || Array.isArray(o.cart_items)) return o;
  const inner = o.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const d = inner as Record<string, unknown>;
    if (Array.isArray(d.items) || Array.isArray(d.cart_items)) return d;
  }
  return o;
}

/** Sum of {@link lineRowTotal} for all cart lines — fallback when the envelope omits subtotal/total. */
export function cartSumLineTotals(data: unknown): number | undefined {
  const lines = cartItemsFromResponse(data);
  let sum = 0;
  let any = false;
  for (const line of lines) {
    const t = lineRowTotal(line);
    const n = parseCartMoney(t);
    if (n != null) {
      sum += n;
      any = true;
    }
  }
  return any ? sum : undefined;
}

export function cartItemsFromResponse(data: unknown): unknown[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const root = cartRootRecord(data);
  if (root) {
    if (Array.isArray(root.items)) return root.items;
    if (Array.isArray(root.cart_items)) return root.cart_items;
  }
  if (typeof data === "object" && data !== null) {
    const c = data as Cart & Record<string, unknown>;
    if (Array.isArray(c.items)) return c.items;
    if (Array.isArray(c.cart_items)) return c.cart_items;
  }
  return [];
}

export function lineProductId(line: unknown): string | undefined {
  if (!line || typeof line !== "object") return undefined;
  const o = line as Record<string, unknown>;
  const fromProduct = (o.product as Record<string, unknown> | undefined)?.id;
  const id = o.product_id ?? fromProduct;
  return id !== undefined ? String(id) : undefined;
}

export function lineQuantity(line: unknown): number {
  if (!line || typeof line !== "object") return 1;
  const q = (line as Record<string, unknown>).quantity;
  const n = typeof q === "number" ? q : parseInt(String(q), 10);
  return Number.isNaN(n) ? 1 : n;
}

export function lineVariantId(line: unknown): string | undefined {
  if (!line || typeof line !== "object") return undefined;
  const v = (line as Record<string, unknown>).variant_id;
  return v !== undefined ? String(v) : undefined;
}

/** Subtotal/total from cart envelope or raw cart object */
/** Total units in cart (sum of line quantities). */
export function cartTotalQuantity(data: unknown): number {
  const lines = cartItemsFromResponse(data);
  return lines.reduce<number>((sum, line) => sum + lineQuantity(line), 0);
}

export function cartMonetaryFields(data: unknown): {
  subtotal?: number | string;
  total?: number | string;
  tax?: number | string;
  shipping?: number | string;
} {
  const fromLines = cartSumLineTotals(data);

  const o = cartRootRecord(data);
  if (!o) {
    return {
      subtotal: fromLines,
      total: fromLines,
      tax: undefined,
      shipping: undefined,
    };
  }
  const sub =
    o.subtotal ??
    o.sub_total ??
    o.items_subtotal ??
    o.cart_subtotal ??
    o.subtotal_amount;
  const tot =
    o.total ??
    o.grand_total ??
    o.cart_total ??
    o.total_amount ??
    o.amount_payable ??
    o.payable_total;
  const tax = o.tax ?? o.tax_total ?? o.total_tax ?? o.vat;
  const shipping =
    o.shipping ?? o.shipping_total ?? o.shipping_cost ?? o.delivery_fee ?? o.shipping_amount;

  const subNum = parseCartMoney(sub);
  const totNum = parseCartMoney(tot);
  const mergedSub = subNum != null ? sub : fromLines;
  const mergedTot = totNum != null ? tot : fromLines;

  return {
    subtotal: mergedSub as number | string | undefined,
    total: mergedTot as number | string | undefined,
    tax: tax as number | string | undefined,
    shipping: shipping as number | string | undefined,
  };
}

/**
 * Subtotal from lines + grand total for checkout sidebar (subtotal − discount + tax + shipping).
 * Uses the same line math as the cart when API omits envelope totals.
 * Prefer `shippingFromAddress` when the shipping API returned a value for the selected address.
 */
export function checkoutGrandTotal(params: {
  cartData: unknown;
  discount?: number | string | null;
  shippingFromAddress?: number | null;
}): { subtotal: number; grand: number } {
  const m = cartMonetaryFields(params.cartData);
  const lineSum = cartSumLineTotals(params.cartData) ?? 0;
  const sub = parseCartMoney(m.subtotal) ?? lineSum;
  const tax = parseCartMoney(m.tax) ?? 0;
  const shipCart = parseCartMoney(m.shipping) ?? 0;
  const addr = params.shippingFromAddress;
  const ship =
    addr != null && Number.isFinite(addr) && addr >= 0 ? addr : shipCart;
  const disc = parseCartMoney(params.discount) ?? 0;
  const grand = sub - Math.abs(disc) + tax + ship;
  return { subtotal: sub, grand };
}

/** Coupon label + discount amount when API returns them on cart payload */
export function cartDiscountFields(data: unknown): {
  discount?: number | string;
  couponLabel?: string | null;
} {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const o = data as Record<string, unknown>;
  const raw =
    o.discount ?? o.discount_total ?? o.coupon_discount ?? o.discount_amount ?? o.savings;
  const discount =
    raw !== undefined && raw !== null && String(raw).trim() !== "" ? (raw as number | string) : undefined;
  const coupon =
    typeof o.coupon === "string" && o.coupon.trim()
      ? o.coupon.trim()
      : typeof o.coupon_code === "string" && o.coupon_code.trim()
        ? o.coupon_code.trim()
        : null;
  return { discount, couponLabel: coupon };
}
