import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getTickets } from "@/lib/api";
import { extractList } from "@/lib/api-data";
import { statusBadgeVariant, ticketSubject } from "@/lib/ticket-utils";
import type { SupportTicket } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تذاكر الدعم",
    description: "تابع تذاكر الدعم الفنية وتواصل مع فريقنا.",
  };
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;

  let tickets: SupportTicket[] = [];
  let authRequired = false;

  try {
    const res = await getTickets();
    tickets = extractList<SupportTicket>(res.data);
  } catch {
    authRequired = true;
  }

  if (authRequired) {
    return (
      <div className="relative mx-auto max-w-lg px-4 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 -top-16 h-48 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.72_0.175_62/0.12),transparent)]"
          aria-hidden
        />
        <h1 className="text-2xl font-bold text-sky-950">تذاكر الدعم</h1>
        <p className="mt-4 text-muted-foreground">
          سجّل الدخول لفتح تذكرة جديدة ومتابعة طلبات الدعم.
        </p>
        <Button asChild className="mt-8">
          <Link href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.tickets)}`}>تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 h-56 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.72_0.175_62/0.1),transparent)]"
        aria-hidden
      />

      <div className="relative mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary/80">الدعم الفني</p>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950 md:text-3xl">تذاكر الدعم</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            أنشئ تذكرة عند وجود مشكلة أو استفسار، وتابع الردود من الفريق هنا.
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-md shadow-primary/15">
          <Link href={ROUTES.ticketNew} className="gap-2">
            <MessageSquarePlus className="size-4" aria-hidden />
            تذكرة جديدة
          </Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Card className="border-dashed border-sky-200/80 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle>لا توجد تذاكر بعد</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            عندما تفتح تذكرة جديدة ستظهر هنا مع حالتها وآخر التحديثات.
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild>
              <Link href={ROUTES.ticketNew}>إنشاء تذكرة</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <ul className="grid gap-4">
          {tickets.map((t) => {
            const id = String(t.id);
            const status = typeof t.status === "string" ? t.status : "—";
            const created = t.created_at ?? "—";
            return (
              <li key={id}>
                <Card className="overflow-hidden border-sky-200/60 shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="border-b border-sky-100/80 bg-gradient-to-l from-sky-50/40 to-transparent">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <CardTitle className="text-lg leading-snug">{ticketSubject(t)}</CardTitle>
                      <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 text-sm text-muted-foreground">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span>رقم التذكرة</span>
                      <span className="font-mono font-semibold text-foreground">#{id}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap justify-between gap-2">
                      <span>تاريخ الإنشاء</span>
                      <span className="tabular-nums">{created}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t border-sky-100/60 bg-sky-50/20">
                    <Button asChild variant="secondary" className="rounded-xl">
                      <Link href={ROUTES.ticket(id)}>عرض التفاصيل والمحادثة</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
