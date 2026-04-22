"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Heart, Menu, MessageSquare, Package, Search, ShoppingBag, Sparkles, User, UserPlus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SiteLogoLink } from "@/components/shared/site-logo";
import { HEADER_NAV_LINKS, ROUTES, SITE_NAME } from "@/constants";
import { cn } from "@/lib/utils";

const extraLinks = [
  { href: ROUTES.favorites, label: "المفضلة", icon: Heart },
  { href: ROUTES.cart, label: "سلة التسوق", icon: ShoppingBag },
  { href: ROUTES.checkout, label: "إتمام الطلب", icon: CreditCard },
  { href: ROUTES.orders, label: "طلباتي", icon: Package },
  { href: ROUTES.tickets, label: "تذاكر الدعم", icon: MessageSquare },
  { href: ROUTES.points, label: "سجل النقاط", icon: Sparkles },
  { href: ROUTES.wallet, label: "سجل المحفظة", icon: Wallet },
  { href: ROUTES.profile, label: "الملف الشخصي", icon: User },
  { href: ROUTES.login, label: "تسجيل الدخول", icon: User },
  { href: ROUTES.register, label: "إنشاء حساب", icon: UserPlus },
  { href: ROUTES.privacy, label: "سياسة الخصوصية", icon: Package },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden size-9 rounded-full border border-sky-100/90 bg-white/90 text-sky-800 hover:border-primary/25 hover:bg-primary/[0.06] hover:text-primary"
          aria-label="فتح القائمة"
        >
          <Menu className="size-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[min(100vw-2rem,20rem)] flex-col border-sky-200/50 bg-gradient-to-b from-white via-sky-50/30 to-white p-0"
      >
        <SheetHeader className="border-b border-sky-100/80 bg-gradient-to-br from-primary/10 via-white to-papaya/10 px-5 pb-5 pt-6 text-start">
          <div className="mb-3 flex items-center justify-between gap-2">
            <SheetTitle className="text-start text-lg font-bold text-sky-950">القائمة</SheetTitle>
          </div>
          <p className="text-start text-xs font-medium text-sky-700/80">{SITE_NAME}</p>
          <div className="mt-4 rounded-xl border border-white/80 bg-white/90 p-2 shadow-sm ring-1 ring-sky-100">
            <SiteLogoLink priority={false} className="justify-center" />
          </div>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="جوال">
          <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
            تصفّح
          </p>
          {HEADER_NAV_LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sky-900 hover:bg-white/80 hover:text-primary"
                )}
              >
                {l.label}
              </Link>
            );
          })}

          <Link
            href={ROUTES.search}
            className="mx-3 mt-2 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-3 text-sm font-semibold text-primary"
          >
            <Search className="size-4 shrink-0" aria-hidden />
            بحث في المنتجات
          </Link>

          <p className="mb-1 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
            حسابك
          </p>
          {extraLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sky-800 hover:bg-white/80"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-sky-100/80 text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
