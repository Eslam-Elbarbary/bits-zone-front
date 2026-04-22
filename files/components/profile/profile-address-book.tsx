import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { addAddressProfileAction } from "@/app/actions/profile-addresses";
import { CheckoutAddressGeoFields } from "@/components/checkout/checkout-address-geo-fields";
import { ProfileDeleteAddressForm } from "@/components/profile/profile-delete-address-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import type { Address } from "@/types/api";

export function ProfileAddressBook({ addresses }: { addresses: Address[] }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.length === 0 ? (
          <Card className="border-dashed border-sky-200/80 bg-sky-50/20 sm:col-span-2">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MapPin className="size-7" aria-hidden />
              </div>
              <p className="text-sm font-semibold text-sky-950">لا توجد عناوين محفوظة بعد</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                أضف عنوان توصيل لاستخدامه في إتمام الطلب وحساب الشحن.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTES.checkout}>إتمام طلب</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          addresses.map((a) => {
            const id = String(a.id);
            const title = String(a.name ?? "عنوان").trim() || "عنوان";
            const line = [a.address, a.city, a.state].filter(Boolean).join(" · ");
            return (
              <Card
                key={id}
                className="relative overflow-hidden border-sky-100/90 shadow-sm ring-1 ring-sky-50 transition-shadow hover:shadow-md"
              >
                <span
                  className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-primary to-papaya/80"
                  aria-hidden
                />
                <CardHeader className="pb-2 ps-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">{title}</CardTitle>
                      {a.is_default ? (
                        <Badge className="rounded-md border-0 bg-primary/15 text-primary hover:bg-primary/15">
                          افتراضي
                        </Badge>
                      ) : null}
                    </div>
                    <ProfileDeleteAddressForm addressId={id} label={title} />
                  </div>
                  <CardDescription className="text-start leading-relaxed">{line || "—"}</CardDescription>
                  {a.phone ? (
                    <p className="text-xs font-medium tabular-nums text-muted-foreground" dir="ltr">
                      {String(a.phone)}
                    </p>
                  ) : null}
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>

      <Separator className="bg-sky-100/80" />

      <Card className="border-sky-200/60 shadow-sm ring-1 ring-sky-100/40">
        <CardHeader className="border-b border-sky-100/80 bg-gradient-to-l from-sky-50/40 to-transparent">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="size-4" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-lg">إضافة عنوان جديد</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                يُفضَّل إدخال الإحداثيات لدقة الشحن؛ يمكن تركها لتعبئة تلقائية تقريبية.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={addAddressProfileAction} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-addr-name">اسم العنوان</Label>
                <Input id="profile-addr-name" name="name" required placeholder="مثال: المنزل، العمل" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-addr-phone">الجوال</Label>
                <Input id="profile-addr-phone" name="phone" type="tel" dir="ltr" placeholder="05xxxxxxxx" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-addr-line">العنوان بالتفصيل</Label>
              <Input id="profile-addr-line" name="address" required placeholder="الحي، الشارع، المبنى…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-addr-city">المدينة</Label>
                <Input id="profile-addr-city" name="city" placeholder="اختياري" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-addr-state">المنطقة / المحافظة</Label>
                <Input id="profile-addr-state" name="state" placeholder="اختياري" />
              </div>
            </div>
            <CheckoutAddressGeoFields idPrefix="profile-new" />
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-sky-100/80 bg-sky-50/30 px-4 py-3 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/[0.04]">
              <input type="checkbox" name="is_default" className="size-4 rounded border-sky-200 accent-primary" />
              <span className="text-sm font-medium text-sky-950">تعيين كعنوان افتراضي للتوصيل</span>
            </label>
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <Button type="submit" className="min-w-[8rem]">
                حفظ العنوان
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
