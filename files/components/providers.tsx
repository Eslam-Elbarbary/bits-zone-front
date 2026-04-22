"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { SnowOverlay } from "@/components/effects/snow-overlay";
import { ActionQueryToaster } from "@/components/providers/action-query-toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <SnowOverlay />
      {children}
      <Suspense fallback={null}>
        <ActionQueryToaster />
      </Suspense>
      <Toaster
        position="top-center"
        containerClassName="!font-sans"
        containerStyle={{ direction: "rtl" }}
        toastOptions={{
          className:
            "!font-sans !text-sm !rounded-xl !border !border-sky-200/60 !bg-white/95 !px-4 !py-3 !shadow-lg !shadow-sky-900/10 !backdrop-blur-md !text-start",
          duration: 3600,
          success: {
            iconTheme: { primary: "oklch(0.58 0.145 245)", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            duration: 4800,
          },
        }}
      />
    </>
  );
}
