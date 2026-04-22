import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants";
import type { CartDisplayLine } from "@/components/cart/cart-lines";
import {
  lineDisplayTitle,
  lineProductId,
  lineQuantity,
  lineRowTotal,
  lineUnitPrice,
} from "@/lib/cart-utils";
import { formatPrice, imageSrcIsRemote } from "@/lib/product-utils";

/** Order preview: same images and prices as cart (GET /api/cart + product enrichment). */
export function CheckoutCartSummary({ lines }: { lines: CartDisplayLine[] }) {
  if (lines.length === 0) return null;

  return (
    <div className="max-h-[min(50vh,22rem)] space-y-3 overflow-y-auto pr-1">
      {lines.map(({ line, imageSrc }, idx) => {
        const pid = lineProductId(line);
        const title = lineDisplayTitle(line);
        const qty = lineQuantity(line);
        const unit = lineUnitPrice(line);
        const row = lineRowTotal(line);
        const inner = (
          <>
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-sky-50/80 ring-1 ring-sky-100/70">
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-contain p-1"
                sizes="56px"
                unoptimized={imageSrcIsRemote(imageSrc)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-sky-950">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                ×{qty}
                {unit != null ? (
                  <span className="ms-2 tabular-nums">· {formatPrice(unit)}</span>
                ) : null}
              </p>
            </div>
            {row != null ? (
              <span className="shrink-0 text-sm font-bold tabular-nums text-primary">{formatPrice(row)}</span>
            ) : null}
          </>
        );
        if (pid) {
          return (
            <Link
              key={`${pid}-${idx}`}
              href={ROUTES.product(pid)}
              className="flex gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-sky-200/80 hover:bg-sky-50/50"
            >
              {inner}
            </Link>
          );
        }
        return (
          <div key={idx} className="flex gap-3 rounded-xl p-2">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
