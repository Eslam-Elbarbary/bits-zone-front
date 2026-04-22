"use client";

import type { ReactNode } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductsListingToolbar } from "@/components/products/products-listing-toolbar";
import { cn } from "@/lib/utils";

interface ProductsShopLayoutProps {
  activeFilterCount?: number;
  filters: ReactNode;
  children: ReactNode;
  /** e.g. result summary line */
  toolbarHint?: ReactNode;
}

export function ProductsShopLayout({
  activeFilterCount = 0,
  filters,
  children,
  toolbarHint,
}: ProductsShopLayoutProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      <ProductsListingToolbar>
        <div className="min-w-0 flex-1 ps-0.5 pe-1 text-start sm:pe-2">
          {toolbarHint ?? (
            <p className="text-sm text-muted-foreground">اضغط «الفلاتر» لضبط البحث والفئة والسعر.</p>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              className={cn(
                "h-11 shrink-0 gap-2 rounded-full border-0 bg-gradient-to-l from-primary to-sky-600 px-5 text-primary-foreground shadow-md shadow-primary/30",
                "transition hover:brightness-[1.04] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
              )}
            >
              <SlidersHorizontal className="size-4 opacity-95" aria-hidden />
              <span className="font-semibold">الفلاتر</span>
              {activeFilterCount > 0 ? (
                <Badge
                  variant="secondary"
                  className="rounded-full border-0 bg-white/25 px-2 py-0 text-[11px] font-bold tabular-nums text-primary-foreground backdrop-blur-sm"
                >
                  {activeFilterCount}
                </Badge>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className={cn(
              "flex h-full max-h-[100dvh] w-full max-w-md flex-col gap-0 overflow-hidden border-s border-border bg-background p-0 shadow-2xl"
            )}
          >
            <SheetHeader className="shrink-0 space-y-0 border-b border-border bg-muted/25 px-5 pb-5 pt-6 text-start">
              <div className="flex items-start gap-3 pe-10">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.08] text-primary">
                  <Filter className="size-[1.25rem]" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <SheetTitle className="text-start text-base font-semibold leading-snug tracking-tight text-foreground md:text-lg">
                    تصفية المنتجات
                  </SheetTitle>
                  <SheetDescription className="mt-1.5 text-start text-sm leading-relaxed text-muted-foreground">
                    اضبط البحث والفئة والسعر والترتيب — تُحدَّث القائمة فوراً مع الرابط.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col bg-muted/15 px-4 pt-4 sm:px-5">{filters}</div>
          </SheetContent>
        </Sheet>
      </ProductsListingToolbar>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
