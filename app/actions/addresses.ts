"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAddress } from "@/lib/api";
import { coordsFromFormData } from "@/lib/address-form";
import { ROUTES } from "@/constants";

export async function addAddressCheckoutAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();

  if (!name || !address) {
    redirect(
      `${ROUTES.checkout}?error=${encodeURIComponent("الاسم والعنوان مطلوبان")}`
    );
  }

  const { latitude, longitude } = coordsFromFormData(formData);

  try {
    await createAddress({
      name,
      address,
      phone: phone || undefined,
      city: city || undefined,
      state: state || undefined,
      is_default: "1",
      latitude,
      longitude,
    });
  } catch (e) {
    redirect(
      `${ROUTES.checkout}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "تعذر حفظ العنوان"
      )}`
    );
  }

  revalidatePath(ROUTES.checkout);
  redirect(`${ROUTES.checkout}?ok=address`);
}
