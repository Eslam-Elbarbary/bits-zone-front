"use server";

import {
  resetPasswordSendCode,
  resetPasswordSetNew,
  resetPasswordVerifyCode,
} from "@/lib/api";

function tokenFromObject(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string" && data.trim()) return data.trim();
  if (typeof data === "object" && !Array.isArray(data)) {
    const o = data as Record<string, unknown>;
    for (const k of ["reset_token", "token", "resetToken", "access_token"] as const) {
      const v = o[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    const nested = o.data;
    if (nested !== undefined && nested !== data) {
      return tokenFromObject(nested);
    }
  }
  return null;
}

function extractResetToken(data: unknown): string | null {
  const direct = tokenFromObject(data);
  if (direct) return direct;
  return null;
}

export type ResetActionResult = { ok: true } | { ok: false; error: string };

export type VerifyActionResult =
  | { ok: true; reset_token: string }
  | { ok: false; error: string };

export async function resetPasswordSendCodeAction(formData: FormData): Promise<ResetActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!email && !phone) {
    return { ok: false, error: "أدخل البريد الإلكتروني أو رقم الجوال" };
  }
  try {
    await resetPasswordSendCode({
      email: email || undefined,
      phone: phone || undefined,
    });
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "تعذر إرسال رمز التحقق",
    };
  }
}

export async function resetPasswordVerifyCodeAction(formData: FormData): Promise<VerifyActionResult> {
  const code = String(formData.get("code") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!code) {
    return { ok: false, error: "أدخل رمز التحقق" };
  }
  if (!email && !phone) {
    return { ok: false, error: "بيانات الاتصال مفقودة — أعد الخطوة الأولى" };
  }
  try {
    const res = await resetPasswordVerifyCode({
      code,
      email: email || undefined,
      phone: phone || undefined,
    });
    const token = extractResetToken(res.data);
    if (!token) {
      return {
        ok: false,
        error: "لم يُرجع الخادم رمز إعادة التعيين — تحقق من الاستجابة أو من الـ API",
      };
    }
    return { ok: true, reset_token: token };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "رمز التحقق غير صالح",
    };
  }
}

export async function resetPasswordSetNewAction(formData: FormData): Promise<ResetActionResult> {
  const reset_token = String(formData.get("reset_token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const password_confirmation = String(formData.get("password_confirmation") ?? "");
  if (!reset_token) {
    return { ok: false, error: "انتهت الجلسة — أعد الخطوات من البداية" };
  }
  if (!password || !password_confirmation) {
    return { ok: false, error: "أدخل كلمة المرور وتأكيدها" };
  }
  if (password !== password_confirmation) {
    return { ok: false, error: "تأكيد كلمة المرور غير مطابق" };
  }
  try {
    await resetPasswordSetNew({
      reset_token,
      password,
      password_confirmation,
    });
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "تعذر تعيين كلمة المرور الجديدة",
    };
  }
}
