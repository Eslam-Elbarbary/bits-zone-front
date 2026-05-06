import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES, SITE_BRAND } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "الأسئلة الشائعة",
    description: `إجابات عن التسوق، التوصيل، جودة المنتجات والإرجاع في ${SITE_BRAND}.`,
  };
}

const ITEMS = [
  {
    q: "كيف أتسوّق بدون تسجيل؟",
    a: "تقدر تتصفّح كل المنتجات وتضيفها للسلة في أي وقت. لإتمام الطلب غالباً هنحتاج بيانات التوصيل وتأكيد وسيلة الدفع، وده يتم بسهولة بعد إنشاء حساب أو تسجيل الدخول عند الدفع.",
  },
  {
    q: "كيف أتتبع طلبي؟",
    a: "بعد تأكيد الطلب، هتوصلك رسالة على البريد أو الجوال حسب البيانات اللي سجّلتها. تقدر كمان تتابع حالة الطلب من قسم «طلباتي» داخل حسابك. لو محتاج مساعدة إضافية، فريق الدعم جاهز يرد عليك.",
  },
  {
    q: "هل المنتجات أصلية ومناسبة لحيواني؟",
    a: "نحرص على عرض مستلزمات من علامات موثوقة ومصادر معتمدة — أكل، رمل، ألعاب وعناية. لو المنتج له تفاصيل غذائية أو تحذيرات استخدام، تلاقيها في صفحة المنتج. في حالة الاستفسار عن نوع معيّن، تواصل معنا قبل الشراء.",
  },
  {
    q: "ماذا عن الإرجاع أو الاستبدال؟",
    a: "سياسة الإرجاع والاستبدال تختلف حسب نوع المنتج وحالته (مثلاً المنتجات المفتوحة أو ذات الصلاحية). ننصح بمراجعة صفحة الشروط وسياسة الخصوصية للتفاصيل الكاملة. لأي طلب متعلق بطلبك الحالي، راسلنا من صفحة التواصل مع إرفاق رقم الطلب.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
        الأسئلة الشائعة
      </h1>
      <p className="mt-4 text-sm text-muted-foreground md:text-base">
        أهم الإجابات عن التسوق، التوصيل وجودة مستلزمات الحيوانات الأليفة في {SITE_BRAND}. للتفاصيل القانونية
        الكاملة راجع{" "}
        <Link href={ROUTES.privacy} className="font-medium text-primary hover:underline">
          سياسة الخصوصية والشروط
        </Link>
        .
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
