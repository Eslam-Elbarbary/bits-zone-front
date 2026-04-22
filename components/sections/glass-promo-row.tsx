import Link from "next/link";
import { Gift, Sparkles, Tag } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const TILES = [
  {
    icon: Tag,
    title: "عروض اليوم",
    desc: "تخفيضات على التغذية والحفاضات وملابس الأطفال",
    href: `${ROUTES.products}?sort=price_asc`,
    accent: "from-primary/20 via-primary/5 to-transparent",
  },
  {
    icon: Gift,
    title: "هدايا ومفاجآت",
    desc: "عروض موسمية وهدايا مولود — تابع التحديثات من الرئيسية",
    href: ROUTES.products,
    accent: "from-papaya/25 via-papaya/8 to-transparent",
  },
  {
    icon: Sparkles,
    title: "وصل حديثاً",
    desc: "أحدث المستلزمات والألعاب التعليمية لعمر طفلك",
    href: `${ROUTES.products}?sort=latest`,
    accent: "from-sky-400/15 via-primary/8 to-transparent",
  },
] as const;

export function GlassPromoRow({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-zinc-200/60 bg-gradient-to-b from-muted/30 to-transparent py-10 md:py-12",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_80%_0%,oklch(0.72_0.17_62/0.12),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_10%_100%,oklch(0.58_0.12_245/0.1),transparent_55%)] animate-glass-glint motion-reduce:animate-none"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3">
        {TILES.map(({ icon: Icon, title, desc, href, accent }) => (
          <Link
            key={title}
            href={href}
            className={cn(
              "glass-surface group/promo relative overflow-hidden rounded-2xl p-5",
              "bg-gradient-to-br transition-[transform,box-shadow,border-color] duration-300",
              "hover:-translate-y-1 hover:animate-rgb-glow hover:border-white/70",
              "motion-reduce:hover:translate-y-0 motion-reduce:hover:animate-none",
              accent
            )}
          >
            <span
              className="pointer-events-none absolute -end-6 -top-6 size-24 rounded-full bg-white/30 blur-2xl transition-opacity duration-500 group-hover/promo:opacity-90 motion-reduce:opacity-40"
              aria-hidden
            />
            <Icon className="relative size-8 text-primary" aria-hidden />
            <h3 className="relative mt-3 text-base font-bold text-zinc-900">{title}</h3>
            <p className="relative mt-1 text-xs leading-relaxed text-zinc-600 md:text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
