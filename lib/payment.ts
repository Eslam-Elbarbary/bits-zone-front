import type { ApiEnvelope } from "@/types/api";

const PAYMENT_METHOD_ALIASES: Record<string, string> = {
  cod: "COD",
  cash: "COD",
  mada: "FAWRY",
  visa: "FAWRY",
  mastercard: "FAWRY",
  card: "FAWRY",
  fawry: "FAWRY",
};

function normalizeMethodKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

export function endpointPaymentMethod(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const key = normalizeMethodKey(trimmed);
  return PAYMENT_METHOD_ALIASES[key] ?? trimmed;
}

function readUrlField(source: Record<string, unknown>): string | undefined {
  const keys = ["redirect_url", "payment_url", "paymentUrl", "url"];
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

/** Extracts the first usable payment redirect URL from gateway response objects. */
export function extractPaymentRedirectUrl(
  envelope: ApiEnvelope<unknown> | unknown
): string | undefined {
  const root =
    envelope && typeof envelope === "object" && "data" in envelope
      ? (envelope as { data?: unknown }).data
      : envelope;
  if (!root || typeof root !== "object") return undefined;

  const queue: unknown[] = [root];
  const seen = new Set<unknown>();

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node || typeof node !== "object" || seen.has(node)) continue;
    seen.add(node);

    const rec = node as Record<string, unknown>;
    const direct = readUrlField(rec);
    if (direct) return direct;

    for (const value of Object.values(rec)) {
      if (value && typeof value === "object") queue.push(value);
    }
  }

  return undefined;
}
