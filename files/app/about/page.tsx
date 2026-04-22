import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "من نحن",
    description:
      "Pets Zone — أكثر من متجر: عائلة من محبي الحيوانات، خمس فروع في القاهرة الجديدة منذ 2019، ومنتجات وخدمات لرفيقك الأليف.",
    openGraph: {
      title: "من نحن | Pets Zone",
      description: "تعرّف على قصتنا، مهمتنا، وما يميزنا في رعاية حيواناتك الأليفة.",
    },
  };
}

const STATS = [
  { icon: Calendar, label: "منذ عام", value: "2019", sub: "رحلة مستمرة" },
  { icon: Building2, label: "فروعنا", value: "5", sub: "في القاهرة الجديدة" },
  { icon: MapPin, label: "نخدم", value: "القاهرة الجديدة", sub: "وأونلاين لجميع المناطق" },
] as const;

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: "ضمان الجودة",
    body: "نختار كل منتج بعناية لنضمن أعلى معايير الجودة والسلامة.",
  },
  {
    icon: Sparkles,
    title: "إرشاد من الخبراء",
    body: "فريقنا المتمرس جاهز دائماً لتقديم توصيات مخصصة ونصائح احترافية تناسب احتياجات حيوانك الأليف.",
  },
  {
    icon: Users,
    title: "الاندماج في المجتمع",
    body: "نفتخر بأن نكون جزءاً من مجتمع القاهرة الجديدة من خلال فعاليات وورش عمل ومبادرات تحتفي بعلاقة الحيوانات الأليفة بأصحابها.",
  },
  {
    icon: Store,
    title: "السهولة والراحة",
    body: "مع خمس فروع في مواقع مريحة، أصبح شراء مستلزمات حيوانك أسهل من أي وقت. كما يتيح لك متجرنا الإلكتروني التسوّق من منزلك بكل راحة.",
  },
] as const;

