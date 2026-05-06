import { Headphones, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    icon: Truck,
    title: "توصيل موثوق",
    body: [
      "توصيل داخل القاهرة الجديدة في نفس اليوم.",
      "جميع محافظات مصر خلال 48 ساعة.",
    ] as const,
  },
  {
    icon: ShieldCheck,
    title: "دفع آمن",
    body: "تسوق بثقة لمنتجات حيوانك الأليف بأسعار واضحة",
  },
  {
    icon: Headphones,
    title: "دعم يهتم",
    body: "فريق جاهز يساعدك تختار الأنسب لنوع حيوانك واحتياجاته",
  },
] as const;

export function TrustStrip({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-sky-100/90 bg-gradient-to-b from-sky-50/35 via-white to-muted/20",
        className
      )}
      aria-labelledby="trust-strip-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,oklch(0.72_0.175_62/0.08),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-sky-200/60 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
        <header className="mb-8 text-center md:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/90 md:text-[11px]">لماذا نحن</p>
          <h2
            id="trust-strip-heading"
            className="mt-2 text-xl font-extrabold tracking-tight text-sky-950 md:text-2xl"
          >
            تسوّق بثقة وراحة
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            نرافقك من الطلب حتى الاستلام — توصيل سريع، دفع موثوق، وفريق يهتم براحة حيوانك الأليف.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <article
                className={cn(
                  "group relative flex h-full flex-col gap-4 rounded-2xl border border-sky-100/90 bg-white/95 p-5 shadow-sm ring-1 ring-sky-50/80",
                  "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out",
                  "hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-lg hover:ring-primary/10",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  "md:p-6"
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/25 bg-gradient-to-br from-sky-50 to-white text-primary shadow-inner",
                      "transition-[border-color,box-shadow,transform,color] duration-300 ease-out",
                      "group-hover:border-primary/45 group-hover:text-sky-700 group-hover:shadow-md",
                      "motion-reduce:transition-none"
                    )}
                    aria-hidden
                  >
                    <Icon className="size-[22px] stroke-[1.75]" />
                  </span>
                  <div className="min-w-0 flex-1 text-start">
                    <h3 className="text-base font-bold leading-snug text-sky-950 md:text-lg">{title}</h3>
                    {Array.isArray(body) ? (
                      <ul className="mt-2 list-disc space-y-1.5 pe-4 text-sm leading-relaxed text-muted-foreground marker:text-primary/80 md:text-[15px] md:leading-relaxed">
                        {body.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-relaxed">
                        {body}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
