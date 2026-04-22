import { extractList } from "@/lib/api-data";
import type { PointsHistoryEntry } from "@/types/api";

export type PointsHistoryRow = {
  key: string;
  delta: number | null;
  label: string;
  at: string | null;
  /** ISO-friendly source for `<time dateTime>` when parsable */
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

function pointsDeltaFromEntry(entry: PointsHistoryEntry): number | null {
  for (const key of ["amount", "points", "point", "value"] as const) {
    const n = toFiniteNumber(entry[key]);
    if (n != null) return n;
  }
  return null;
}

function entryLabel(entry: PointsHistoryEntry): string {
  const candidates = [entry.description, entry.reason, entry.note, entry.title, entry.type];
  for (const c of candidates) {
    if (c != null && String(c).trim()) return String(c).trim();
  }
  return "حركة نقاط";
}

function formatPointsDate(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);
  return d.toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Accepts `data` from ApiEnvelope after GET /api/points/history:
 * plain array, paginator `{ data: [...] }`, or wrapper `{ history|transactions|…, points_balance? }`.
 */
export function extractPointsHistoryPayload(payload: unknown): {
  balance: number | null;
  entries: PointsHistoryEntry[];
} {
  const balanceKeys = [
    "points_balance",
    "balance",
    "total_points",
    "available_points",
    "current_points",
    "points",
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

    if (Array.isArray(o.points) && o.points.length > 0) {
      rawList = o.points;
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
      rawList = extractList<PointsHistoryEntry>(payload);
    }
  }

  const entries = rawList.filter((e): e is PointsHistoryEntry => e != null && typeof e === "object");

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

export function rowsFromPointsEntries(entries: PointsHistoryEntry[]): PointsHistoryRow[] {
  return entries.map((entry, idx) => {
    const raw = entry.created_at ?? entry.updated_at;
    const rawStr = raw != null && String(raw).trim() ? String(raw) : null;
    return {
      key: String(entry.id ?? `row-${idx}`),
      delta: pointsDeltaFromEntry(entry),
      label: entryLabel(entry),
      at: formatPointsDate(raw),
      atRaw: rawStr,
      orderId: entry.order_id != null && String(entry.order_id).trim() ? String(entry.order_id) : null,
      balanceAfter: toFiniteNumber(entry.balance_after ?? entry.balance),
    };
  });
}

export function pointsActivityStats(rows: PointsHistoryRow[]): {
  earned: number;
  spent: number;
} {
  let earned = 0;
  let spent = 0;
  for (const r of rows) {
    if (r.delta == null) continue;
    if (r.delta > 0) earned += r.delta;
    else if (r.delta < 0) spent += Math.abs(r.delta);
  }
  return { earned, spent };
}

export function formatPointsInteger(n: number): string {
  return new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function formatPointsDelta(n: number): string {
  const abs = formatPointsInteger(Math.abs(n));
  if (n > 0) return `+${abs}`;
  if (n < 0) return `−${abs}`;
  return formatPointsInteger(0);
}
