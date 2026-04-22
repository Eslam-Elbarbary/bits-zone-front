import { formatProductRating, resolveImageSrc } from "@/lib/product-utils";
import type { Vendor, VendorLocationDisplay } from "@/types/api";

function pickStr(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

function toFiniteNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function mapsUrlFromCoords(lat: unknown, lng: unknown): string | null {
  const la = toFiniteNumber(lat);
  const lo = toFiniteNumber(lng);
  if (la == null || lo == null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${la},${lo}`)}`;
}

function addressLikeToLocation(
  o: Record<string, unknown>,
  index: number,
  titleFallback: string
): VendorLocationDisplay | null {
  const id = o.id != null ? String(o.id) : `loc-${index}`;
  const title =
    pickStr(o.name_ar) ??
    pickStr(o.name) ??
    pickStr(o.branch_name) ??
    pickStr(o.label) ??
    pickStr(o.title) ??
    titleFallback;
  const street =
    pickStr(o.address) ?? pickStr(o.street) ?? pickStr(o.street_address) ?? pickStr(o.full_address);
  const city = pickStr(o.city);
  const state = pickStr(o.state) ?? pickStr(o.region);
  const zip = pickStr(o.postal_code) ?? pickStr(o.zip);
  const lines: string[] = [];
  if (street) {
    for (const part of street.split(/\r?\n/).map((x) => x.trim()).filter(Boolean)) {
      lines.push(part);
    }
  }
  const tail = [city, state, zip].filter(Boolean).join("، ");
  if (tail) lines.push(tail);
  if (!lines.length) {
    const single = pickStr(o.location) ?? pickStr(o.formatted_address);
    if (single) lines.push(single);
  }
  const phone = pickStr(o.phone) ?? pickStr(o.phone_number) ?? pickStr(o.mobile);
  const mapsUrl =
    mapsUrlFromCoords(o.latitude ?? o.lat, o.longitude ?? o.lng ?? o.long) ??
    pickStr(o.maps_url) ??
    pickStr(o.google_maps_url);
  if (!lines.length && !phone && !mapsUrl) return null;
  const isPrimary = o.is_default === true || o.is_main === true || o.primary === true;
  return {
    id,
    title,
    lines: lines.length ? lines : mapsUrl ? ["يمكن فتح الموقع على الخريطة أدناه."] : [],
    phone,
    mapsUrl,
    isPrimary,
  };
}

function objectRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

/**
 * Reads store locations from the vendor payload returned by `GET /api/vendors/:id`
 * (and list rows when the API embeds the same fields): `branches`, `addresses`,
 * `locations`, nested `address`, or flat `address` / `city` / coordinates.
 */
export function extractVendorLocations(v: Vendor): VendorLocationDisplay[] {
  const raw = v as Record<string, unknown>;
  const tryArrays = [raw.branches, raw.addresses, raw.locations, raw.store_addresses];
  for (const arr of tryArrays) {
    if (!Array.isArray(arr) || arr.length === 0) continue;
    const out: VendorLocationDisplay[] = [];
    arr.forEach((item, index) => {
      const o = objectRecord(item);
      if (!o) return;
      const loc = addressLikeToLocation(o, index, `موقع ${index + 1}`);
      if (loc) out.push(loc);
    });
    if (out.length) return out;
  }

  const nested = objectRecord(raw.address);
  if (nested) {
    const loc = addressLikeToLocation(nested, 0, "عنوان المتجر");
    if (loc) return [loc];
  }

  const line1 =
    pickStr(raw.address_line_1) ?? pickStr(raw.address_line) ?? pickStr(raw.street) ?? pickStr(raw.street_address);
  const addr = pickStr(raw.address);
  const city = pickStr(raw.city);
  const state = pickStr(raw.state) ?? pickStr(raw.region);
  const country = pickStr(raw.country);
  const phone = pickStr(raw.phone) ?? pickStr(raw.store_phone) ?? pickStr(raw.vendor_phone);
  const mapsUrl = mapsUrlFromCoords(raw.latitude ?? raw.lat, raw.longitude ?? raw.lng ?? raw.long);

  const parts: string[] = [];
  if (line1) parts.push(line1);
  else if (addr) parts.push(addr);
  const tail = [city, state, country].filter(Boolean).join("، ");
  if (tail) parts.push(tail);
  else if (addr && line1) parts.push(addr);

  if (!parts.length && !phone && !mapsUrl) return [];

  return [
    {
      id: "primary",
      title: "عنوان المتجر",
      lines: parts,
      phone,
      mapsUrl,
      isPrimary: true,
    },
  ];
}

/** One-line hint for vendor cards (directory) when the API exposes location fields. */
export function vendorListLocationHint(v: Vendor): string | null {
  const locs = extractVendorLocations(v);
  const first = locs[0];
  if (!first) return null;
  const text = first.lines.join(" · ").trim();
  if (text) return text.length > 120 ? `${text.slice(0, 117)}…` : text;
  if (first.phone) return first.phone;
  return null;
}

export function extractVendorFromPayload(data: unknown): Vendor | null {
  if (!data || typeof data !== "object") return null;
  if ("id" in data && data !== null) {
    const id = (data as { id: unknown }).id;
    if (typeof id === "number" || (typeof id === "string" && id.trim())) {
      return data as Vendor;
    }
  }
  if ("vendor" in (data as object)) {
    const inner = (data as { vendor: unknown }).vendor;
    if (inner && typeof inner === "object" && inner !== null && "id" in (inner as object)) {
      return inner as Vendor;
    }
  }
  return null;
}

export function vendorDisplayName(v: Vendor): string {
  const ar = v.name_ar != null && String(v.name_ar).trim() ? String(v.name_ar).trim() : "";
  if (ar) return ar;
  return String(v.name ?? "").trim() || "متجر";
}

export function vendorHeroImage(v: Vendor): string | null {
  const raw = v.image;
  if (raw == null) return null;
  const src = resolveImageSrc(raw);
  return src && src !== "/ui/placeholder-product.svg" ? src : null;
}

export function formatVendorRating(v: Vendor): string {
  return formatProductRating(v.rating);
}

export function vendorProductsCount(v: Vendor): number | null {
  const raw =
    (v as { products_count?: unknown }).products_count ??
    (v as { products?: unknown }).products;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (Array.isArray(raw)) return raw.length;
  return null;
}
