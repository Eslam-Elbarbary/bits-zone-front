"use client";

import { useEffect } from "react";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";

/**
 * Catches errors in the root layout; avoids a totally blank screen when the app shell fails.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 font-sans text-foreground">
        <h1 className="text-xl font-semibold">حدث خطأ في التطبيق</h1>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          {getUserFacingErrorDescription(error.message)}
        </p>
        <button
          type="button"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          onClick={() => reset()}
        >
          إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
