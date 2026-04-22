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
      context="product"
      hint="قد يكون المنتج غير متوفر أو الرابط غير صحيح."
      backToShopHref={ROUTES.products}
      backToShopLabel="العودة للمنتجات"
    />
  );
}
