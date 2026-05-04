import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES, SITE_BRAND } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سياسة الخصوصية",
    description: `كيف نجمع ونستخدم ونحمي بياناتك عند استخدام متجر ${SITE_BRAND} الإلكتروني.`,
  };
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
        سياسة الخصوصية
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        نقدّر ثقتك في {SITE_BRAND}. توضح هذه الصفحة كيف نتعامل مع المعلومات التي تقدّمها عند تصفّح موقعنا أو إنشاء
        حساب أو إتمام طلب لمنتجات العناية بالحيوانات الأليفة والتوصيل.
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground md:text-base">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">البيانات التي قد نجمعها</h2>
          <ul className="mt-3 list-disc space-y-2 pe-5">
            <li>
              <strong className="font-medium text-zinc-800">بيانات الحساب:</strong> مثل الاسم، البريد الإلكتروني،
              رقم الجوال، وكلمة المرور (مخزّنة بشكل آمن ولا يُعاد عرضها لك كما أدخلتها).
            </li>
            <li>
              <strong className="font-medium text-zinc-800">بيانات الطلب والتوصيل:</strong> عنوان التسليم،
              تفاصيل الدفع الضرورية لإتمام الشراء، ومحتوى السلة والطلبات السابقة.
            </li>
            <li>
              <strong className="font-medium text-zinc-800">بيانات تقنية:</strong> مثل نوع المتصفح، الجهاز، وعنوان
              IP بشكل مجمّع لتحسين أداء الموقع، الأمان، ومنع الاحتيال.
            </li>
            <li>
              <strong className="font-medium text-zinc-800">التواصل معنا:</strong> أي معلومات ترسلها عبر نموذج
              التواصل أو البريد أو الدعم لمعالجة استفسارك أو طلبك.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">كيف نستخدم هذه البيانات</h2>
          <p className="mt-3">
            لتنفيذ طلباتك وتوصيل مستلزمات الحيوانات الأليفة، وإدارة حسابك، والرد على استفساراتك، وتحسين تجربة
            التسوق، وإرسال التحديثات المهمة المتعلقة بطلبك أو بحسابك عند الحاجة. قد نستخدم بيانات مجمّعة غير شخصية
            لفهم استخدام الموقع دون الكشف عن هويتك.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">مشاركة المعلومات</h2>
          <p className="mt-3">
            لا نبيع بياناتك الشخصية. قد نشارك ما يلزم فقط مع مزوّدي خدمات يعملون لصالحنا — مثل شركات الشحن لتسليم
            الطلب، أو بوابات الدفع لمعالجة الدفع — وفق ما تتطلّبه الخدمة وبحد أدنى من البيانات. نتطلّب من هؤلاء
            المعالجين احترام سرية المعلومات.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">الأمان وحسابك</h2>
          <p className="mt-3">
            نطبّق إجراءات مناسبة لحماية البيانات من الوصول أو التعديل غير المصرّح به. يرجى الحفاظ على سرية كلمة
            المرور وعدم مشاركتها مع أي طرف. أي نشاط يتم عبر حسابك يُعتبر تحت مسؤوليتك حتى تبلّغنا عن اختراق محتمل.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">ملفات تعريف الارتباط والتخزين المحلي</h2>
          <p className="mt-3">
            قد يستخدم الموقع ملفات تعريف ارتباط أو تقنيات مشابهة لتذكّر تفضيلاتك، والحفاظ على جلسة تسجيل الدخول،
            وقياس الأداء. يمكنك ضبط المتصفح لرفض بعض أنواع الملفات، مع العلم أن ذلك قد يؤثر على عمل بعض المزايا.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">حقوقك وطلبات الخصوصية</h2>
          <p className="mt-3">
            يمكنك طلب الاطلاع على بياناتك الأساسية أو تصحيحها أو حذف حسابك أو الاعتراض على معالجة معيّنة حسب ما
            يسمح به القانون المعمول به. لأي طلب من هذا النوع، راسلنا عبر{" "}
            <Link href={ROUTES.contact} className="font-medium text-primary hover:underline">
              صفحة التواصل
            </Link>{" "}
            مع ذكر الموضوع بوضوح (مثلاً: «طلب حذف بيانات») وسنرد في أقرب وقت ممكن.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">تحديثات هذه السياسة</h2>
          <p className="mt-3">
            قد نحدّث سياسة الخصوصية من وقت لآخر لتواكب تطوّر خدماتنا أو المتطلبات القانونية. سيتم نشر النسخة
            المحدّثة على هذه الصفحة مع تعديل تاريخ السريان عند الحاجة. يُنصح بمراجعة الصفحة دورياً.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm">
        لأي استفسار خصوصية أو طلب متعلق ببياناتك:{" "}
        <Link href={ROUTES.contact} className="font-medium text-primary hover:underline">
          تواصل معنا
        </Link>
      </p>
    </div>
  );
}
