import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  /** Optional id on the &lt;h2&gt; for `aria-labelledby` */
  titleId?: string;
}

/** Section title block aligned with storefront / Figma-style hierarchy (RTL-friendly accent rail). */
export function SectionHeading({ title, subtitle, eyebrow, className, titleId }: SectionHeadingProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div
        className="mt-0.5 w-1 shrink-0 self-stretch rounded-full bg-gradient-to-b from-primary to-papaya min-h-[2.75rem]"
        aria-hidden
      />
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary/90 md:text-[11px]">{eyebrow}</p>
        ) : null}
        <h2
          id={titleId}
          className="text-balance text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-zinc-600 md:text-[0.9375rem]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
