import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeVariant = "info" | "success" | "warning" | "error";

const variantStyles: Record<
  NoticeVariant,
  { wrap: string; icon: typeof Info; iconClass: string }
> = {
  info: {
    wrap: "border-sky-200/70 bg-sky-50/80 text-sky-950 ring-sky-100/80",
    icon: Info,
    iconClass: "text-primary",
  },
  success: {
    wrap: "border-emerald-200/70 bg-emerald-50/70 text-emerald-950 ring-emerald-100/70",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  warning: {
    wrap: "border-amber-200/70 bg-amber-50/75 text-amber-950 ring-amber-100/70",
    icon: AlertTriangle,
    iconClass: "text-amber-600",
  },
  error: {
    wrap: "border-destructive/25 bg-destructive/[0.06] text-destructive ring-destructive/10",
    icon: AlertCircle,
    iconClass: "text-destructive",
  },
};

interface NoticeBannerProps {
  variant?: NoticeVariant;
  title?: string;
  children: ReactNode;
  className?: string;
  /** If true, used for live regions (errors) */
  role?: "alert" | "status";
}

export function NoticeBanner({
  variant = "info",
  title,
  children,
  className,
  role,
}: NoticeBannerProps) {
  const v = variantStyles[variant];
  const Icon = v.icon;
  const autoRole = role ?? (variant === "error" ? "alert" : "status");

  return (
    <div
      role={autoRole}
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-3.5 text-start text-sm shadow-sm ring-1",
        v.wrap,
        className
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", v.iconClass)} aria-hidden />
      <div className="min-w-0 flex-1 leading-relaxed">
        {title ? (
          <p className="mb-1 font-semibold text-[0.9375rem] leading-snug">{title}</p>
        ) : null}
        <div className="text-[0.9375rem] opacity-95 [&_p]:mb-2 [&_p:last-child]:mb-0">{children}</div>
      </div>
    </div>
  );
}
