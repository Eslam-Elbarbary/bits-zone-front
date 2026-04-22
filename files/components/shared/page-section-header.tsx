import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageSectionHeaderProps {
  /** Main heading (e.g. page H1 or section H2) */
  title: string;
  /** Supporting line under the title */
  description?: ReactNode;
  /** Eyebrow / kicker above title */
  eyebrow?: string;
  className?: string;
  /** When true, use larger typography for top-of-page heroes */
  size?: "section" | "hero";
}

/**
 * Consistent title + subtitle stack for pages and major sections (RTL, Arabic-first).
 */
export function PageSectionHeader({
  title,
  description,
  eyebrow,
  className,
  size = "section",
}: PageSectionHeaderProps) {
  const isHero = size === "hero";
  return (
    <header className={cn("text-balance", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 font-bold uppercase tracking-[0.18em] text-primary/85",
            isHero ? "text-xs sm:text-[13px]" : "text-[10px] sm:text-[11px]"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      {isHero ? (
        <h1
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-tight"
        >
          {title}
        </h1>
      ) : (
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
      )}
      {description ? (
        <div
          className={cn(
            "mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground",
            isHero ? "text-sm sm:text-base" : "text-sm"
          )}
        >
          {description}
        </div>
      ) : null}
    </header>
  );
}
