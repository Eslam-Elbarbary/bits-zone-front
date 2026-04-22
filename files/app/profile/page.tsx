import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, MapPin, Sparkles } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { updatePasswordAction, updateProfileAction } from "@/app/actions/profile";
import { ProfileAddressBook } from "@/components/profile/profile-address-book";
import { ProfilePointsSnapshot } from "@/components/profile/profile-points-snapshot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { extractList } from "@/lib/api-data";
import { getAddresses, getCurrentUser, getPointsHistory } from "@/lib/api";
import { extractPointsHistoryPayload, rowsFromPointsEntries } from "@/lib/points-history";
import { resolveImageSrc } from "@/lib/product-utils";
import type { Address, ApiUser } from "@/types/api";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "الملف الشخصي",
    description: "الحساب، العناوين، النقاط، والأمان.",
  };
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  const out = (first + second).toUpperCase();
  return out || "U";
}

function userFromEnvelope(data: unknown): ApiUser | null {
  if (!data || typeof data !== "object") return null;
  const u = (data as { user?: unknown }).user;
  if (u && typeof u === "object" && u !== null && "id" in (u as Record<string, unknown>)) {
    return u as ApiUser;
  }
  return null;
}

const navItems = [
  { href: "#profile-account", label: "الحساب", Icon: User },
  { href: "#profile-addresses", label: "العناوين", Icon: MapPin },
  { href: "#profile-points", label: "النقاط", Icon: Sparkles },
] as const;

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;

  let user: ApiUser | null = null;
  try {
    const res = await getCurrentUser();
    user = userFromEnvelope(res.data);
  } catch {
    redirect(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.profile)}`);
  }

  if (!user) {
    redirect(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.profile)}`);
  }

  let addresses: Address[] = [];
  try {
    const addrRes = await getAddresses();
    addresses = extractList<Address>(addrRes.data);
  } catch {
    addresses = [];
  }

  let pointsBalance: number | null = null;
  let pointsRows: ReturnType<typeof rowsFromPointsEntries> = [];
  let pointsError: string | null = null;
  try {
    const pts = await getPointsHistory();
    const { balance, entries } = extractPointsHistoryPayload(pts.data);
    pointsBalance = balance;
    pointsRows = rowsFromPointsEntries(entries).slice(0, 6);
  } catch (e) {
    pointsError = e instanceof Error ? e.message : "تعذر تحميل سجل النقاط";
  }

  const name = String(user.name ?? "").trim();
  const email = user.email ? String(user.email) : "";
  const phone = user.phone ? String(user.phone) : "";
  const image = user.image ? resolveImageSrc(String(user.image)) : null;

  return (
    <div className="relative min-h-[70vh]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 h-56 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.72_0.175_62/0.1),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary/80">حسابي</p>
            <h1 className="text-2xl font-bold tracking-tight text-sky-950 md:text-3xl">الملف الشخصي</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              إدارة بياناتك، عناوين التوصيل، ونقاط الولاء في مكان واحد.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.orders}>طلباتي</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.tickets}>تذاكر الدعم</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.wallet}>المحفظة</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.checkout}>إتمام الطلب</Link>
            </Button>
          </div>
        </div>

        <nav
          className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="أقسام الملف"
        >
          {navItems.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border border-sky-100/90 bg-white/90 px-4 py-2 text-sm font-semibold text-sky-800 shadow-sm",
                "transition-colors hover:border-primary/25 hover:bg-primary/[0.05] hover:text-primary"
              )}
            >
              <Icon className="size-4 text-primary/90" aria-hidden />
              {label}
            </a>
          ))}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(100%,340px)] lg:items-start">
          <div className="min-w-0 space-y-10">
            <section id="profile-account" className="scroll-mt-28">
              <Card className="overflow-hidden border-sky-200/50 shadow-md ring-1 ring-sky-100/50">
                <CardHeader className="border-b border-sky-100/80 bg-gradient-to-l from-sky-50/50 to-transparent">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg" className="ring-2 ring-white shadow-md">
                        {image ? <AvatarImage src={image} alt={name} /> : null}
                        <AvatarFallback className="text-lg font-bold">{initials(name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-xl">{name || "—"}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {email || phone ? [email, phone].filter(Boolean).join(" • ") : "لا توجد بيانات تواصل"}
                        </p>
                      </div>
                    </div>
                    <form action={logoutAction}>
                      <Button type="submit" variant="destructive" size="sm">
                        تسجيل الخروج
                      </Button>
                    </form>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-sky-950">البيانات الأساسية</h2>
                    <form action={updateProfileAction} className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">الاسم</Label>
                          <Input id="name" name="name" defaultValue={name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">رقم الجوال</Label>
                          <Input id="phone" name="phone" defaultValue={phone} dir="ltr" className="text-start" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input id="email" name="email" defaultValue={email} dir="ltr" className="text-start" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image">صورة الملف (اختياري)</Label>
                        <Input id="image" name="image" type="file" accept="image/*" />
                        <p className="text-xs text-muted-foreground">صورة بحجم معقول بصيغة JPG أو PNG أو WebP.</p>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">حفظ التغييرات</Button>
                      </div>
                    </form>
                  </div>

                  <Separator className="bg-sky-100/80" />

                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-sky-950">كلمة المرور</h2>
                    <form action={updatePasswordAction} className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">كلمة المرور الحالية</Label>
                        <Input
                          id="current_password"
                          name="current_password"
                          type="password"
                          autoComplete="current-password"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="password">كلمة المرور الجديدة</Label>
                          <Input id="password" name="password" type="password" autoComplete="new-password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
                          <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" variant="outline">
                          تحديث كلمة المرور
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="profile-addresses" className="scroll-mt-28">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/90">العناوين</p>
                  <h2 className="text-xl font-bold text-sky-950">دفتر العناوين</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    أضف عدة عناوين، عيّن الافتراضي، واحذف ما لم يعد مستخدماً.
                  </p>
                </div>
              </div>
              <ProfileAddressBook addresses={addresses} />
            </section>

            <section id="profile-points" className="scroll-mt-28">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary/90">نقاط الولاء</p>
                <h2 className="text-xl font-bold text-sky-950">نقاطك وسجل الحركة</h2>
                <p className="mt-1 text-sm text-muted-foreground">ملخص من سجل النقاط مع رابط للصفحة الكاملة.</p>
              </div>
              <ProfilePointsSnapshot
                balance={pointsBalance}
                rows={pointsRows}
                error={pointsError ? getUserFacingErrorDescription(pointsError) : null}
              />
            </section>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-24">
            <Card className="border-sky-200/50 bg-gradient-to-b from-white to-sky-50/30 shadow-md ring-1 ring-sky-100/50">
              <CardHeader className="border-b border-sky-100/60 pb-3">
                <CardTitle className="text-sm font-bold text-sky-900">اختصارات</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1 pt-4 text-sm">
                {navItems.map(({ href, label, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 font-medium text-sky-800 hover:bg-white/80 hover:text-primary"
                  >
                    <Icon className="size-4 shrink-0 text-primary/80" aria-hidden />
                    {label}
                  </a>
                ))}
                <Separator className="my-2 bg-sky-100/80" />
                <Link
                  href={ROUTES.points}
                  className="rounded-lg px-2 py-2 font-medium text-primary hover:bg-primary/5"
                >
                  صفحة سجل النقاط كاملة
                </Link>
                <Link
                  href={ROUTES.wallet}
                  className="rounded-lg px-2 py-2 font-medium text-emerald-800 hover:bg-emerald-50/60"
                >
                  سجل المحفظة
                </Link>
                <Link href={ROUTES.orders} className="rounded-lg px-2 py-2 font-medium text-sky-800 hover:bg-white/80">
                  طلباتي
                </Link>
              </CardContent>
              <CardFooter className="border-t border-sky-100/60 text-xs text-muted-foreground">
                تسوق بأمان — راجع سياسة الخصوصية عند الحاجة.
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
