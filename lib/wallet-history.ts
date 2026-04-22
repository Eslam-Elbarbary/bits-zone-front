import { extractList } from "@/lib/api-data";
import { formatPrice } from "@/lib/product-utils";
import type { WalletHistoryEntry } from "@/types/api";

export type WalletHistoryRow = {
  key: string;
  delta: number | null;
  label: string;
  at: string | null;
  atRaw: string | null;
  orderId: string | null;
  balanceAfter: number | null;
};

function toFiniteNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number(value.trim().replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Prefer signed amount; else credit positive / debit as outflow. */
function walletDeltaFromEntry(entry: WalletHistoryEntry): number | null {
  for (const key of ["amount", "value", "change", "delta"] as const) {
    const n = toFiniteNumber(entry[key]);
    if (n != null) return n;
  }
  const credit = toFiniteNumber(entry.credit);
  const debit = toFiniteNumber(entry.debit);
  if (credit != null && credit !== 0) return Math.abs(credit);
  if (debit != null && debit !== 0) return -Math.abs(debit);
  return null;
}

function entryLabel(entry: WalletHistoryEntry): string {
  const candidates = [entry.description, entry.reason, entry.note, entry.title, entry.type];
  for (const c of candidates) {
    if (c != null && String(c).trim()) return String(c).trim();
  }
  return "حركة محفظة";
}

function formatWalletDate(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);
  return d.toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

/**
 * GET /api/wallet/history envelope `data`: array, paginator, or wrapper with balance + list.
 */
export function extractWalletHistoryPayload(payload: unknown): {
  balance: number | null;
  entries: WalletHistoryEntry[];
} {
  const balanceKeys = [
    "wallet_balance",
    "balance",
    "total_balance",
    "available_balance",
    "current_balance",
    "credit_balance",
  ] as const;

  let balance: number | null = null;
  let rawList: unknown[] = [];

  if (Array.isArray(payload)) {
    rawList = payload;
  } else if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;

    for (const k of balanceKeys) {
      if (k in o) {
        const n = toFiniteNumber(o[k]);
        if (n != null) {
          balance = n;
          break;
        }
      }
    }

    if (Array.isArray(o.wallet) && o.wallet.length > 0) {
      rawList = o.wallet as unknown[];
    }
    const listKeys = ["history", "transactions", "items", "records", "logs", "entries", "data"];
    if (rawList.length === 0) {
      for (const k of listKeys) {
        const v = o[k];
        if (Array.isArray(v) && v.length > 0) {
          rawList = v;
          break;
        }
      }
    }

    if (rawList.length === 0) {
      rawList = extractList<WalletHistoryEntry>(payload);
    }
  }

  const entries = rawList.filter((e): e is WalletHistoryEntry => e != null && typeof e === "object");

  if (balance == null && entries.length > 0) {
    const dated = [...entries].sort((a, b) => {
      const ta = new Date(String(a.created_at ?? a.updated_at ?? 0)).getTime();
      const tb = new Date(String(b.created_at ?? b.updated_at ?? 0)).getTime();
      return tb - ta;
    });
    const latest = dated[0];
    balance = toFiniteNumber(latest?.balance_after ?? latest?.balance);
  }

  return { balance, entries };
}

export function rowsFromWalletEntries(entries: WalletHistoryEntry[]): WalletHistoryRow[] {
  return entries.map((entry, idx) => {
    const raw = entry.created_at ?? entry.updated_at;
    const rawStr = raw != null && String(raw).trim() ? String(raw) : null;
    return {
      key: String(entry.id ?? `w-${idx}`),
      delta: walletDeltaFromEntry(entry),
      label: entryLabel(entry),
      at: formatWalletDate(raw),
      atRaw: rawStr,
      orderId: entry.order_id != null && String(entry.order_id).trim() ? String(entry.order_id) : null,
      balanceAfter: toFiniteNumber(entry.balance_after ?? entry.balance),
    };
  });
}

export function walletActivityStats(rows: WalletHistoryRow[]): { credited: number; debited: number } {
  let credited = 0;
  let debited = 0;
  for (const r of rows) {
    if (r.delta == null) continue;
    if (r.delta > 0) credited += r.delta;
    else if (r.delta < 0) debited += Math.abs(r.delta);
  }
  return { credited, debited };
}

export function formatWalletDeltaSar(n: number): string {
  const abs = Math.abs(n);
  const formatted = formatPrice(abs);
  if (n > 0) return `+${formatted}`;
  if (n < 0) return `−${formatted}`;
  return formatPrice(0);
}
