import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/** شريط ثقة خفيف — يُخفى مع التمرير من الهيدر */
export function MarketingStrip() {
  return (
    <div
      className={cn(
        "border-b border-sky-200/30 bg-sky-50/80 text-[10px] font-medium text-sky-800/70 backdrop-blur-sm md:text-[11px]"
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4 py-2">
        <span className="hidden sm:inline">شحن سريع · دفع آمن · دعم يهتم</span>
        <span className="sm:hidden">توصيل موثوق</span>
        <span className="hidden h-3 w-px bg-sky-300/50 sm:block" aria-hidden />
        <a href="tel:+966500000000" className="inline-flex items-center gap-1 tabular-nums hover:text-primary" dir="ltr">
          <Phone className="size-3 opacity-60" aria-hidden />
          +966 50 000 0000
        </a>
        <span className="hidden h-3 w-px bg-sky-300/50 md:block" aria-hidden />
        <a href="mailto:care@petszone.sa" className="hidden items-center gap-1 hover:text-primary md:inline-flex">
          <Mail className="size-3 opacity-60" aria-hidden />
          care@petszone.sa
        </a>
      </div>
    </div>
  );
}
