"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import { HeaderNav } from "@/components/shared/header-nav";
import { SiteLogoLink } from "@/components/shared/site-logo";
import { CART_UPDATED_EVENT } from "@/lib/cart-events";
import { FAVORITES_UPDATED_EVENT } from "@/lib/favorite-events";
import { cn } from "@/lib/utils";

function ActionPill({
  href,
  label,
  children,
  badge,
}: {
  href: string;
  label: string;
  children: ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-label={badge != null && badge > 0 ? `${label} (${badge})` : label}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-full border border-sky-100/90 bg-white/90 text-sky-800 transition-all duration-200",
        "hover:border-primary/25 hover:bg-primary/[0.06] hover:text-primary",
        "active:scale-95 motion-reduce:active:scale-100 md:size-10"
      )}
    >
      {children}
      {badge != null && badge > 0 ? (
        <Badge className="absolute -end-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full border-2 border-white bg-papaya p-0 text-[9px] font-bold leading-none text-papaya-foreground">
          {badge > 99 ? "99+" : badge}
        </Badge>
      ) : null}
    </Link>
  );
}

export function HeaderChrome({
  cartCount: initialCartCount,
  favoriteCount: initialFavoriteCount,
}: {
  cartCount: number;
  favoriteCount: number;
}) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);

  useEffect(() => {
    setCartCount(initialCartCount);
  }, [initialCartCount]);

  useEffect(() => {
    setFavoriteCount(initialFavoriteCount);
  }, [initialFavoriteCount]);

  const refreshCartCount = useCallback(() => {
    fetch("/api/cart/count")
      .then((r) => r.json())
      .then((d: { count?: unknown }) => {
        if (typeof d.count === "number" && Number.isFinite(d.count)) {
          setCartCount(Math.max(0, Math.floor(d.count)));
        }
      })
      .catch(() => {});
  }, []);

  const refreshFavoriteCount = useCallback(() => {
    fetch("/api/favorites/count")
      .then((r) => r.json())
      .then((d: { count?: unknown }) => {
        if (typeof d.count === "number" && Number.isFinite(d.count)) {
          setFavoriteCount(Math.max(0, Math.floor(d.count)));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshCartCount();
    refreshFavoriteCount();
  }, [pathname, refreshCartCount, refreshFavoriteCount]);

  useEffect(() => {
    const onCartUpdated = () => refreshCartCount();
    window.addEventListener(CART_UPDATED_EVENT, onCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, onCartUpdated);
  }, [refreshCartCount]);

  useEffect(() => {
    const onFavoritesUpdated = () => refreshFavoriteCount();
    window.addEventListener(FAVORITES_UPDATED_EVENT, onFavoritesUpdated);
    return () => window.removeEventListener(FAVORITES_UPDATED_EVENT, onFavoritesUpdated);
  }, [refreshFavoriteCount]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="border-b border-sky-200/40 bg-[linear-gradient(180deg,oklch(0.98_0.02_245/0.6)_0%,oklch(0.99_0.01_245/0.4)_100%)] px-3 py-2 md:px-4 md:py-2">
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center gap-2 md:gap-3",
            "rounded-2xl border border-sky-200/50 bg-white/80 px-2.5 py-2 backdrop-blur-md md:px-3 md:py-2"
          )}
        >
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <SiteLogoLink
              priority
              className="min-w-0 rounded-xl shadow-sm ring-1 ring-black/15 transition-opacity hover:opacity-95"
              imageClassName="h-12 w-auto max-w-[min(100%,200px)] object-contain object-center md:h-14 md:max-w-[240px]"
            />
            <MobileNav />
          </div>

          <HeaderNav className="hidden min-w-0 flex-1 justify-center md:flex" variant="inline" />

          <div className="ms-auto flex shrink-0 items-center gap-1 md:gap-1.5">
            <ActionPill href={ROUTES.search} label="بحث المنتجات">
              <Search className="size-[1.05rem] md:size-[1.15rem]" strokeWidth={2} />
            </ActionPill>
            <ActionPill href={ROUTES.favorites} label="المفضلة" badge={favoriteCount}>
              <Heart className="size-[1.05rem] md:size-[1.15rem]" strokeWidth={2} />
            </ActionPill>
            <ActionPill href={ROUTES.profile} label="حسابي">
              <User className="size-[1.05rem] md:size-[1.15rem]" strokeWidth={2} />
            </ActionPill>
            <ActionPill href={ROUTES.cart} label="سلة التسوق" badge={cartCount}>
              <ShoppingBag className="size-[1.05rem] md:size-[1.15rem]" strokeWidth={2} />
            </ActionPill>
          </div>
        </div>

        <div className="mx-auto mt-2 max-w-7xl md:hidden">
          <HeaderNav variant="mobileBar" />
        </div>
        </div>
      </header>
      <div aria-hidden className="h-[7.25rem] md:h-[5.75rem]" />
    </>
  );
}