function FadeUp({
  children,
  className,
  delayMs,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div
      className={cn(
        "opacity-0 animate-fade-in-up motion-reduce:animate-none motion-reduce:opacity-100",
        className
      )}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="relative min-h-[60vh] overflow-hidden bg-gradient-to-b from-primary/[0.07] via-background to-muted/40">
      <div
        className="pointer-events-none absolute -start-[20%] -top-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl motion-reduce:opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-[15%] top-40 h-72 w-72 rounded-full bg-papaya/15 blur-3xl motion-reduce:opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/35 to-transparent"
        aria-hidden
      />

      {/* —— Hero —— */}
      <div className="relative mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16 lg:px-8 lg:pt-20">
        <FadeUp delayMs={40}>
          <header className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/45 p-8 shadow-modern-lg backdrop-blur-xl dark:bg-card/35 md:p-10 lg:p-12">
            <div
              className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/15 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-papaya/10 blur-2xl"
              aria-hidden
            />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary md:text-[11px]"
                  dir="ltr"
                  lang="en"
                >
                  Pets Zone
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-[11px]" dir="ltr" lang="en">
                  About us
                </span>
              </div>
              <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-[3.15rem] lg:leading-[1.12]">
                من نحن
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
                أكثر من متجر — عائلة محبة للحيوانات، ملتزمة بالجودة والثقة في كل تجربة تسوق.
              </p>
              <nav
                className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
                aria-label="مسار التصفح"
              >
                <Link
                  href={ROUTES.home}
                  className="rounded-md px-1 font-medium text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  الرئيسية
                </Link>
                <span className="text-border" aria-hidden>
                  /
                </span>
                <span className="font-medium text-foreground">من نحن</span>
              </nav>
            </div>
          </header>
        </FadeUp>

        {/* —— Metrics —— */}
        <FadeUp className="mt-8 md:mt-10" delayMs={120}>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {STATS.map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className={cn(
                  "group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/55 p-5 shadow-modern backdrop-blur-md",
                  "transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-modern-lg",
                  "motion-reduce:hover:translate-y-0"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-papaya/10 text-primary ring-1 ring-primary/10">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-xl font-bold tracking-tight text-foreground md:text-2xl">{value}</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* —— Editorial grid —— */}
        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14 lg:items-start">
          <div className="space-y-10 lg:col-span-7 lg:space-y-12">
            <FadeUp delayMs={180}>
              <section>
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
                  <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">
                    مرحباً بكم في Pets Zone
                  </h2>
                  <div className="hidden h-px flex-1 max-w-[4rem] bg-gradient-to-l from-primary/50 to-transparent sm:block" aria-hidden />
                </div>
                <div>
                  <p className="text-base leading-[1.85] text-muted-foreground md:text-[1.05rem] md:leading-[1.9]">
                    في <strong className="font-semibold text-foreground">Pets Zone</strong> نحن أكثر من مجرد متجر
                    لاستلزامات الحيوانات الأليفة. نحن عائلة من محبي الحيوانات المتحمسين لتقديم أفضل المنتجات
                    والخدمات لرفيقك ذي الفراء. منذ عام <strong className="text-foreground">2019</strong> ومع{" "}
                    <strong className="text-foreground">خمس فروع</strong> في أنحاء{" "}
                    <strong className="text-foreground">القاهرة الجديدة</strong>، أصبحنا وجهة موثوقة لأصحاب الحيوانات
                    الباحثين عن طعام عالي الجودة وإكسسوارات وكل ما يحتاجه أليفهم.
                  </p>
                </div>
              </section>
            </FadeUp>

            <FadeUp delayMs={230}>
              <section>
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
                  <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">
                    قصتنا
                  </h2>
                </div>
                <p className="text-base leading-[1.85] text-muted-foreground md:text-[1.05rem] md:leading-[1.9]">
                  بدأ كل شيء بحب بسيط للحيوانات. في قلب القاهرة الجديدة انطلقت رحلتنا في 2019 برؤية إنشاء ملاذ
                  للحيوانات الأليفة وأصحابها على حد سواء. وبدفعنا بالتزامنا بالتميز ورفاهية رفقائنا ذوي الفراء،
                  انطلقنا لتقديم مجموعة متنوعة من المنتجات تلبي احتياجات كل حيوان أليف.
                </p>
              </section>
            </FadeUp>
          </div>

          <aside className="lg:col-span-5">
            <FadeUp className="lg:sticky lg:top-28" delayMs={200}>
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-accent/30 to-papaya/[0.08] p-6 shadow-modern-lg backdrop-blur-md md:p-8">
                <HeartHandshake className="relative size-10 text-primary" aria-hidden />
                <h3 className="relative mt-4 text-lg font-semibold text-foreground md:text-xl">مهمتنا</h3>
                <blockquote className="relative mt-4 border-s-4 border-primary ps-5 text-base leading-[1.85] text-foreground/90 md:text-[1.05rem] md:leading-[1.9]">
                  إثراء حياة الحيوانات الأليفة وأصحابها من خلال منتجات فائقة الجودة، ونصائح خبراء، وخدمة عملاء لا
                  مثيل لها. نؤمن أن كل حيوان أليف يستحق الأفضل.
                </blockquote>
                <div className="relative mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button asChild size="sm" className="rounded-xl shadow-md shadow-primary/20">
                    <Link href={ROUTES.shop}>تسوّق الآن</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-xl border-primary/25 bg-background/70">
                    <Link href={ROUTES.contact}>تواصل معنا</Link>
                  </Button>
                </div>
              </div>
            </FadeUp>
          </aside>
        </div>

        {/* —— Feature grid —— */}
        <FadeUp className="mt-16 lg:mt-20" delayMs={260}>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary md:text-[11px]">لماذا نحن</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">ما يميزنا</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground md:text-[0.9375rem]">
              أربعة محاور نبني عليها ثقتكم يومياً.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {DIFFERENTIATORS.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/50 p-6 shadow-modern backdrop-blur-md",
                  "transition-all duration-300 hover:border-primary/25 hover:shadow-modern-lg",
                  "opacity-0 animate-fade-in-up motion-reduce:animate-none motion-reduce:opacity-100"
                )}
                style={{ animationDelay: `${300 + i * 55}ms` }}
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-papaya/10 text-primary ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] md:leading-relaxed">
                      {body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* —— Contact + quote band —— */}
        <FadeUp className="mt-16 lg:mt-20" delayMs={340}>
          <section className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted/25 shadow-modern-lg backdrop-blur-sm dark:bg-muted/15">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="border-b border-border/60 p-8 md:border-b-0 md:border-e md:p-10 lg:p-12">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">تواصل معنا</h2>
                <p className="mt-4 text-base leading-[1.85] text-muted-foreground md:leading-[1.9]">
                  سواء كنت صاحب حيوان أليف مخضرماً أو تتعامل مع تجربة التربية لأول مرة، ندعوك لاكتشاف الفرق مع Pets
                  Zone. زر أحد فروعنا الخمسة في القاهرة الجديدة، أو تسوّق عبر الإنترنت. فريقنا الودود هنا لمساعدتك.
                </p>
              </div>
              <div className="flex flex-col justify-center bg-gradient-to-br from-primary/[0.06] via-accent/25 to-papaya/[0.08] p-8 md:p-10 lg:p-12">
                <p className="text-balance text-center text-lg font-semibold leading-relaxed text-foreground md:text-xl">
                  شكراً لاختياركم Pets Zone
                </p>
                <p className="mt-3 text-center text-sm font-medium text-muted-foreground md:text-base">
                  حيث سعادة كل حيوان أليف هي أولويتنا
                </p>
              </div>
            </div>
          </section>
        </FadeUp>

        {/* —— Bottom CTA —— */}
        <FadeUp className="mt-10 pb-14 md:mt-12 md:pb-16 lg:pb-20" delayMs={400}>
          <div className="flex flex-col items-stretch justify-between gap-6 rounded-2xl border border-border/80 bg-card/40 px-6 py-8 shadow-modern backdrop-blur-md sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-sm font-semibold text-foreground">جاهز للتسوق؟</p>
              <p className="mt-1 text-sm text-muted-foreground">استكشف المنتجات أو راسلنا لأي استفسار.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
              <Button asChild className="rounded-xl px-6 shadow-md shadow-primary/25">
                <Link href={ROUTES.shop}>تصفّح المنتجات</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-primary/30 bg-background/80 px-6">
                <Link href={ROUTES.contact}>صفحة التواصل</Link>
              </Button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
