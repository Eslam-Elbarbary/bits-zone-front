"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import {
  resendVerificationCodeAction,
  verifyEmailAction,
  type ActionState,
} from "@/app/actions/auth";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants";

const initial: ActionState = undefined;

export function VerifyEmailForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyEmailAction, initial);
  const [resendState, resendAction, resendPending] = useActionState(resendVerificationCodeAction, initial);

  useEffect(() => {
    if (!verifyState?.error) return;
    notify.error(getUserFacingErrorDescription(verifyState.error));
  }, [verifyState?.error]);

  useEffect(() => {
    if (!resendState?.error) return;
    notify.error(getUserFacingErrorDescription(resendState.error));
  }, [resendState?.error]);

  useEffect(() => {
    if (resendState?.ok) {
      notify.success("إن وُجد حساب بهذا البريد، سيصلك رمز جديد قريباً.");
    }
  }, [resendState?.ok]);

  return (
    <div className="flex flex-col gap-6">
      <form
        action={verifyAction}
        className="flex flex-col gap-5 rounded-2xl border border-zinc-200/60 bg-white/80 p-8 shadow-modern backdrop-blur-md dark:border-zinc-700/50 dark:bg-card/80"
      >
        <div className="space-y-2">
          <Label htmlFor="verify-email">البريد الإلكتروني</Label>
          <Input
            id="verify-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaultEmail}
            dir="ltr"
            className="text-start"
            aria-label="البريد المستخدم عند التسجيل"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="verify-code">رمز التفعيل</Label>
          <Input
            id="verify-code"
            name="code"
            type="text"
            autoComplete="one-time-code"
            inputMode="numeric"
            dir="ltr"
            className="text-start tracking-widest"
            placeholder="أدخل الرمز المرسل إلى بريدك"
            aria-label="رمز التفعيل من البريد"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-row-reverse sm:justify-start sm:gap-3">
          <Button type="submit" className="w-full bg-primary sm:w-auto sm:min-w-[10rem]" disabled={verifyPending}>
            {verifyPending ? "جاري التفعيل…" : "تفعيل الحساب"}
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[10rem]"
            formAction={resendAction}
            disabled={resendPending}
          >
            {resendPending ? "جاري الإرسال…" : "إعادة إرسال الرمز"}
          </Button>
        </div>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          يمكنك إعادة إرسال الرمز باستخدام بريدك فقط دون تعبئة حقل الرمز.
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
