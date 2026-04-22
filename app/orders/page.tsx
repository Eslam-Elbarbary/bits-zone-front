import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getOrders } from "@/lib/api";
import { extractList } from "@/lib/api-data";
import type { Order } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "طلباتي",
    description: "تابع حالة طلباتك وراجع تفاصيلها.",
  };
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? "").toLowerCase();
  const variant =
    s.includes("cancel") || s.includes("refus") || s.includes("fail")
      ? "destructive"
      : s.includes("paid") || s.includes("complete") || s.includes("deliver")
        ? "default"
        : "secondary";
  return <Badge variant={variant}>{status ?? "—"}</Badge>;
}

export default async function OrdersPage() {
  let orders: Order[] = [];
  let authRequired = false;
  let error: string | null = null;

  try {
    const res = await getOrders();
    orders = extractList<Order>(res.data);
  } catch (e) {
    // Same pattern as cart page: treat as unauth or API error.
    authRequired = true;
    error = e instanceof Error ? e.message : null;
  }

  if (authRequired) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">طلباتي</h1>
        <p className="mt-4 text-muted-foreground">
          سجّل الدخول لعرض طلباتك ومتابعة حالتها{error ? ` (تفاصيل: ${error})` : ""}.
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.login}>تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">طلباتي</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {orders.length > 0 ? "اضغط على أي طلب لعرض التفاصيل والإجراءات." : "لا توجد طلبات بعد."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href={ROUTES.shop}>تصفح المنتجات</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.checkout}>إنشاء طلب</Link>
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>لا توجد طلبات</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            عندما تُكمل أول عملية شراء ستظهر طلباتك هنا.
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild>
              <Link href={ROUTES.shop}>ابدأ التسوق</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => {
            const id = (o as { id?: number | string }).id ?? "";
            const total = (o as { total?: number | string }).total;
            const createdAt = (o as { created_at?: string }).created_at;
            const status = (o as { status?: string }).status;

            return (
              <Card key={String(id)}>
                <CardHeader className="border-b">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <CardTitle className="flex items-center gap-2">
                      <span>طلب #{String(id)}</span>
                    </CardTitle>
                    <StatusBadge status={status} />
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-muted-foreground">الإجمالي</span>
                    <span className="font-semibold tabular-nums">{total ?? "—"}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-muted-foreground">تاريخ الإنشاء</span>
                    <span className="tabular-nums">{createdAt ?? "—"}</span>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button asChild>
                    <Link href={`${ROUTES.orders}/${id}`}>عرض التفاصيل</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

