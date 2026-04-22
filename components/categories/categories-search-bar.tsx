"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export function CategoriesSearchBar({ defaultQuery }: { defaultQuery: string }) {
  return (
    <form
      action={ROUTES.categories}
      method="get"
      className={cn(
        "mx-auto flex w-full max-w-2xl items-stretch gap-2 overflow-hidden rounded-2xl border border-primary/20 bg-white/80 p-1.5 shadow-modern backdrop-blur-xl",
        "ring-1 ring-black/[0.04] focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/12"
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="ابحث عن اسم فئة…"
          dir="rtl"
          className="h-11 border-0 bg-transparent pe-10 shadow-none focus-visible:ring-0"
          aria-label="بحث في الفئات"
        />
      </div>
      <Button type="submit" className="h-11 shrink-0 rounded-xl px-6 shadow-md shadow-primary/20">
        بحث
      </Button>
    </form>
  );
}
