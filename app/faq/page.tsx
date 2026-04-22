import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "الأسئلة الشائعة",
    description: "إجابات سريعة عن التسوق والتوصيل والحساب في Pets Zone.",
  };
}

const ITEMS = [
  {
    q: "كيف أتسوّق بدون تسجيل؟",
    a: "يمكنك تصفح المنتجات وإضافتها للسلة؛ قد يطلب منك الـ API تسجيل الدخول عند إتمام الطلب أو لبعض العروض.",
  },
  {
    q: "كيف أتتبع طلبي؟",
    a: "عند تفعيل قسم الطلبات في الـ API وربطه بالواجهة، ستجد حالة الطلب داخل حسابك. حتى ذلك الحين راجع تأكيد البريد أو تواصل معنا.",
  },
  {
    q: "هل المنتجات أصلية؟",
    a: "نعرض منتجات من بائعين معتمدين في المنصة. ابحث عن شارة «متجر معتمد» على بطاقة المنتج عند توفرها من الـ API.",
  },
  {
    q: "ماذا عن الإرجاع؟",
    a: "تفاصيل الإرجاع تعتمد على سياسة المتجر والـ API. راجع صفحة سياسة الخصوصية والشروط عند ربطها بالمحتوى الرسمي.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
        الأسئلة الشائعة
      </h1>
      <p className="mt-4 text-sm text-muted-foreground md:text-base">
        إجابات عامة؛ ربطها بالسياسات الفعلية يتم عند جاهزية الـ API والمحتوى القانوني.
      </p>
      <dl className="mt-10 space-y-8">
        {ITEMS.map(({ q, a }) => (
          <div key={q} className="border-b border-zinc-200/80 pb-8 last:border-0 dark:border-zinc-700/50">
            <dt className="text-base font-semibold text-zinc-900">{q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 text-sm">
        لم تجد إجابتك؟{" "}
        <Link href={ROUTES.contact} className="font-medium text-primary hover:underline">
          تواصل معنا
        </Link>
      </p>
    </div>
  );
}
