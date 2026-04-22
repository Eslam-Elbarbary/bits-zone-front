import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Star, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import {
  formatVendorRating,
  vendorDisplayName,
  vendorHeroImage,
  vendorListLocationHint,
  vendorProductsCount,
} from "@/lib/vendor-utils";
import { imageSrcIsRemote } from "@/lib/product-utils";
import type { Vendor } from "@/types/api";
import { cn } from "@/lib/utils";

export function VendorCard({ vendor, className }: { vendor: Vendor; className?: string }) {
  const href = ROUTES.vendor(vendor.id);
  const name = vendorDisplayName(vendor);
  const img = vendorHeroImage(vendor);
  const verified = vendor.is_verified === true;
  const count = vendorProductsCount(vendor);
  const locationHint = vendorListLocationHint(vendor);

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-sky-100/90 bg-white/95 shadow-sm ring-1 ring-sky-50 transition-all",
        "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:ring-primary/10",
        className
      )}
    >
      <div className="relative aspect-[5/3] bg-gradient-to-br from-sky-50 to-sky-100/80">
        {img ? (
          <Image
            src={img}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            unoptimized={imageSrcIsRemote(img)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sky-300">
            <Store className="size-14" aria-hidden />
          </div>
        )}
        {verified ? (
          <Badge className="absolute end-3 top-3 border-0 bg-emerald-600/95 text-[10px] font-bold text-white shadow-md">
            <BadgeCheck className="ms-0.5 size-3" aria-hidden />
            معتمد
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-start text-base font-bold leading-snug text-sky-950 group-hover:text-primary">
            {name}
          </h3>
        </div>
        {locationHint ? (
          <p className="flex items-start gap-1.5 text-start text-[11px] leading-snug text-sky-700/90">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary/80" aria-hidden />
            <span className="line-clamp-2">{locationHint}</span>
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-sky-800">
            <Star className="size-3.5 fill-papaya text-papaya" aria-hidden />
            <span className="tabular-nums">{formatVendorRating(vendor)}</span>
          </span>
          {count != null && count > 0 ? (
            <span className="tabular-nums text-[11px]">{count} منتج</span>
          ) : (
            <span className="text-[11px]">تصفح المتجر</span>
          )}
        </div>
      </div>
    </Link>
  );
}
