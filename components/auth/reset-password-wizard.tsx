"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  resetPasswordSendCodeAction,
  resetPasswordSetNewAction,
  resetPasswordVerifyCodeAction,
} from "@/app/actions/reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { notify } from "@/lib/notify";

export function ResetPasswordWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!error) return;
    notify.error(getUserFacingErrorDescription(error));
  }, [error]);

  async function onSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    const fd = new FormData();
    if (email.trim()) fd.set("email", email.trim());
    if (phone.trim()) fd.set("phone", phone.trim());
    const r = await resetPasswordSendCodeAction(fd);
    setPending(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setStep(2);
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget as HTMLFormElement;
    const code = String(new FormData(form).get("code") ?? "").trim();
    setPending(true);
    const fd = new FormData();
    fd.set("code", code);
    if (email.trim()) fd.set("email", email.trim());
    if (phone.trim()) fd.set("phone", phone.trim());
    const r = await resetPasswordVerifyCodeAction(fd);
    setPending(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setResetToken(r.reset_token);
    setStep(3);
  }

  async function onSetNew(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    fd.set("reset_token", resetToken);
    setPending(true);
    const r = await resetPasswordSetNewAction(fd);
    setPending(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    router.push(`${ROUTES.login}?ok=reset`);
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200/60 bg-white/80 p-8 shadow-modern backdrop-blur-md dark:border-zinc-700/50 dark:bg-card/80">
      <ol className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
        <li className={step >= 1 ? "text-primary" : ""}>١ إرسال الرمز</li>
        <span aria-hidden>→</span>
        <li className={step >= 2 ? "text-primary" : ""}>٢ التحقق</li>
        <span aria-hidden>→</span>
        <li className={step >= 3 ? "text-primary" : ""}>٣ كلمة مرور جديدة</li>
      </ol>

      {step === 1 ? (
        <form onSubmit={onSendCode} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">أدخل البريد أو رقم الجوال لتلقي رمز التحقق.</p>
          <div className="space-y-2">
            <Label htmlFor="rp-email">البريد الإلكتروني</Label>
            <Input
              id="rp-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="text-start"
              placeholder="اختياري إن وُجد الجوال"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rp-phone">رقم الجوال</Label>
            <Input
              id="rp-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="text-start"
              placeholder="اختياري إن وُجد البريد"
            />
          </div>
          <Button type="submit" className="w-full bg-primary" disabled={pending}>
            {pending ? "جاري الإرسال…" : "إرسال رمز التحقق"}
          </Button>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={onVerify} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">أدخل الرمز الذي وصلك.</p>
          <div className="space-y-2">
            <Label htmlFor="rp-code">رمز التحقق</Label>
            <Input id="rp-code" name="code" required autoComplete="one-time-code" dir="ltr" className="text-start" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={pending}>
              رجوع
            </Button>
            <Button type="submit" className="flex-1 bg-primary" disabled={pending}>
              {pending ? "جاري التحقق…" : "تحقق من الرمز"}
            </Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <form onSubmit={onSetNew} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">اختر كلمة مرور جديدة وتأكيدها.</p>
          <div className="space-y-2">
            <Label htmlFor="rp-password">كلمة المرور الجديدة</Label>
            <Input id="rp-password" name="password" type="password" autoComplete="new-password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rp-password2">تأكيد كلمة المرور</Label>
            <Input
              id="rp-password2"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={pending}>
              رجوع
            </Button>
            <Button type="submit" className="flex-1 bg-primary" disabled={pending}>
              {pending ? "جاري الحفظ…" : "حفظ كلمة المرور"}
            </Button>
          </div>
        </form>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
