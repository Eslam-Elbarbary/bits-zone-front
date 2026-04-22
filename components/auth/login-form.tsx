"use client";

import { useActionState, useEffect } from "react";
import { loginAction, type ActionState } from "@/app/actions/auth";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = undefined;

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  useEffect(() => {
    if (!state?.error) return;
    notify.error(getUserFacingErrorDescription(state.error));
  }, [state?.error]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200/60 bg-white/80 p-8 shadow-modern backdrop-blur-md dark:border-zinc-700/50 dark:bg-card/80"
    >
      {redirectTo ? <input type="hidden" name="next" value={redirectTo} /> : null}
      <div className="space-y-2">
        <Label htmlFor="login">البريد أو الجوال</Label>
        <Input
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          required
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
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-primary" disabled={pending}>
        {pending ? "جاري الدخول..." : "دخول"}
      </Button>
    </form>
  );
}
