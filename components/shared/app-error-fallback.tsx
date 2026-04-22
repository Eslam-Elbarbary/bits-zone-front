"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import {
  errorBoundaryTitle,
  getUserFacingErrorDescription,
  type ErrorBoundaryContext,
} from "@/lib/user-facing-errors";
import { cn } from "@/lib/utils";

interface AppErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Controls default Arabic title */
  context?: ErrorBoundaryContext;
  /** Override title */
  title?: string;
  /** Optional secondary line above description */
  hint?: ReactNode;
  /** Show link back to shop (product detail only) */
  showBackToShop?: boolean;
  backToShopHref?: string;
  backToShopLabel?: string;
}

export function AppErrorFallback({
  error,
  reset,
  context = "app",
  title,
  hint,
  showBackToShop = true,
  backToShopHref = ROUTES.shop,
  backToShopLabel = "العودة للمتجر",
}: AppErrorFallbackProps) {
  const heading = title ?? errorBoundaryTitle(context);
  const description = getUserFacingErrorDescription(error.message);

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-[min(100dvh,520px)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 h-48 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.72_0.175_62/0.12),transparent)]"
        aria-hidden
      />
      <div
        className="relative flex w-full flex-col items-center rounded-[1.75rem] border border-sky-200/60 bg-white/90 px-6 py-10 shadow-[0_20px_50px_-24px_oklch(0.45_0.1_245/0.35)] ring-1 ring-white/90 backdrop-blur-md sm:px-10"
      >
        <span
          className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-sky-50 text-amber-700 shadow-sm ring-1 ring-amber-200/60"
          aria-hidden
        >
          <AlertTriangle className="size-7" strokeWidth={1.75} />
        </span>
        <h1 className="text-balance text-xl font-bold tracking-tight text-sky-950 sm:text-2xl">
          {heading}
        </h1>
        {hint ? (
          <p className="mt-2 text-pretty text-sm font-medium text-sky-800/85">{hint}</p>
        ) : null}
        <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {process.env.NODE_ENV === "development" && error.digest ? (
          <p className="mt-3 font-mono text-[10px] text-muted-foreground/80">ID: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-row-reverse sm:justify-center">
          <Button
            type="button"
            size="lg"
            className="h-12 w-full gap-2 rounded-xl shadow-md sm:w-auto sm:min-w-[10rem]"
            onClick={() => reset()}
          >
            <RefreshCw className="size-4 opacity-90" aria-hidden />
            إعادة المحاولة
          </Button>
          {showBackToShop ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-xl border-sky-200/80 sm:w-auto sm:min-w-[10rem]"
              asChild
            >
              <Link href={backToShopHref}>{backToShopLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
