import Image from "next/image";
import Link from "next/link";
import { ROUTES, SITE_NAME } from "@/constants";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo-pets-zone.svg";

export function SiteLogo({
  className,
  priority,
}: {
  className?: string;
  /** LCP: set true in header */
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt={SITE_NAME}
      width={210}
      height={50}
      unoptimized
      className={cn("h-9 w-auto min-w-[140px] max-w-[min(100%,260px)] object-contain object-start md:h-10 md:min-w-[160px]", className)}
      priority={priority}
    />
  );
}

export function SiteLogoLink({
  className,
  imageClassName,
  priority,
}: {
  className?: string;
  /** Applied to the logo image (e.g. filters on dark footer) */
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={ROUTES.home}
      className={cn(
        "group/logo inline-flex shrink-0 items-center transition-[transform,opacity] duration-200 hover:opacity-95 motion-reduce:transition-none",
        className
      )}
    >
      <SiteLogo
        priority={priority}
        className={cn(
          "motion-safe:group-hover/logo:scale-[1.02] motion-reduce:group-hover/logo:scale-100",
          imageClassName
        )}
      />
    </Link>
  );
}
