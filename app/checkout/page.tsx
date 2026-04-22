import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles } from "lucide-react";
import { addAddressCheckoutAction } from "@/app/actions/addresses";
import { placeOrderAction } from "@/app/actions/checkout";
import { CheckoutAddressGeoFields } from "@/components/checkout/checkout-address-geo-fields";
import { CheckoutCartSummary } from "@/components/checkout/checkout-cart-summary";
import { CheckoutPaymentPanel } from "@/components/checkout/checkout-payment-panel";
import { CheckoutShippingLive } from "@/components/checkout/checkout-shipping-live";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { extractList } from "@/lib/api-data";
import { calculateShipping, getAddresses, getCart } from "@/lib/api";
import { enrichCartLinesForDisplay } from "@/lib/cart-display";
import { shippingTotalFromApiData } from "@/lib/checkout-utils";
import {
  cartDiscountFields,
  cartItemsFromResponse,
  cartMonetaryFields,
  checkoutGrandTotal,
} from "@/lib/cart-utils";
import { formatPrice } from "@/lib/product-utils";
import type { Address } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "إتمام الطلب",
    description: "اختر عنوان التوصيل وطريقة الدفع وأكمل طلبك.",
  };
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;

  let cartPayload: unknown;
  try {
    const res = await getCart();
    cartPayload = res.data;
  } catch {
    redirect(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.checkout)}`);
  }

  const items = cartItemsFromResponse(cartPayload);
  if (items.length === 0) {
    redirect(ROUTES.cart);
  }

  const displayLines = await enrichCartLinesForDisplay(items);

  const { tax, shipping } = cartMonetaryFields(cartPayload);
  const { discount, couponLabel } = cartDiscountFields(cartPayload);

  let addresses: Address[] = [];
  try {
    const addrRes = await getAddresses();
    addresses = extractList<Address>(addrRes.data);
  } catch {
    addresses = [];
  }

  const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0];

  let shipTotal: number | null = null;
  let shipErr: string | null = null;
  if (defaultAddr?.id != null) {
    try {
      const sRes = await calculateShipping(Number(defaultAddr.id));
      shipTotal = shippingTotalFromApiData(sRes.data);
    } catch {
      shipErr = "تعذر عرض تقدير الشحن الآن. يمكنك المتابعة؛ سيُحدَّث المبلغ عند التأكيد.";
    }
  }

  const { subtotal: orderSub, grand: orderGrand } = checkoutGrandTotal({
    cartData: cartPayload,
    discount,
    shippingFromAddress: shipTotal,
  });

  const shippingForDisplay = shipTotal != null ? shipTotal : shipping;
  const showShippingRow =
    shipTotal != null || (shipping != null && String(shipping).trim() !== "");

  return (
    <div className="relative min-h-[70vh]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 h-64 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,oklch(0.72_0.175_62/0.12),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary/80">الدفع الآمن</p>
            <h1 className="text-2xl font-bold tracking-tight text-sky-950 md:text-3xl">إتمام الطلب</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              راجع الملخص، اختر العنوان، ثم طريقة الدفع. يُنشأ الطلب عبر واجهة الطلبات ثم يُسجَّل الدفع عند
              اختيارك لذلك.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 border-sky-200/80">
            <Link href={ROUTES.cart}>العودة للسلة</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[min(100%,380px)_minmax(0,1fr)] lg:items-start">
          {/* Sidebar: summary — first in DOM reads as end column in RTL */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="overflow-hidden border-sky-200/50 shadow-md ring-1 ring-sky-100/60">
              <CardHeader className="border-b border-sky-100/80 bg-gradient-to-l from-sky-50/60 to-white pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5 text-primary" aria-hidden />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-4 text-sm">
                <CheckoutCartSummary lines={displayLines} />
                <Separator className="my-1 bg-sky-100/80" />
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">الأصناف</span>
                  <span className="font-semibold tabular-nums">{items.length}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-semibold tabular-nums">{formatPrice(orderSub)}</span>
                </div>
                {showShippingRow ? (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {shipTotal != null ? "الشحن" : "الشحن (من السلة)"}
                    </span>
                    <span className="font-semibold tabular-nums">{formatPrice(shippingForDisplay)}</span>
                  </div>
                ) : null}
                {tax != null && String(tax).trim() !== "" ? (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">الضريبة</span>
                    <span className="font-semibold tabular-nums">{formatPrice(tax)}</span>
                  </div>
                ) : null}
                {(() => {
                  if (discount == null || String(discount).trim() === "") return null;
                  const dNum = typeof discount === "number" ? discount : parseFloat(String(discount));
                  if (!Number.isFinite(dNum) || dNum === 0) return null;
                  return (
                    <div className="flex justify-between gap-3 text-emerald-700">
                      <span className="font-medium">
                        الخصم{couponLabel ? ` (${couponLabel})` : ""}
                      </span>
                      <span className="font-bold tabular-nums">−{formatPrice(Math.abs(dNum))}</span>
                    </div>
                  );
                })()}
                <Separator className="my-1 bg-sky-100/80" />
                <div className="flex justify-between gap-2 text-base">
                  <span className="font-bold text-sky-950">الإجمالي</span>
                  <span className="text-lg font-extrabold tabular-nums text-primary">
                    {formatPrice(orderGrand)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start gap-3 rounded-2xl border border-sky-100/90 bg-white/90 p-4 text-xs leading-relaxed text-sky-800 shadow-sm ring-1 ring-sky-50">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
              <div>
                <p className="font-bold text-sky-950">دفع موثوق</p>
                <p className="mt-1 text-muted-foreground">
                  بيانات الدفع تُرسل وفق تدفق الخادم الخاص بك. لا نخزّن بيانات البطاقة في واجهة المتجر.
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            {addresses.length === 0 ? (
              <Card className="border-sky-200/50 shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle>عنوان التوصيل</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-4 text-sm text-muted-foreground">
                    لا يوجد عنوان محفوظ. أضف عنواناً لإتمام الطلب.
                  </p>
                  <form action={addAddressCheckoutAction} className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addr-name">الاسم</Label>
                      <Input id="addr-name" name="name" required placeholder="اسم المستلم" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-line">العنوان بالتفصيل</Label>
                      <Input id="addr-line" name="address" required placeholder="الشارع، المبنى، الدور…" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="addr-phone">الجوال</Label>
                        <Input id="addr-phone" name="phone" type="tel" dir="ltr" placeholder="05xxxxxxxx" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addr-city">المدينة</Label>
                        <Input id="addr-city" name="city" placeholder="اختياري" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-state">المحافظة / المنطقة</Label>
                      <Input id="addr-state" name="state" placeholder="اختياري" />
                    </div>
                    <CheckoutAddressGeoFields idPrefix="checkout-first" />
                    <Button type="submit" className="w-full sm:w-auto">
                      حفظ العنوان والمتابعة
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : null}

            {addresses.length > 0 ? (
              <Card className="border-sky-200/50 shadow-md ring-1 ring-sky-100/40">
                <CardHeader className="border-b border-sky-100/80 bg-gradient-to-l from-white to-sky-50/30">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary/90">الخطوة ٢</p>
                      <CardTitle className="text-xl">التفاصيل والدفع</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form action={placeOrderAction} className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="address_id" className="text-sm font-semibold">
                        عنوان التوصيل
                      </Label>
                      <select
                        id="address_id"
                        name="address_id"
                        required
                        defaultValue={defaultAddr ? String(defaultAddr.id) : ""}
                        className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                      >
                        {addresses.map((a) => (
                          <option key={a.id} value={String(a.id)}>
                            {a.name} — {a.address}
                            {a.city ? ` (${a.city})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <CheckoutShippingLive initialTotal={shipTotal} initialError={shipErr} />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="coupon_code">كوبون خصم</Label>
                        <Input
                          id="coupon_code"
                          name="coupon_code"
                          dir="ltr"
                          placeholder="اختياري"
                          className="text-start"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="notes">ملاحظات للطلب</Label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                          placeholder="اختياري"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-sky-100/90 bg-muted/15 p-4 ring-1 ring-sky-50">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sky-800/80">
                        المحفظة والنقاط
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-white/80 px-3 py-3 shadow-sm transition-colors hover:border-primary/20 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/[0.04]">
                          <input type="checkbox" name="use_wallet" value="1" className="size-4 rounded border-sky-200 accent-primary" />
                          <span className="text-sm font-medium leading-snug text-sky-950">استخدام رصيد المحفظة</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-white/80 px-3 py-3 shadow-sm transition-colors hover:border-primary/20 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/[0.04]">
                          <input type="checkbox" name="use_points" value="1" className="size-4 rounded border-sky-200 accent-primary" />
                          <span className="text-sm font-medium leading-snug text-sky-950">استخدام نقاط الولاء</span>
                        </label>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-sky-200/60 bg-gradient-to-br from-sky-50/50 via-white to-papaya/[0.07] p-5 shadow-sm ring-1 ring-sky-100/50">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">الخطوة ٣</p>
                          <Label className="text-base font-bold text-sky-950">طريقة الدفع</Label>
                        </div>
                      </div>
                      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                        بعد إنشاء الطلب، نُسجِّل الدفع تلقائياً عند اختيار طريقة أدناه. خيار «لاحقاً» يُنشئ الطلب فقط
                        لتكمل الدفع من صفحة الطلب.
                      </p>
                      <CheckoutPaymentPanel />
                    </div>

                    <Button type="submit" size="lg" className="h-12 w-full text-base font-bold shadow-md">
                      تأكيد الطلب
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2 border-t border-sky-100/80 bg-sky-50/20 sm:flex-row sm:justify-between">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    عند اختيار الدفع لاحقاً، افتح الطلب من «طلباتي» واستخدم زر الدفع هناك.
                  </p>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={ROUTES.shop}>متابعة التسوق</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : null}

            {addresses.length > 0 ? (
              <Card className="border-dashed border-sky-200/70">
                <CardHeader className="border-b pb-3">
                  <CardTitle className="text-base">عنوان توصيل إضافي</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-3 text-xs text-muted-foreground">أضف عنواناً جديداً إن احتجت.</p>
                  <form action={addAddressCheckoutAction} className="grid gap-3 sm:grid-cols-2">
                    <Input name="name" required placeholder="الاسم" />
                    <Input name="phone" type="tel" dir="ltr" placeholder="الجوال" />
                    <Input name="address" required placeholder="العنوان" className="sm:col-span-2" />
                    <Input name="city" placeholder="المدينة" />
                    <Input name="state" placeholder="المحافظة" />
                    <CheckoutAddressGeoFields idPrefix="checkout-extra" className="sm:col-span-2" />
                    <Button type="submit" variant="outline" className="sm:col-span-2">
                      إضافة عنوان
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
