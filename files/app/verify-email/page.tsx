import type { Metadata } from "next";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تفعيل الحساب",
    description: "أدخل رمز التفعيل المرسل إلى بريدك الإلكتروني.",
  };
}

function qp(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v[0]) return v[0];
  return "";
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const email = qp(sp, "email");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 md:py-20">
      <div className="text-balance text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">تفعيل الحساب</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          أدخل البريد الذي سجّلت به ثم رمز التفعيل الوارد في رسالتنا. بعد التفعيل يمكنك تسجيل الدخول.
        </p>
      </div>
      <VerifyEmailForm defaultEmail={email} />
    </div>
  );
}
