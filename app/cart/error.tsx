"use client";

import { useEffect } from "react";
import { AppErrorFallback } from "@/components/shared/app-error-fallback";

export default function Error({
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
    <AppErrorFallback
      error={error}
      reset={reset}
      context="cart"
      hint="لم نتمكن من قراءة سلتك. جرّب التحديث أو تسجيل الدخول مرة أخرى إن لزم."
    />
  );
}
