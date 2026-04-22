"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationCode,
  verifyEmail,
} from "@/lib/api";
import { ROUTES } from "@/constants";
import { revalidatePath } from "next/cache";

export type ActionState =
  | { error?: string; ok?: boolean; email?: string }
  | undefined;

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!login || !password) {
    return { error: "أدخل البريد أو الجوال وكلمة المرور" };
  }
  try {
    const res = await loginUser({ login, password });
    const raw = res.data as { token?: string; access_token?: string };
    const token = raw?.token ?? raw?.access_token;
    if (!token) {
      return { error: res.message ?? "لم يُرجع الخادم رمز الدخول" };
    }
    const jar = await cookies();
    jar.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "فشل تسجيل الدخول" };
  }
  revalidatePath("/", "layout");
  const nextRaw = String(formData.get("next") ?? "").trim();
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") && !nextRaw.includes(":")
      ? nextRaw
      : null;
  const dest = next ?? "/";
  const join = dest.includes("?") ? "&" : "?";
  redirect(`${dest}${join}ok=login`);
}

export async function registerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const password_confirmation = String(formData.get("password_confirmation") ?? "");

  if (!name || !password) {
    return { error: "الاسم وكلمة المرور مطلوبان" };
  }
  if (!email && !phone) {
    return { error: "أدخل البريد الإلكتروني أو رقم الجوال" };
  }

  try {
    await registerUser({
      name,
      email,
      phone,
      password,
      password_confirmation,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "فشل إنشاء الحساب" };
  }
  return {
    ok: true,
    error: undefined,
    email: email || undefined,
  };
}

export async function verifyEmailAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  if (!email || !code) {
    return { error: "أدخل البريد الإلكتروني ورمز التفعيل." };
  }
  try {
    await verifyEmail({ email, code });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "تعذر تفعيل الحساب" };
  }
  redirect(`${ROUTES.login}?ok=verified`);
}

export async function resendVerificationCodeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "أدخل البريد الإلكتروني لإعادة إرسال الرمز." };
  }
  try {
    await resendVerificationCode({ email });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "تعذر إرسال الرمز" };
  }
  return { ok: true, error: undefined };
}

export async function logoutAction(): Promise<void> {
  try {
    await logoutUser();
  } catch {
    /* ignore */
  }
  const jar = await cookies();
  jar.delete("token");
  revalidatePath("/", "layout");
  redirect("/?ok=logout");
}
