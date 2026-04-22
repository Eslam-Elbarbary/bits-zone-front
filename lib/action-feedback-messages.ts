import { ROUTES } from "@/constants";

/**
 * Maps `?ok=` query values + pathname to user-facing Arabic copy for toast feedback.
 */
export function toastMessageForOk(pathname: string, ok: string): string {
  const p = pathname.replace(/\/$/, "") || "/";

  switch (ok) {
    case "login":
    case "signed_in":
      return "تم تسجيل الدخول بنجاح.";
    case "logout":
      return "تم تسجيل الخروج.";
    default:
      break;
  }

  if (p === ROUTES.login) {
    if (ok === "reset") {
      return "تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.";
    }
    if (ok === "verified") {
      return "تم تفعيل الحساب. يمكنك تسجيل الدخول الآن.";
    }
  }

  if (p === ROUTES.profile) {
    switch (ok) {
      case "profile":
        return "تم تحديث بيانات الملف الشخصي.";
      case "password":
        return "تم تحديث كلمة المرور.";
      case "address":
        return "تم حفظ العنوان بنجاح.";
      case "address_deleted":
        return "تم حذف العنوان.";
      default:
        return "تم تنفيذ العملية بنجاح.";
    }
  }

  if (p === ROUTES.checkout) {
    if (ok === "address") {
      return "تم حفظ العنوان. يمكنك الآن إتمام الطلب.";
    }
  }

  if (p === ROUTES.tickets) {
    switch (ok) {
      case "created":
        return "تم إنشاء التذكرة بنجاح.";
      case "deleted":
        return "تم حذف التذكرة.";
      default:
        return "تم تنفيذ العملية بنجاح.";
    }
  }

  if (p === ROUTES.ticketNew) {
    if (ok === "created") {
      return "تم إنشاء التذكرة بنجاح.";
    }
  }

  if (p.startsWith(`${ROUTES.tickets}/`) && p !== ROUTES.ticketNew) {
    switch (ok) {
      case "created":
        return "تم إنشاء التذكرة بنجاح — يمكنك متابعة الردود أدناه.";
      case "message":
        return "تم إرسال رسالتك.";
      case "status":
        return "تم تحديث حالة التذكرة.";
      default:
        return "تم تنفيذ العملية بنجاح.";
    }
  }

  if (p === ROUTES.orders) {
    if (ok === "placed") {
      return "تم إنشاء الطلب بنجاح.";
    }
  }

  if (p.startsWith(`${ROUTES.orders}/`)) {
    switch (ok) {
      case "placed":
        return "تم إنشاء الطلب بنجاح.";
      case "paid":
        return "تم تسجيل الدفع.";
      case "cancelled":
        return "تم إلغاء الطلب.";
      case "reordered":
        return "تمت إعادة إضافة عناصر الطلب إلى السلة.";
      case "refund_requested":
        return "تم إرسال طلب الاسترجاع.";
      case "shipping_calculated":
        return "تم حساب الشحن — راجع الملخص إن حُدّث الإجمالي.";
      default:
        return "تم تنفيذ الإجراء بنجاح.";
    }
  }

  return "تم تنفيذ العملية بنجاح.";
}
