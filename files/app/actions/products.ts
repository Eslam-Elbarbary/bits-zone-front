"use server";

import { revalidatePath } from "next/cache";
import { getProductById, rateProduct, reportProduct, toggleProductFavorite } from "@/lib/api";
import { ROUTES } from "@/constants";
import { extractProductFromApiResponse } from "@/lib/product-api-helpers";
import type { Product } from "@/types/api";

export type ProductMutationResult = { ok: true } | { ok: false; error: string };

export type QuickViewProductResult =
  | { ok: true; product: Product }
  | { ok: false; error: string };

/** Loads full product (variants, default variant) for quick view when list cards omit them. */
export async function fetchProductForQuickViewAction(productId: string): Promise<QuickViewProductResult> {
  const id = String(productId ?? "").trim();
  if (!id) return { ok: false, error: "معرّف المنتج غير صالح" };
  try {
    const res = await getProductById(id);
    const p = extractProductFromApiResponse(res);
    if (!p) return { ok: false, error: "تعذر قراءة بيانات المنتج" };
    return { ok: true, product: p };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "تعذر تحميل تفاصيل المنتج",
    };
  }
}

export async function toggleProductFavoriteAction(productId: string): Promise<ProductMutationResult> {
  try {
    await toggleProductFavorite(productId);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "تعذر تحديث المفضلة — سجّل الدخول إن لزم",
    };
  }
  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
  revalidatePath(ROUTES.favorites);
  revalidatePath(ROUTES.shop);
  return { ok: true };
}

export async function rateProductAction(
  productId: string,
  formData: FormData
): Promise<ProductMutationResult> {
  const rating = parseInt(String(formData.get("rating") ?? ""), 10);
  const comment = String(formData.get("comment") ?? "").trim();
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "اختر تقييماً بين 1 و 5" };
  }
  try {
    await rateProduct(productId, rating, comment || undefined);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "تعذر إرسال التقييم",
    };
  }
  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
  revalidatePath(ROUTES.shop);
  return { ok: true };
}

export async function reportProductAction(
  productId: string,
  formData: FormData
): Promise<ProductMutationResult> {
  const reason = String(formData.get("reason") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!reason || !description) {
    return { ok: false, error: "أدخل السبب ووصفاً للمشكلة" };
  }
  try {
    await reportProduct(productId, reason, description);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "تعذر إرسال البلاغ",
    };
  }
  revalidatePath(`/products/${productId}`);
  return { ok: true };
}
