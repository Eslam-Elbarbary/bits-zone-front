import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import {
  calculateShipping,
  cancelOrder,
  getAddresses,
  getOrderById,
  payOrder,
  reorder,
  requestRefund,
} from "@/lib/api";
import { extractList } from "@/lib/api-data";
import { rethrowIfRedirect } from "@/lib/server-actions";
import { formatPrice } from "@/lib/product-utils";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import type { Address, ApiUser, Order } from "@/types/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `طلب #${id}`,
    description: "تفاصيل الطلب والإجراءات المتاحة.",
  };
}

function extractOrder(data: unknown): Order | null {
  if (!data) return null;
  if (typeof data === "object" && data !== null && "id" in data) {
    return data as Order;
  }
  if (
    typeof data === "object" &&
    data !== null &&
    "order" in data &&
    typeof (data as { order: unknown }).order === "object"
  ) {
    const o = (data as { order: Order }).order;
    if (o && "id" in o) return o;
  }
  return null;
}

function money(v: unknown): string {
  if (v == null || v === "") return "—";
  return formatPrice(v as number | string);
}

function StatusBadge({ status, label }: { status?: string; label?: string }) {
  const s = (status ?? "").toLowerCase();
  const variant =
    s.includes("cancel") || s.includes("refus") || s.includes("fail")
      ? "destructive"
      : s.includes("paid") || s.includes("complete") || s.includes("deliver")
        ? "default"
        : "secondary";
  return (
    <Badge variant={variant}>
      {label ? `${label}: ` : ""}
      {status ?? "—"}
    </Badge>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-end">{value}</span>
    </div>
  );
}

function orderLineItems(order: Order): unknown[] {
  const o = order as Record<string, unknown>;
  if (Array.isArray(o.items)) return o.items;
  if (Array.isArray(o.order_items)) return o.order_items;
  if (Array.isArray(o.lines)) return o.lines;
  return [];
}

function lineLabel(line: unknown): string {
  if (!line || typeof line !== "object") return "صنف";
  const row = line as Record<string, unknown>;
  const p = row.product;
  if (p && typeof p === "object") {
    const pr = p as Record<string, unknown>;
    const n = pr.name_ar ?? pr.name;
    if (typeof n === "string" && n.trim()) return n;
  }
  if (typeof row.name === "string") return row.name;
  return "صنف";
}

function lineMeta(line: unknown): string {
  if (!line || typeof line !== "object") return "";
  const row = line as Record<string, unknown>;
  const q = row.quantity ?? row.qty;
  const parts: string[] = [];
  if (q != null) parts.push(`الكمية: ${String(q)}`);
  const t = row.total ?? row.subtotal ?? row.price;
  if (t != null) parts.push(money(t));
  return parts.join(" · ");
}

