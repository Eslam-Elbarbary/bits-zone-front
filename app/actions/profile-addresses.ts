"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAddress, deleteAddress } from "@/lib/api";
import { coordsFromFormData } from "@/lib/address-form";
import { ROUTES } from "@/constants";

export async function addAddressProfileAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const defaultOn =
    formData.get("is_default") === "on" ||
    formData.get("is_default") === "1" ||
    formData.get("is_default") === "true";

  if (!name || !address) {
    redirect(`${ROUTES.profile}?error=${encodeURIComponent("الاسم والعنوان مطلوبان")}`);
  }

  const { latitude, longitude } = coordsFromFormData(formData);

  try {
    await createAddress({
      name,
      address,
      phone: phone || undefined,
      city: city || undefined,
      state: state || undefined,
      is_default: defaultOn ? "1" : "0",
      latitude,
      longitude,
    });
  } catch (e) {
    redirect(
      `${ROUTES.profile}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "تعذر حفظ العنوان"
      )}`
    );
  }

  revalidatePath(ROUTES.profile);
  redirect(`${ROUTES.profile}?ok=address`);
}

export async function deleteAddressProfileAction(formData: FormData) {
  const id = String(formData.get("address_id") ?? "").trim();
  if (!id) {
    redirect(`${ROUTES.profile}?error=${encodeURIComponent("معرّف العنوان غير صالح")}`);
  }

  try {
    await deleteAddress(id);
  } catch (e) {
    redirect(
      `${ROUTES.profile}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "تعذر حذف العنوان"
      )}`
    );
  }

  revalidatePath(ROUTES.profile);
  revalidatePath(ROUTES.checkout);
  redirect(`${ROUTES.profile}?ok=address_deleted`);
}
