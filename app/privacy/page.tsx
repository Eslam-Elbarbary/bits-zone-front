import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سياسة الخصوصية",
    description: "معلومات عامة حول الخصوصية في Pets Zone — يُستبدل بالنص القانوني عند الجاهزية.",
  };
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
        سياسة الخصوصية
      </h1>
      <p className="mt-4 text-sm text-amber-800/90 dark:text-amber-200/90">
        هذا نص تعريفي مؤقت. استبدله بالسياسة المعتمدة قانونياً عند ربط المحتوى الرسمي.
      </p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        <p>
          نلتزم بحماية بياناتك وفق الأنظمة المعمول بها. عند استخدام الموقع قد تُجمع بيانات تقنية أساسية (مثل عنوان IP
          ونوع المتصفح) لتحسين الأداء والأمان.
        </p>
        <p>
          إذا أنشأت حساباً، تُعالج بيانات التسجيل وفق إعدادات الـ API والخادم الخلفي. لا تشارك كلمة المرور مع أحد.
        </p>
        <p>
          لطلبات حذف البيانات أو الاستفسارات القانونية، راجع فريقك القانوني ثم حدّث هذه الصفحة بنص نهائي.
        </p>
      </div>
      <p className="mt-10 text-sm">
        <Link href={ROUTES.contact} className="font-medium text-primary hover:underline">
          تواصل معنا
        </Link>
      </p>
    </div>
  );
}
