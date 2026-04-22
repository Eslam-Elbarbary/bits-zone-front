/**
 * Maps technical / thrown errors to safe Arabic copy for end users.
 * Never surface raw JS stack strings or internal identifiers in the UI.
 */
export function getUserFacingErrorDescription(raw: string | undefined | null): string {
  let m = (raw ?? "").trim();
  /** Some APIs prefix messages with `.` from string concatenation bugs */
  m = m.replace(/^\.\s*/, "");
  if (!m) {
    return "حدث خطأ غير متوقع. يُرجى المحاولة مرة أخرى أو العودة لاحقاً.";
  }

  // Next.js internal control flow — must never be shown as user-facing text
  if (/^NEXT_REDIRECT$/i.test(m) || /^NEXT_NOT_FOUND$/i.test(m)) {
    return "تعذر إتمام العملية بسبب مشكلة تقنية. حدّث الصفحة أو أعد المحاولة بعد قليل.";
  }

  if (
    /is not defined|ReferenceError|TypeError|Cannot read properties|undefined is not a function/i.test(
      m
    ) ||
    /^[A-Z][a-zA-Z]*Error\s*:/i.test(m)
  ) {
    return "تعذر إتمام العملية بسبب مشكلة تقنية. حدّث الصفحة أو أعد المحاولة بعد قليل.";
  }

  // HTTP method + path or `/api/...` leaks from backends — never show to end users
  if (/\b(GET|POST|PUT|PATCH|DELETE)\s+[/\\]/i.test(m) || /\/api\/[^\s]+/i.test(m)) {
    return "تعذر إتمام العملية. حدّث الصفحة أو أعد المحاولة، وإذا استمرت المشكلة تواصل مع الدعم.";
  }

  if (/network|failed to fetch|load failed|timeout|ECONNREFUSED/i.test(m)) {
    return "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت ثم أعد المحاولة.";
  }

  // PHP / Laravel-style internal messages — never show raw server errors
  if (/undefined array key|trying to access array offset|array key\s*["']/i.test(m)) {
    return "تعذر إتمام الطلب. تحقق من البيانات وأعد المحاولة، وإذا استمرت المشكلة تواصل مع الدعم.";
  }

  if (/not verified|verify your account before logging in|account is not verified/i.test(m)) {
    return "لم يُفعَّل حسابك بعد. أدخل رمز التفعيل من بريدك أو افتح صفحة «تفعيل الحساب» من الرابط أسفل نموذج الدخول.";
  }

  if (/401|403|unauthorized|forbidden|غير مصرح/i.test(m)) {
    return "لا تملك صلاحية لهذه العملية. سجّل الدخول إن لزم ثم أعد المحاولة.";
  }

  /**
   * Only map true “missing route/page” cases — not business rules like
   * “coupon not found” / “code could not be found” (those must show the API text).
   */
  if (
    /غير موجود/i.test(m) ||
    /\bAPI Error:\s*404\b/i.test(m) ||
    /^not found$/i.test(m)
  ) {
    return "المحتوى المطلوب غير متوفر حالياً.";
  }

  if (/500|502|503|server error|bad gateway/i.test(m)) {
    return "الخادم غير متاح مؤقتاً. يُرجى المحاولة بعد قليل.";
  }

  if (/unable to create refund request|refund request could not be created|could not create refund/i.test(m)) {
    return "تعذر تسجيل طلب الاسترجاع. غالباً لا تسمح حالة الطلب أو الدفع بذلك (طلب غير مدفوع، ملغى، أو يوجد طلب استرجاع مسبق). راجع تفاصيل الطلب أو تواصل مع الدعم.";
  }

  // Short, likely user-facing API messages (Arabic or short English) — keep as-is
  if (m.length <= 220 && !/[{}[\]\\`]|at \w+ \(/i.test(m)) {
    return m;
  }

  return "تعذر إتمام الطلب. إذا استمرت المشكلة، تواصل مع الدعم.";
}

export type ErrorBoundaryContext = "app" | "products" | "product" | "cart";

const TITLES: Record<ErrorBoundaryContext, string> = {
  app: "حدث خطأ",
  products: "تعذر تحميل المنتجات",
  product: "تعذر فتح المنتج",
  cart: "تعذر تحميل السلة",
};

export function errorBoundaryTitle(context: ErrorBoundaryContext): string {
  return TITLES[context] ?? TITLES.app;
}

/** `error` / `?error=` query values may be URL-encoded; always map to safe Arabic for UI. */
export function searchParamErrorText(raw: string | undefined | null): string {
  const s = (raw ?? "").trim();
  if (!s) return getUserFacingErrorDescription("");
  let decoded = s;
  try {
    decoded = decodeURIComponent(s);
  } catch {
    decoded = s;
  }
  return getUserFacingErrorDescription(decoded);
}
