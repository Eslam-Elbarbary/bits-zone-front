import type { SupportTicket, TicketMessage } from "@/types/api";

export function extractTicket(data: unknown): SupportTicket | null {
  if (!data) return null;
  if (typeof data === "object" && data !== null && "id" in data) {
    return data as SupportTicket;
  }
  if (
    typeof data === "object" &&
    data !== null &&
    "ticket" in data &&
    typeof (data as { ticket: unknown }).ticket === "object"
  ) {
    const t = (data as { ticket: SupportTicket }).ticket;
    if (t && "id" in t) return t;
  }
  if (typeof data === "object" && data !== null && "data" in data) {
    const inner = (data as { data: unknown }).data;
    if (inner !== data) return extractTicket(inner);
  }
  return null;
}

export function ticketSubject(t: SupportTicket): string {
  const s = t.subject ?? t.title;
  return typeof s === "string" && s.trim() ? s.trim() : `تذكرة #${t.id}`;
}

export function ticketDescription(t: SupportTicket): string {
  const d = t.description;
  return typeof d === "string" ? d.trim() : "";
}

export function ticketMessagesFromTicket(ticket: SupportTicket): TicketMessage[] {
  const t = ticket as Record<string, unknown>;
  const raw = t.messages ?? t.replies ?? t.ticket_messages ?? t.conversation;
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is TicketMessage => x != null && typeof x === "object");
}

export function ticketMessagesSorted(ticket: SupportTicket): TicketMessage[] {
  const list = ticketMessagesFromTicket(ticket);
  return [...list].sort((a, b) => {
    const ta = Date.parse(messageSentAt(a));
    const tb = Date.parse(messageSentAt(b));
    if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
    if (Number.isNaN(ta)) return 1;
    if (Number.isNaN(tb)) return -1;
    return ta - tb;
  });
}

export function messageBody(m: TicketMessage): string {
  const o = m as Record<string, unknown>;
  const text = o.message ?? o.body ?? o.content;
  return typeof text === "string" ? text.trim() : "";
}

export function messageSentAt(m: TicketMessage): string {
  const o = m as Record<string, unknown>;
  const d = o.created_at ?? o.updated_at;
  return typeof d === "string" && d.trim() ? d : "—";
}

export function statusBadgeVariant(status: string | undefined): "default" | "secondary" | "destructive" {
  const s = (status ?? "").toLowerCase();
  if (s.includes("close") || s.includes("resolved") || s.includes("complete")) return "default";
  if (s.includes("cancel") || s.includes("reject")) return "destructive";
  return "secondary";
}
