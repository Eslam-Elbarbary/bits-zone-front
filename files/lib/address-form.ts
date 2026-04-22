/** Postman: POST /api/addresses — DB often requires coordinates; neutral default ≈ الرياض. */
export const ADDRESS_DEFAULT_LAT = "24.713551";
export const ADDRESS_DEFAULT_LNG = "46.675296";

export function normalizeCoord(raw: string, fallback: string): string {
  const t = raw.trim().replace(",", ".");
  if (!t) return fallback;
  const n = Number(t);
  if (!Number.isFinite(n)) return fallback;
  return String(n);
}

export function coordsFromFormData(formData: FormData): { latitude: string; longitude: string } {
  const latIn = String(formData.get("latitude") ?? "");
  const lngIn = String(formData.get("longitude") ?? "");
  return {
    latitude: normalizeCoord(latIn, ADDRESS_DEFAULT_LAT),
    longitude: normalizeCoord(lngIn, ADDRESS_DEFAULT_LNG),
  };
}
