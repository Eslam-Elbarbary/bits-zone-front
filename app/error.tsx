"use client";

import { useEffect } from "react";
import { AppErrorFallback } from "@/components/shared/app-error-fallback";
import { ROUTES } from "@/constants";

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
      context="app"
      title="حدث خطأ غير متوقع"
      hint="لم نتمكن من إكمال طلبك."
      backToShopHref={ROUTES.home}
      backToShopLabel="الصفحة الرئيسية"
    />
  );
}