async function cancelOrderAction(formData: FormData) {
  "use server";
  const id = String(formData.get("order_id") ?? "");
  try {
    await cancelOrder(id);
    revalidatePath(`${ROUTES.orders}/${id}`);
    revalidatePath(ROUTES.orders);
    redirect(`${ROUTES.orders}/${id}?ok=cancelled`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر إلغاء الطلب";
    redirect(`${ROUTES.orders}/${id}?error=${encodeURIComponent(msg)}`);
  }
}

async function reorderAction(formData: FormData) {
  "use server";
  const id = String(formData.get("order_id") ?? "");
  try {
    await reorder(id);
    revalidatePath(`${ROUTES.orders}/${id}`);
    revalidatePath(ROUTES.orders);
    redirect(`${ROUTES.orders}/${id}?ok=reordered`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر إعادة الطلب";
    redirect(`${ROUTES.orders}/${id}?error=${encodeURIComponent(msg)}`);
  }
}

async function payOrderAction(formData: FormData) {
  "use server";
  const id = String(formData.get("order_id") ?? "");
  const method = String(formData.get("payment_method") ?? "").trim();
  try {
    if (!method) {
      redirect(`${ROUTES.orders}/${id}?error=${encodeURIComponent("اختر طريقة الدفع")}`);
    }
    await payOrder(id, method);
    revalidatePath(`${ROUTES.orders}/${id}`);
    revalidatePath(ROUTES.orders);
    redirect(`${ROUTES.orders}/${id}?ok=paid`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر تنفيذ الدفع";
    redirect(`${ROUTES.orders}/${id}?error=${encodeURIComponent(msg)}`);
  }
}

async function calculateShippingAction(formData: FormData) {
  "use server";
  const id = String(formData.get("order_id") ?? "");
  const raw = String(formData.get("address_id") ?? "").trim();
  const addressId = parseInt(raw, 10);
  if (!raw || Number.isNaN(addressId)) {
    redirect(
      `${ROUTES.orders}/${id}?error=${encodeURIComponent("اختر عنواناً لحساب الشحن")}`
    );
  }
  try {
    await calculateShipping(addressId);
    revalidatePath(`${ROUTES.orders}/${id}`);
    revalidatePath(ROUTES.orders);
    redirect(`${ROUTES.orders}/${id}?ok=shipping_calculated`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر حساب الشحن";
    redirect(`${ROUTES.orders}/${id}?error=${encodeURIComponent(msg)}`);
  }
}

async function refundAction(formData: FormData) {
  "use server";
  const id = String(formData.get("order_id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  try {
    await requestRefund(id, { reason: reason || undefined, details: details || undefined });
    revalidatePath(`${ROUTES.orders}/${id}`);
    redirect(`${ROUTES.orders}/${id}?ok=refund_requested`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر إرسال طلب الاسترجاع";
    redirect(`${ROUTES.orders}/${id}?error=${encodeURIComponent(msg)}`);
  }
}

export default async function OrderDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  await searchParams;

  let order: Order | null = null;
  let authRequired = false;
  let loadError: string | null = null;

  try {
    const res = await getOrderById(id);
    order = extractOrder(res.data);
  } catch (e) {
    authRequired = true;
    loadError = e instanceof Error ? e.message : "تعذر تحميل تفاصيل الطلب";
  }

  let addresses: Address[] = [];
  if (order) {
    try {
      const addrRes = await getAddresses();
      addresses = extractList<Address>(addrRes.data);
    } catch {
      addresses = [];
    }
  }

  if (authRequired || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">تفاصيل الطلب</h1>
        <p className="mt-4 text-muted-foreground">
          {loadError ? getUserFacingErrorDescription(loadError) : "سجّل الدخول لعرض تفاصيل الطلب."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline">
            <Link href={ROUTES.orders}>رجوع للطلبات</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.login}>تسجيل الدخول</Link>
          </Button>
        </div>
      </div>
    );
  }

  const lines = orderLineItems(order);
  const user = order.user as ApiUser | undefined;
  const defaultAddressId =
    order.address_id != null ? String(order.address_id) : addresses[0]?.id != null ? String(addresses[0].id) : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">طلب #{id}</h1>
          <p className="mt-2 text-sm text-muted-foreground">عرض تفاصيل الطلب والإجراءات المتاحة.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.orders}>كل الطلبات</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={ROUTES.checkout}>إنشاء طلب جديد</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>ملخص الطلب</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={order.status} label="الحالة" />
                  <StatusBadge status={order.payment_status} label="الدفع" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 pt-4">
              <Field label="المجموع الفرعي" value={money(order.sub_total)} />
              <Field label="خصم الطلب" value={money(order.order_discount)} />
              <Field label="خصم الكوبون" value={money(order.coupon_discount)} />
              <Field label="الشحن" value={money(order.total_shipping)} />
              <Field label="خصم النقاط" value={money(order.points_discount)} />
              <Field label="المحفظة" value={money(order.wallet_used)} />
              <Separator className="my-1" />
              <Field label="الإجمالي" value={<span className="text-lg font-bold text-primary">{money(order.total)}</span>} />
              {order.created_at ? <Field label="تاريخ الإنشاء" value={order.created_at} /> : null}
              {order.address_id != null ? (
                <Field label="معرّف العنوان" value={String(order.address_id)} />
              ) : null}
              {order.notes != null && String(order.notes).trim() ? (
                <div className="pt-2 text-sm">
                  <span className="text-muted-foreground">ملاحظات</span>
                  <p className="mt-1 rounded-lg border bg-muted/30 p-2">{String(order.notes)}</p>
                </div>
              ) : null}
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href={ROUTES.shop}>متابعة التسوق</Link>
              </Button>
            </CardFooter>
          </Card>

          {user ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>العميل</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 pt-4 text-sm">
                <Field label="الاسم" value={user.name ?? "—"} />
                <Field label="البريد" value={user.email ?? "—"} />
                <Field label="الجوال" value={user.phone ?? "—"} />
              </CardContent>
            </Card>
          ) : null}

          {lines.length > 0 ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>الأصناف</CardTitle>
              </CardHeader>
              <CardContent className="divide-y pt-2">
                {lines.map((line, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 py-3 text-sm">
                    <span className="font-semibold">{lineLabel(line)}</span>
                    {lineMeta(line) ? (
                      <span className="text-xs text-muted-foreground">{lineMeta(line)}</span>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card size="sm" className="lg:sticky lg:top-28">
          <CardHeader className="border-b">
            <CardTitle className="text-base">إجراءات الطلب</CardTitle>
            <p className="text-xs text-muted-foreground">
              لإنشاء طلب جديد انتقل إلى{" "}
              <Link href={ROUTES.checkout} className="font-medium text-primary hover:underline">
                إتمام الطلب
              </Link>
              .
            </p>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <form action={payOrderAction} className="space-y-2">
              <input type="hidden" name="order_id" value={id} />
              <p className="text-xs text-muted-foreground">أدخل طريقة الدفع ثم أكمل الدفع.</p>
              <input
                name="payment_method"
                placeholder="مثال: cash، visa، mada"
                className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                dir="ltr"
              />
              <Button type="submit" className="w-full">
                دفع الطلب
              </Button>
            </form>

            <Separator />

            <form action={calculateShippingAction} className="space-y-2">
              <input type="hidden" name="order_id" value={id} />
              <p className="text-xs text-muted-foreground">اختر عنوان التوصيل لحساب تكلفة الشحن.</p>
              {addresses.length > 0 ? (
                <select
                  name="address_id"
                  required
                  defaultValue={defaultAddressId}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={String(a.id)}>
                      {a.name} — {a.address}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  لا توجد عناوين محفوظة. أضف عنواناً من{" "}
                  <Link href={ROUTES.checkout} className="underline">
                    إتمام الطلب
                  </Link>
                  .
                </p>
              )}
              <Button type="submit" variant="secondary" className="w-full" disabled={addresses.length === 0}>
                حساب الشحن
              </Button>
            </form>

            <Separator />

            <div className="grid grid-cols-1 gap-2">
              <form action={reorderAction}>
                <input type="hidden" name="order_id" value={id} />
                <Button type="submit" variant="outline" className="w-full">
                  إعادة الطلب
                </Button>
              </form>
              <form action={cancelOrderAction}>
                <input type="hidden" name="order_id" value={id} />
                <Button type="submit" variant="destructive" className="w-full">
                  إلغاء الطلب
                </Button>
              </form>
            </div>

            <Separator />

            <form action={refundAction} className="space-y-2">
              <input type="hidden" name="order_id" value={id} />
              <p className="text-xs text-muted-foreground">يمكنك إرفاق سبب وتفاصيل طلب الاسترجاع (اختياري).</p>
              <input
                name="reason"
                placeholder="السبب (اختياري)"
                className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              />
              <textarea
                name="details"
                rows={3}
                placeholder="تفاصيل (اختياري)"
                className="w-full resize-none rounded-xl border border-input bg-background/80 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              />
              <Button type="submit" variant="outline" className="w-full">
                طلب استرجاع
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
