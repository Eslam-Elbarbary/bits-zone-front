"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export function ProductSearchForm({ defaultSearch = "" }: { defaultSearch?: string }) {
  return (
    <form action={ROUTES.products} method="get" className="space-y-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-primary/75"
          aria-hidden
        />
        <Input
          name="search"
          type="search"
          defaultValue={defaultSearch}
          placeholder="ما الذي تبحث عنه؟"
          className={cn(
            "h-14 rounded-full border-border bg-background pe-14 ps-5 text-base shadow-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
          )}
          dir="rtl"
          autoComplete="off"
          autoFocus
          aria-label="نص البحث"
        />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="submit"
          className="h-11 min-w-[7rem] rounded-full px-8 font-semibold shadow-md shadow-primary/20"
        >
          بحث
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-full border-border px-6" asChild>
          <Link href={ROUTES.products}>كل المنتجات</Link>
        </Button>
      </div>
    </form>
  );
}
