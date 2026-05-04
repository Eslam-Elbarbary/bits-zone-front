import Link from "next/link";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteLogoLink } from "@/components/shared/site-logo";
import { ROUTES, SITE_BRAND } from "@/constants";
import { cn } from "@/lib/utils";

const linkClass =
  "text-sky-800/85 transition-colors hover:text-primary";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto">
      <div
        className="h-1.5 w-full bg-gradient-to-l from-primary via-papaya to-sky-400"
        aria-hidden
      />

      <div
        className={cn(
          "relative border-t border-sky-200/40",
          "bg-gradient-to-b from-sky-100/90 via-sky-50/95 to-white",
          "shadow-[0_-12px_40px_-20px_rgba(14,116,188,0.12)]"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,oklch(0.58_0.12_245/0.08),transparent_60%)]"
          aria-hidden
        />

        <section className="relative border-b border-sky-200/35 py-10 md:py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="max-w-md">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-primary shadow-sm ring-1 ring-primary/15">
                <Sparkles className="size-3.5" aria-hidden />
                كن على اطلاع
              </div>
              <h2 className="text-xl font-bold text-sky-950 md:text-2xl">اشترك في العروض الحصرية</h2>
              <p className="mt-2 text-sm leading-relaxed text-sky-800/75">
                عروض وخصومات على أكل، رمل، ألعاب ومستلزمات الحيوانات — بريد خفيف دون إزعاج.
              </p>
            </div>
            <form
              className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
              action="#"
              method="post"
            >
              <Input
                type="email"
                name="email"
                placeholder="بريدك الإلكتروني"
                className={cn(
                  "h-11 flex-1 rounded-xl border-sky-200/80 bg-white/90 text-sky-950 shadow-inner",
                  "placeholder:text-sky-400 focus-visible:ring-primary/25"
                )}
                disabled
                readOnly
              />
              <Button
                type="button"
                className="h-11 shrink-0 rounded-xl bg-primary font-semibold shadow-md shadow-primary/25"
                disabled
              >
                اشتراك
              </Button>
            </form>
          </div>
        </section>

        <div className="relative py-12 md:py-14">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            <div className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-modern backdrop-blur-md sm:col-span-2 lg:col-span-1">
              <SiteLogoLink
                className="block"
                imageClassName="h-12 w-auto max-w-[240px] object-contain object-start md:h-14 drop-shadow-sm"
              />
              <p className="mt-4 text-sm leading-relaxed text-sky-800/80">
                متجرك المتخصص للعناية بحيوانك الاليف وتوفير جميع مستلزماتهم من
                دراي فود ويت فود اكسسورات ملابس سراير
              </p>
              <div className="mt-4 space-y-2 text-sm text-sky-800/75">
                <a
                  href="tel:+201103830072"
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="size-3.5" aria-hidden />
                  </span>
                  <span dir="ltr">+201103830072</span>
                </a>
                <a
                  href="mailto:petszone2019@gmail.com"
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-papaya/15 text-papaya">
                    <Mail className="size-3.5" aria-hidden />
                  </span>
                  petszone2019@gmail.com
                </a>
                <p className="flex items-start gap-2 pt-1">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <MapPin className="size-3.5" aria-hidden />
                  </span>
                  <span>
                    توصيل داخل القاهرة الجديده في نفس اليوم وجميع محافظات مصر
                    خلال 48 ساعه
                  </span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-sky-950">روابط سريعة</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href={ROUTES.products} className={linkClass}>
                    المنتجات
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.categories} className={linkClass}>
                    الفئات
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.favorites} className={linkClass}>
                    المفضلة
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.cart} className={linkClass}>
                    سلة التسوق
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.login} className={linkClass}>
                    حسابي
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold text-sky-950">لبائعينا</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <span className="text-sky-600/70">تسجيل مورد (قريباً)</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold text-sky-950">الدعم</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href={ROUTES.faq} className={linkClass}>
                    الأسئلة الشائعة
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.contact} className={linkClass}>
                    تواصل معنا
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.privacy} className={linkClass}>
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.about} className={linkClass}>
                    من نحن
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-sky-200/50 bg-white/50 py-5 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center text-xs text-sky-700/70 sm:flex-row sm:text-start">
            <p>
              © {new Date().getFullYear()} {SITE_BRAND}. جميع الحقوق محفوظة.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm sm:justify-end">
              <a href="#" className={cn(linkClass, "font-medium")}>
                فيسبوك
              </a>
              <a href="#" className={cn(linkClass, "font-medium")}>
                إنستقرام
              </a>
              <a href="#" className={cn(linkClass, "font-medium")}>
                X
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
