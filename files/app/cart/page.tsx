import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartActions } from "@/components/cart/cart-actions";
import { CartLines } from "@/components/cart/cart-lines";
import { ROUTES } from "@/constants";
import { getCart } from "@/lib/api";
import { enrichCartLinesForDisplay } from "@/lib/cart-display";
import { cartDiscountFields, cartItemsFromResponse, cartMonetaryFields } from "@/lib/cart-utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سلة التسوق",
    description: "راجع منتجاتك قبل إتمام الطلب.",
  };
}

export default async function CartPage() {
  let items: unknown[] = [];
  let displayLines: Awaited<ReturnType<typeof enrichCartLinesForDisplay>> = [];
  let authRequired = false;
  let tax: number | string | undefined;
  let shipping: number | string | undefined;
  let discount: number | string | undefined;
  let couponLabel: string | null | undefined;

  try {
    const res = await getCart();
    items = cartItemsFromResponse(res.data);
    displayLines = await enrichCartLinesForDisplay(items);
    const m = cartMonetaryFields(res.data);
    tax = m.tax;
    shipping = m.shipping;
    const d = cartDiscountFields(res.data);
    discount = d.discount;
    couponLabel = d.couponLabel;
  } catch {
    authRequired = true;
  }

  if (authRequired) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">سلة التسوق</h1>
        <p className="mt-4 text-muted-foreground">سجّل الدخول لعرض سلتك وإكمال الطلب.</p>
        <Button asChild className="mt-6 bg-primary">
          <Link href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.cart)}`}>تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">سلة التسوق</h1>
      <CartLines
        displayLines={displayLines}
        liveSummary={{
          tax,
          shipping,
          discount,
          couponLabel: couponLabel ?? null,
        }}
      />

      {items.length > 0 ? (
        <>
          <CartActions />
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href={ROUTES.shop}>متابعة التسوق</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href={ROUTES.checkout}>إتمام الطلب</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-8 flex justify-end">
          <Button asChild variant="secondary">
            <Link href={ROUTES.shop}>متابعة التسوق</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
