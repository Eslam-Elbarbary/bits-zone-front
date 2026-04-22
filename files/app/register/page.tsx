import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { ROUTES } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "إنشاء حساب",
    description: "سجّل في Pets Zone للتسوق ومتابعة الطلبات.",
  };
}

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 md:py-20">
      <div className="text-balance">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">إنشاء حساب</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          قد نرسل لك رمز تفعيل إلى بريدك؛ بعدها يمكنك تسجيل الدخول أو إدخال الرمز من صفحة تفعيل الحساب.
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        لديك حساب؟{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
