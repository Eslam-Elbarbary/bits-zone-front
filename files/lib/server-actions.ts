import { isRedirectError } from "next/dist/client/components/redirect-error";

/** Must rethrow from `catch` so Next.js can complete `redirect()` — never treat as app error. */
export function rethrowIfRedirect(e: unknown): void {
  if (isRedirectError(e)) throw e;
}
