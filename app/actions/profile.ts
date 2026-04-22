"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updatePassword, updateProfile } from "@/lib/api";
import { ROUTES } from "@/constants";

export async function updateProfileAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const image = formData.get("image");

  try {
    await updateProfile({
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      image: image instanceof File && image.size > 0 ? image : undefined,
    });
  } catch (e) {
    redirect(
      `${ROUTES.profile}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "تعذر تحديث الملف الشخصي"
      )}`
    );
  }

  revalidatePath(ROUTES.profile);
  redirect(`${ROUTES.profile}?ok=profile`);
}

export async function updatePasswordAction(formData: FormData) {
  const current_password = String(formData.get("current_password") ?? "");
  const password = String(formData.get("password") ?? "");
  const password_confirmation = String(formData.get("password_confirmation") ?? "");

  if (!current_password || !password || !password_confirmation) {
    redirect(
      `${ROUTES.profile}?error=${encodeURIComponent(
        "أدخل كلمة المرور الحالية والجديدة وتأكيدها"
      )}`
    );
  }

  if (password !== password_confirmation) {
    redirect(`${ROUTES.profile}?error=${encodeURIComponent("تأكيد كلمة المرور غير مطابق")}`);
  }

  try {
    await updatePassword({ current_password, password, password_confirmation });
  } catch (e) {
    redirect(
      `${ROUTES.profile}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "تعذر تحديث كلمة المرور"
      )}`
    );
  }

  revalidatePath(ROUTES.profile);
  redirect(`${ROUTES.profile}?ok=password`);
}

