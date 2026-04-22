import type { Metadata } from "next";
import { ResetPasswordWizard } from "@/components/auth/reset-password-wizard";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "استعادة كلمة المرور",
    description: "إعادة تعيين كلمة المرور عبر رمز التحقق كما في الـ API.",
  };
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 md:py-20">
      <div className="text-balance">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">استعادة كلمة المرور</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          ثلاث خطوات: إرسال الرمز، التحقق منه، ثم تعيين كلمة مرور جديدة — بنفس مسارات الـ API لديك.
        </p>
      </div>
      <ResetPasswordWizard />
    </div>
  );
}
