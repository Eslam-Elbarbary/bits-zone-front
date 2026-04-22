import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تسجيل الدخول",
    description: "ادخل إلى حسابك في Pets Zone.",
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.next;
  const next =
    typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") && !raw.includes(":")
      ? raw
      : undefined;
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 md:py-20">
      <div className="text-balance">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">تسجيل الدخول</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          استخدم البريد أو الجوال وكلمة المرور اللذين اخترتهما عند التسجيل.
        </p>
      </div>
      <LoginForm redirectTo={next} />
      <p className="text-center text-sm text-muted-foreground">
        <Link href={ROUTES.verifyEmail} className="font-medium text-primary hover:underline">
          تفعيل الحساب برمز البريد
        </Link>
        <span className="mx-2 text-border">·</span>
        <Link href={ROUTES.resetPassword} className="font-medium text-primary hover:underline">
          نسيت كلمة المرور؟
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{" "}
        <Link href={ROUTES.register} className="font-medium text-primary hover:underline">
          سجّل الآن
        </Link>
      </p>
    </div>
  );
}
