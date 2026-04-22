import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";
import type { Category } from "@/types/api";
import { ROUTES } from "@/constants";
import { resolveImageSrc, imageSrcIsRemote } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

const TILE_BACKDROPS = [
  "from-sky-400/25 via-cyan-300/15 to-blue-100/40",
  "from-amber-400/25 via-orange-300/20 to-papaya/30",
  "from-violet-400/22 via-fuchsia-300/15 to-pink-100/35",
  "from-emerald-400/22 via-teal-300/15 to-cyan-50/40",
  "from-rose-400/22 via-pink-300/18 to-red-50/35",
  "from-indigo-400/22 via-blue-300/15 to-sky-50/40",
  "from-lime-500/20 via-green-300/15 to-emerald-50/35",
  "from-fuchsia-400/22 via-purple-300/15 to-violet-50/35",
] as const;

const TILE_RINGS = [
  "group-hover/tile:ring-sky-400/40 hover:shadow-sky-500/20",
  "group-hover/tile:ring-amber-400/45 hover:shadow-amber-500/20",
  "group-hover/tile:ring-violet-400/40 hover:shadow-violet-500/20",
  "group-hover/tile:ring-emerald-400/40 hover:shadow-emerald-500/20",
  "group-hover/tile:ring-rose-400/40 hover:shadow-rose-500/20",
  "group-hover/tile:ring-indigo-400/40 hover:shadow-indigo-500/20",
  "group-hover/tile:ring-lime-500/35 hover:shadow-lime-600/20",
  "group-hover/tile:ring-fuchsia-400/40 hover:shadow-fuchsia-500/20",
] as const;

function categoryTitle(cat: Category): string {
  if (typeof cat.name_ar === "string" && cat.name_ar.trim()) return cat.name_ar;
  return String(cat.name ?? "");
}

interface CategoryDirectoryTileProps {
  cat: Category;
  index: number;
}

export function CategoryDirectoryTile({ cat, index }: CategoryDirectoryTileProps) {
  const title = categoryTitle(cat);
  const href = `${ROUTES.products}?category_id=${cat.id}`;
  const raw = cat.image != null ? resolveImageSrc(cat.image) : null;
  const img =
    raw && raw !== "/ui/placeholder-product.svg" ? raw : null;
  const count = typeof cat.products_count === "number" ? cat.products_count : undefined;
  const children = Array.isArray(cat.children) ? cat.children : [];
  const subs = children.slice(0, 5);
  const backdrop = TILE_BACKDROPS[index % TILE_BACKDROPS.length]!;
  const ringGlow = TILE_RINGS[index % TILE_RINGS.length]!;

  return (
    <article
      className={cn(
        "opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none"
      )}
      style={{ animationDelay: `${60 + Math.min(index, 11) * 45}ms` }}
    >
      <div
        className={cn(
          "group/tile relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-modern ring-1 ring-black/[0.05]",
          "backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-2 hover:bg-white/70 hover:shadow-2xl",
          "hover:ring-2 motion-reduce:hover:translate-y-0",
          ringGlow,
          "motion-reduce:transition-none"
        )}
      >
        <div className={cn("relative aspect-[5/3] overflow-hidden bg-gradient-to-br", backdrop)}>
          {img ? (
            <Image
              src={img}
              alt=""
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover/tile:scale-[1.06] motion-reduce:group-hover/tile:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized={imageSrcIsRemote(img)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="size-16 text-white/50 drop-shadow-md" aria-hidden />
            </div>
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100 motion-reduce:opacity-0"
            aria-hidden
          >
            <div className="absolute inset-0 w-[200%] -translate-x-full bg-[linear-gradient(100deg,transparent_40%,rgba(255,255,255,0.35)_50%,transparent_60%)] transition-transform duration-700 group-hover/tile:translate-x-full" />
          </div>
          <Link
            href={href}
            className="absolute inset-0 z-[1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <span className="sr-only">تصفح {title}</span>
          </Link>
          <div className="absolute inset-x-0 bottom-0 z-[2] p-4 pt-8">
            <h2 className="text-balance text-lg font-bold leading-tight text-white drop-shadow-md md:text-xl">
              {title}
            </h2>
            {count !== undefined ? (
              <p className="mt-1 text-xs font-medium text-white/85">{count} منتج</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
          {subs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {subs.map((sub) => (
                <Link
                  key={sub.id}
                  href={`${ROUTES.products}?category_id=${sub.id}`}
                  className="rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/15 transition-all hover:bg-primary/15 hover:ring-primary/30"
                >
                  {categoryTitle(sub)}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">تصفح كل المنتجات في هذه الفئة</p>
          )}
          <Link
            href={href}
            className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            عرض المنتجات
            <ChevronLeft className="size-4 transition-transform group-hover/tile:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
