"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";

interface HeaderNavProps {
  className?: string;
  /** inline: صف واحد داخل الهيدر — mobileBar: شريط أفقي قابل للتمرير على الجوال */
  variant?: "below" | "inline" | "mobileBar";
}

export function HeaderNav({ className, variant = "below" }: HeaderNavProps) {
  const pathname = usePathname();

  const isInline = variant === "inline";
  const isMobileBar = variant === "mobileBar";

  return (
    <nav
      className={cn(
        !isInline && !isMobileBar && "flex flex-wrap items-center gap-1 border-t border-sky-100/80 pt-3 md:gap-2 md:pt-3.5",
        isInline &&
          "flex flex-nowrap items-center justify-center gap-0.5 overflow-x-auto overscroll-x-contain py-0.5 [scrollbar-width:none] md:gap-1 [&::-webkit-scrollbar]:hidden",
        isMobileBar &&
          "flex flex-nowrap items-center gap-1 overflow-x-auto overscroll-x-contain rounded-xl border border-sky-100/70 bg-white/60 px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      aria-label="التنقل الرئيسي"
    >
      {HEADER_NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative shrink-0 whitespace-nowrap rounded-lg font-medium transition-colors",
              isInline && "px-2 py-1 text-[12px] md:px-2.5 md:py-1.5 md:text-[13px]",
              isMobileBar && "px-2.5 py-1.5 text-[12px]",
              !isInline && !isMobileBar && "px-3 py-2 text-[13px] md:px-3.5",
              active ? "text-primary" : "text-sky-800/75 hover:bg-sky-50/90 hover:text-sky-950"
            )}
          >
            {label}
            <span
              className={cn(
                "absolute inset-x-1.5 -bottom-px h-0.5 rounded-full bg-gradient-to-l from-primary to-papaya transition-opacity duration-200",
                active ? "opacity-100" : "opacity-0"
              )}
              aria-hidden
            />
          </Link>
        );
      })}
    </nav>
  );
}
