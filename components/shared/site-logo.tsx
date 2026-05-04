import Image from "next/image";
import Link from "next/link";
import { ROUTES, SITE_NAME } from "@/constants";
import { cn } from "@/lib/utils";

/** Official PETS ZONE mark (PNG, black canvas — works on light header/footer with rounded container in header if needed) */
const LOGO_SRC = "/logo-pets-zone.png";

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
      width={180}
      height={180}
      unoptimized
      className={cn(
        "h-11 w-auto min-w-[88px] max-w-[min(100%,260px)] object-contain object-start md:h-12 md:min-w-[96px] md:max-w-[280px]",
        className
      )}
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
