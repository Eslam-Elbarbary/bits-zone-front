"use client";

import { useState } from "react";
import { Clock, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const METHODS = [
  {
    value: "FAWRY",
    title: "الدفع الإلكتروني (FAWRY)",
    subtitle: "التحويل إلى بوابة فوري حسب استجابة الخادم",
    Icon: CreditCard,
  },
] as const;

export function CheckoutPaymentPanel() {
  const [choice, setChoice] = useState<string>("FAWRY");

  return (
    <div className="space-y-4">
      <input type="hidden" name="pay_choice" value={choice} />

      <div className="grid gap-2.5 sm:grid-cols-2">
        {METHODS.map(({ value, title, subtitle, Icon }) => {
          const active = choice === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setChoice(value)}
              className={cn(
                "flex items-start gap-3 rounded-2xl border-2 p-3.5 text-start shadow-sm transition-all",
                "hover:border-primary/35 hover:bg-primary/[0.03]",
                active
                  ? "border-primary bg-gradient-to-br from-primary/[0.08] to-papaya/[0.06] ring-2 ring-primary/25"
                  : "border-sky-100/90 bg-white/95"
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl ring-2 ring-white",
                  active ? "bg-primary text-primary-foreground shadow-md" : "bg-sky-100/90 text-sky-800"
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <span className="block text-sm font-bold text-sky-950">{title}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{subtitle}</span>
              </span>
              <span
                className={cn(
                  "mt-1 size-4 shrink-0 rounded-full border-2",
                  active ? "border-primary bg-primary shadow-inner" : "border-sky-300 bg-white"
                )}
                aria-hidden
              />
            </button>
          );
        })}

        <button
          type="button"
          aria-pressed={choice === "skip"}
          onClick={() => setChoice("skip")}
          className={cn(
            "flex items-start gap-3 rounded-2xl border-2 p-3.5 text-start shadow-sm transition-all sm:col-span-2",
            "hover:border-sky-300",
            choice === "skip"
              ? "border-sky-500/50 bg-sky-50/80 ring-2 ring-sky-200/80"
              : "border-sky-100/80 bg-muted/20"
          )}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-2 ring-white">
            <Clock className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 pt-0.5">
            <span className="block text-sm font-bold text-sky-950">إنشاء الطلب والدفع لاحقاً</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              لن يُنفَّذ الدفع الآن؛ يمكنك إكماله لاحقاً من صفحة الطلب عندما تكون جاهزاً.
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
