"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { registerAction, type ActionState } from "@/app/actions/auth";
import { ROUTES } from "@/constants";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = undefined;

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initial);

  useEffect(() => {
    if (!state?.error) return;
    notify.error(getUserFacingErrorDescription(state.error));
  }, [state?.error]);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-foreground">تم إنشاء حسابك</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          إن وصلك بريد برمز التفعيل، يمكنك إدخاله من صفحة التفعيل ثم تسجيل الدخول.
        </p>
        {state.email ? (
          <Button className="mt-6 w-full" asChild>
            <Link href={`${ROUTES.verifyEmail}?email=${encodeURIComponent(state.email)}`}>
              إدخال رمز التفعيل
            </Link>
          </Button>
        ) : (
          <Button className="mt-6 w-full" asChild variant="outline">
            <Link href={ROUTES.verifyEmail}>فتح صفحة تفعيل الحساب</Link>
          </Button>
        )}
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
            الانتقال لتسجيل الدخول
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200/60 bg-white/80 p-8 shadow-modern backdrop-blur-md dark:border-zinc-700/50 dark:bg-card/80"
    >
      <div className="space-y-2">
        <Label htmlFor="name">الاسم الكامل</Label>
        <Input id="name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني (اختياري إن وفرّت جوال)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          className="text-start"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">الجوال (اختياري)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          dir="ltr"
          className="text-start"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>
      <Button type="submit" className="w-full bg-primary" disabled={pending}>
        {pending ? "جاري التسجيل..." : "تسجيل"}
      </Button>
    </form>
  );
}
