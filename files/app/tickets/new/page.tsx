import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createTicketAction } from "@/app/actions/tickets";
import { TicketCreateForm } from "@/components/tickets/ticket-create-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getCurrentUser } from "@/lib/api";
import type { ApiUser } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تذكرة دعم جديدة",
    description: "أرسل طلب دعم فني لفريقنا.",
  };
}

function userFromEnvelope(data: unknown): ApiUser | null {
  if (!data || typeof data !== "object") return null;
  const u = (data as { user?: unknown }).user;
  if (u && typeof u === "object" && u !== null && "id" in (u as Record<string, unknown>)) {
    return u as ApiUser;
  }
  return null;
}

export default async function NewTicketPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;

  let authed = false;
  try {
    const res = await getCurrentUser();
    authed = userFromEnvelope(res.data) != null;
  } catch {
    authed = false;
  }

  if (!authed) {
    redirect(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.ticketNew)}`);
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-8 md:py-12">
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
        <h1 className="text-2xl font-bold tracking-tight text-sky-950 md:text-3xl">تذكرة جديدة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          صف المشكلة أو الاستفسار باختصار — سيرد عليك الفريق عبر هذه التذكرة.
        </p>
      </div>

      <Card className="border-sky-200/60 shadow-lg shadow-sky-900/[0.04]">
        <CardHeader>
          <CardTitle>بيانات الطلب</CardTitle>
          <CardDescription>عنوان واضح ووصف مفصّل يُسرّع الرد. يمكنك إرفاق صور أو ملفات عند الحاجة.</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketCreateForm
            action={createTicketAction}
            source="new-ticket"
            cancelHref={ROUTES.tickets}
            cancelLabel="إلغاء"
          />
        </CardContent>
      </Card>
    </div>
  );
}
