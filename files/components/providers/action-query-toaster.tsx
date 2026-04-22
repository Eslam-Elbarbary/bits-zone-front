"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toastMessageForOk } from "@/lib/action-feedback-messages";
import { notify } from "@/lib/notify";
import { searchParamErrorText } from "@/lib/user-facing-errors";

const STORAGE_PREFIX = "action-toast:";

/**
 * Shows react-hot-toast for `?ok=` / `?error=` after server actions + redirects, then strips those params.
 */
export function ActionQueryToaster() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const ok = searchParams.get("ok");
    const error = searchParams.get("error");
    if (!ok && !error) {
      return;
    }

    const sig = `${pathname}?ok=${ok ?? ""}&error=${error ?? ""}`;
    let showToast = true;
    if (typeof window !== "undefined") {
      const key = STORAGE_PREFIX + sig;
      if (sessionStorage.getItem(key)) {
        showToast = false;
      } else {
        sessionStorage.setItem(key, "1");
        window.setTimeout(() => sessionStorage.removeItem(key), 4000);
      }
    }

    if (showToast) {
      if (error) {
        notify.error(searchParamErrorText(error));
      } else if (ok) {
        notify.success(toastMessageForOk(pathname, ok));
      }
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("ok");
    next.delete("error");
    const qs = next.toString();
    const target = qs ? `${pathname}?${qs}` : pathname;
    router.replace(target, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}
