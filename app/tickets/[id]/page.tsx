import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Headphones } from "lucide-react";
import {
  addTicketMessageFormAction,
  updateTicketStatusFormAction,
} from "@/app/actions/tickets";
import { NoticeBanner } from "@/components/shared/notice-banner";
import { TicketDeleteButton } from "@/components/tickets/ticket-delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { getCurrentUser, getTicketById } from "@/lib/api";
import {
  extractTicket,
  messageBody,
  messageSentAt,
  statusBadgeVariant,
  ticketDescription,
  ticketMessagesSorted,
  ticketSubject,
} from "@/lib/ticket-utils";
import { cn } from "@/lib/utils";
import type { SupportTicket, TicketMessage } from "@/types/api";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "open", label: "مفتوحة" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "in_progress", label: "قيد المعالجة" },
  { value: "resolved", label: "تم الحل" },
  { value: "closed", label: "مغلقة" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getTicketById(id);
    const t = extractTicket(res.data);
    if (t) {
      return {
        title: ticketSubject(t),
        description: "تفاصيل تذكرة الدعم والمحادثة.",
      };
    }
  } catch {
    /* ignore */
  }
  return { title: `تذكرة #${id}` };
}

function isStaffMessage(m: TicketMessage): boolean {
  const o = m as Record<string, unknown>;
  if (o.is_admin === true) return true;
  if (o.sender === "admin" || o.sender === "support") return true;
  if (o.user_type === "admin") return true;
  return false;
}

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  await searchParams;

  let session = false;
  try {
    await getCurrentUser();
    session = true;
  } catch {
    session = false;
  }

  let ticket: SupportTicket | null = null;
  try {
    const res = await getTicketById(id);
    ticket = extractTicket(res.data);
  } catch {
    if (!session) {
      redirect(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.ticket(id))}`);
    }
    notFound();
  }

  if (!ticket) notFound();

  const messages = ticketMessagesSorted(ticket);
  const desc = ticketDescription(ticket);
  const status = typeof ticket.status === "string" ? ticket.status : "";

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 h-56 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.72_0.175_62/0.1),transparent)]"
        aria-hidden
      />

      <div className="relative mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-1 text-sky-700">
          <Link href={ROUTES.tickets}>
            <ChevronLeft className="size-4" aria-hidden />
            كل التذاكر
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary/80">تذكرة #{id}</p>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-sky-950 md:text-3xl">
              {ticketSubject(ticket)}
            </h1>
          </div>
          <Badge variant={statusBadgeVariant(status)} className="shrink-0 text-sm">
            {status || "—"}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>إنشاء: {ticket.created_at ?? "—"}</span>
          {ticket.updated_at ? <span>آخر تحديث: {ticket.updated_at}</span> : null}
        </div>
      </div>

      {desc ? (
        <Card className="mb-8 border-sky-200/60">
          <CardHeader className="border-b border-sky-100/80">
            <CardTitle className="text-base">وصف الطلب</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm leading-relaxed text-sky-900/90 whitespace-pre-wrap">{desc}</CardContent>
        </Card>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-sky-950">
          <Headphones className="size-5 text-primary" aria-hidden />
          المحادثة
        </h2>
        {messages.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-sky-200/80 bg-sky-50/30 px-4 py-8 text-center text-sm text-muted-foreground">
            لا توجد رسائل بعد — أضف رسالة أدناه عند الحاجة.
          </p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m, idx) => {
              const body = messageBody(m);
              if (!body) return null;
              const staff = isStaffMessage(m);
              return (
                <li
                  key={`${messageSentAt(m)}-${idx}`}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm shadow-sm",
                    staff
                      ? "border-primary/20 bg-primary/[0.04] ms-0 me-4 md:me-12"
                      : "border-sky-200/60 bg-white ms-4 me-0 md:ms-12"
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant={staff ? "default" : "secondary"} className="text-[10px]">
                      {staff ? "فريق الدعم" : "أنت"}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground tabular-nums">{messageSentAt(m)}</span>
                  </div>
                  <p className="leading-relaxed text-sky-950 whitespace-pre-wrap">{body}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Card className="mb-8 border-sky-200/60">
        <CardHeader>
          <CardTitle className="text-base">إضافة رسالة</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addTicketMessageFormAction} className="space-y-4">
            <input type="hidden" name="ticket_id" value={id} />
            <div className="space-y-2">
              <Label htmlFor="message">رسالتك</Label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="اكتب تفاصيل إضافية أو رداً على فريق الدعم…"
                className={cn(
                  "flex min-h-[100px] w-full resize-y rounded-xl border border-input bg-background/80 px-3 py-2 text-sm shadow-sm outline-none transition-[color,box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/15"
                )}
              />
            </div>
            <Button type="submit" className="rounded-xl">
              إرسال الرسالة
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8 bg-sky-100/80" />

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-sky-200/60">
          <CardHeader>
            <CardTitle className="text-base">تحديث الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateTicketStatusFormAction} className="space-y-4">
              <input type="hidden" name="ticket_id" value={id} />
              <div className="space-y-2">
                <Label htmlFor="status">حالة التذكرة</Label>
                <select
                  id="status"
                  name="status"
                  required
                  defaultValue={status}
                  className="flex h-10 w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                >
                  <option value="" disabled={Boolean(status)}>
                    اختر الحالة
                  </option>
                  {status && !STATUS_OPTIONS.some((o) => o.value === status) ? (
                    <option value={status}>{status} (الحالية)</option>
                  ) : null}
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  اختر الحالة التي تعكس وضع طلبك. إذا لم تكن حالتك الحالية ضمن القائمة، ستظهر كخيار إضافي تلقائياً.
                </p>
              </div>
              <Button type="submit" variant="secondary" className="rounded-xl">
                حفظ الحالة
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/[0.02]">
          <CardHeader>
            <CardTitle className="text-base text-destructive">منطقة الخطر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NoticeBanner variant="warning" title="حذف نهائي">
              سيتم حذف التذكرة وجميع رسائلها بشكل دائم. لا يمكن التراجع عن هذا الإجراء بعد التأكيد.
            </NoticeBanner>
            <TicketDeleteButton ticketId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
