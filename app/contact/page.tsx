import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Headphones,
  LifeBuoy,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { createTicketAction } from "@/app/actions/tickets";
import { TicketCreateForm } from "@/components/tickets/ticket-create-form";
import { NoticeBanner } from "@/components/shared/notice-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getCurrentUser } from "@/lib/api";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import type { ApiUser } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تواصل معنا",
    description: "تواصل مع Pets Zone — قنوات مباشرة أو أرسل تذكرة دعم عبر واجهة الطلبات المعتمدة.",
    openGraph: {
      title: "تواصل معنا | Pets Zone",
      description: "نرد على استفساراتك عبر الهاتف والبريد أو نظام تذاكر الدعم.",
    },
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

function qp(
  sp: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = sp[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const errorRaw = qp(sp, "error");
  const created = qp(sp, "created") === "1";
  const ticketId = qp(sp, "ticket");

  let authed = false;
  try {
    const res = await getCurrentUser();
    authed = userFromEnvelope(res.data) != null;
  } catch {
    authed = false;
  }

  const loginNext = encodeURIComponent(ROUTES.contact);

  return (
    <div className="relative min-h-[70vh]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,oklch(0.72_0.175_62/0.14),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-14">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href={ROUTES.home} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            <ChevronLeft className="size-4 rotate-180" aria-hidden />
            الرئيسية
          </Link>
          <span className="text-sky-300">/</span>
          <span className="font-medium text-sky-900">تواصل معنا</span>
        </div>

        <header className="mb-10 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/90 px-3 py-1 text-[11px] font-semibold text-sky-800 shadow-sm backdrop-blur-sm">
            <Headphones className="size-3.5 text-primary" aria-hidden />
            دعم العملاء
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-sky-950 md:text-4xl">تواصل معنا</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            نسعد بخدمتك. يمكنك الاتصال أو مراسلتنا مباشرة، أو إرسال طلب دعم مفصّل عبر النموذج أدناه بعد تسجيل
            الدخول — يُسجَّل الطلب كتذكرة رسمية ويُتابع فريقنا عليها حتى الإغلاق.
          </p>
        </header>

        {errorRaw ? (
          <NoticeBanner variant="error" title="تعذر إرسال الطلب" className="mb-6" role="alert">
            {getUserFacingErrorDescription(errorRaw)}
          </NoticeBanner>
        ) : null}

        {created ? (
          <NoticeBanner variant="success" title="تم استلام طلبك" className="mb-6">
            <p>
              شكراً لتواصلك. سيظهر طلبك في قائمة تذاكر الدعم ويعود إليك الفريق من خلالها.
              {ticketId ? (
                <>
                  {" "}
                  <Link href={ROUTES.ticket(ticketId)} className="font-bold text-emerald-900 underline underline-offset-2">
                    عرض التذكرة #{ticketId}
                  </Link>
                </>
              ) : null}
            </p>
          </NoticeBanner>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <aside className="space-y-4 lg:col-span-4">
            <Card className="overflow-hidden border-sky-100/90 shadow-md ring-1 ring-sky-50/80">
              <CardHeader className="border-b border-sky-100/80 bg-gradient-to-l from-sky-50/50 to-transparent pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <CardTitle className="text-base">اتصال مباشر</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">للاستعجال أو المتابعة الهاتفية.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 text-sm">
                <a
                  href="tel:+966500000000"
                  className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 font-semibold text-sky-950 transition-colors hover:border-sky-100 hover:bg-sky-50/50"
                >
                  <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                  <span dir="ltr" className="tabular-nums">
                    +966 50 000 0000
                  </span>
                </a>
                <a
                  href="mailto:care@petszone.sa"
                  className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 font-medium text-sky-950 transition-colors hover:border-sky-100 hover:bg-sky-50/50"
                >
                  <Mail className="size-4 shrink-0 text-primary" aria-hidden />
                  care@petszone.sa
                </a>
              </CardContent>
            </Card>

            <Card className="border-sky-100/90 shadow-sm ring-1 ring-sky-50/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-sky-600" aria-hidden />
                  <CardTitle className="text-sm font-bold text-sky-950">أوقات الرد</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-muted-foreground">
                نعالج تذاكر الدعم حسب أولوية الوصول. عادةً خلال يومي عمل — قد يختلف الوقت في العطل والمناسبات.
              </CardContent>
            </Card>

            <Card className="border-sky-100/90 shadow-sm ring-1 ring-sky-50/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
                  <CardTitle className="text-sm font-bold text-sky-950">خصوصية البيانات</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-muted-foreground">
                لا تشارك كلمات المرور أو رموز التحقق في التذكرة. اكتفِ بوصف المشكلة والبيانات الضرورية فقط.
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="justify-start rounded-xl border-sky-200/80">
                <Link href={ROUTES.faq}>
                  <MessageSquareText className="ms-2 size-4 opacity-80" aria-hidden />
                  الأسئلة الشائعة
                </Link>
              </Button>
              {authed ? (
                <Button asChild variant="outline" size="sm" className="justify-start rounded-xl border-sky-200/80">
                  <Link href={ROUTES.tickets}>
                    <LifeBuoy className="ms-2 size-4 opacity-80" aria-hidden />
                    كل تذاكر الدعم
                  </Link>
                </Button>
              ) : null}
            </div>
          </aside>

          <div className="lg:col-span-8">
            <Card className="overflow-hidden border-sky-200/60 shadow-lg shadow-sky-900/[0.04] ring-1 ring-sky-100/50">
              <CardHeader className="border-b border-sky-100/80 bg-gradient-to-l from-sky-50/40 to-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">رسالة إلى فريق الدعم</CardTitle>
                    <CardDescription className="mt-2 max-w-xl text-sm">
                      أدخل عنواناً واضحاً ووصفاً كاملاً؛ ويمكنك إرفاق ملفات أو صور عند الحاجة. يُنشأ الطلب عبر واجهة
                      التذاكر المعتمدة في المتجر ويظهر في حسابك ضمن «تذاكر الدعم».
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {authed ? (
                  <TicketCreateForm
                    action={createTicketAction}
                    source="contact"
                    cancelHref={ROUTES.home}
                    cancelLabel="العودة للرئيسية"
                    submitLabel="إرسال عبر التذكرة"
                    fieldIdPrefix="contact-ticket"
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-sky-200/80 bg-sky-50/30 px-6 py-12 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <LifeBuoy className="size-7" aria-hidden />
                    </div>
                    <p className="text-sm font-semibold text-sky-950">تسجيل الدخول مطلوب لإرسال تذكرة</p>
                    <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                      نظام التذاكر مرتبط بحسابك. سجّل الدخول أو أنشئ حساباً، ثم عد إلى هذه الصفحة لإرسال طلبك بأمان.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <Button asChild className="rounded-xl px-6 font-bold shadow-md">
                        <Link href={`${ROUTES.login}?next=${loginNext}`}>تسجيل الدخول</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={ROUTES.register}>إنشاء حساب</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
