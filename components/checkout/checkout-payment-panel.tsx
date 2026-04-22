"use client";

import { useState } from "react";
import { Banknote, Clock, CreditCard, MoreHorizontal, Smartphone, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const METHODS = [
  {
    value: "COD",
    title: "الدفع عند الاستلام",
    subtitle: "ادفع نقداً عند استلام الطلب",
    Icon: Truck,
  },
  {
    value: "mada",
    title: "مدى",
    subtitle: "بطاقات مدى المدعومة",
    Icon: Smartphone,
  },
  {
    value: "visa",
    title: "بطاقة ائتمانية",
    subtitle: "Visa أو Mastercard",
    Icon: CreditCard,
  },
  {
    value: "cash",
    title: "نقدي",
    subtitle: "استلام من المكتب أو نقطة التسليم",
    Icon: Banknote,
  },
] as const;

export function CheckoutPaymentPanel() {
  const [choice, setChoice] = useState<string>("COD");

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
          aria-pressed={choice === "other"}
          onClick={() => setChoice("other")}
          className={cn(
            "flex items-start gap-3 rounded-2xl border-2 border-dashed p-3.5 text-start shadow-sm transition-all sm:col-span-2",
            "hover:border-sky-400/60 hover:bg-sky-50/40",
            choice === "other"
              ? "border-primary/70 bg-primary/[0.04] ring-2 ring-primary/20"
              : "border-sky-200/80 bg-white/70"
          )}
        >
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl ring-2 ring-white",
              choice === "other" ? "bg-sky-800 text-white" : "bg-sky-100/90 text-sky-700"
            )}
          >
            <MoreHorizontal className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 pt-0.5">
            <span className="block text-sm font-bold text-sky-950">طريقة أخرى</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              أدخل المعرف كما يعرّفه الخادم (مثل apple_pay)
            </span>
          </span>
          <span
            className={cn(
              "mt-1 size-4 shrink-0 rounded-full border-2",
              choice === "other" ? "border-primary bg-primary" : "border-sky-300 bg-white"
            )}
            aria-hidden
          />
        </button>

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

      {choice === "other" ? (
        <div className="space-y-2 rounded-xl border border-sky-100/80 bg-white/90 p-4 ring-1 ring-sky-50">
          <Label htmlFor="payment_method_other" className="text-sm font-semibold">
            معرّف طريقة الدفع
          </Label>
          <Input
            id="payment_method_other"
            name="payment_method_other"
            dir="ltr"
            className="font-mono text-sm"
            placeholder="مثال: apple_pay"
            autoComplete="off"
          />
        </div>
      ) : null}
    </div>
  );
}
