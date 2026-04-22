"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createOrder, payOrder } from "@/lib/api";
import { rethrowIfRedirect } from "@/lib/server-actions";
import { ROUTES } from "@/constants";
import type { Order } from "@/types/api";

function orderIdFromData(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const id = (data as Order).id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  if (typeof id === "string" && id.trim()) return id.trim();
  return undefined;
}

export async function placeOrderAction(formData: FormData) {
  const address_id = String(formData.get("address_id") ?? "").trim();
  if (!address_id) {
    redirect(
      `${ROUTES.checkout}?error=${encodeURIComponent("اختر عنوان التوصيل")}`
    );
  }

  const coupon_code = String(formData.get("coupon_code") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const use_wallet = String(formData.get("use_wallet") ?? "").trim();
  const use_points = String(formData.get("use_points") ?? "").trim();
  const payChoice = String(formData.get("pay_choice") ?? "COD").trim();
  const paymentOther = String(formData.get("payment_method_other") ?? "").trim();

  let payment_method = "";
  if (payChoice === "skip") {
    payment_method = "";
  } else if (payChoice === "other") {
    if (!paymentOther) {
      redirect(
        `${ROUTES.checkout}?error=${encodeURIComponent(
          "أدخل معرّف طريقة الدفع أو اختر طريقة جاهزة من القائمة"
        )}`
      );
    }
    payment_method = paymentOther.trim();
  } else {
    payment_method = payChoice;
  }

  try {
    const res = await createOrder({
      address_id,
      coupon_code: coupon_code || undefined,
      notes: notes || undefined,
      use_wallet: use_wallet || undefined,
      use_points: use_points || undefined,
    });
    const idStr = orderIdFromData(res.data);
    revalidatePath(ROUTES.cart);
    revalidatePath(ROUTES.checkout);
    revalidatePath(ROUTES.orders);
    if (!idStr) {
      redirect(`${ROUTES.orders}?ok=placed`);
    }
    if (payment_method) {
      try {
        await payOrder(idStr, payment_method);
      } catch (payErr) {
        rethrowIfRedirect(payErr);
        redirect(
          `${ROUTES.orders}/${idStr}?error=${encodeURIComponent(
            payErr instanceof Error ? payErr.message : "تعذر تسجيل الدفع"
          )}`
        );
      }
      redirect(`${ROUTES.orders}/${idStr}?ok=paid`);
    }
    redirect(`${ROUTES.orders}/${idStr}?ok=placed`);
  } catch (e) {
    rethrowIfRedirect(e);
    redirect(
      `${ROUTES.checkout}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "تعذر إنشاء الطلب"
      )}`
    );
  }
}
