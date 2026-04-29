"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart as apiAddToCart,
  applyCoupon as apiApplyCoupon,
  clearCart as apiClearCart,
  removeCartItem as apiRemoveCartItem,
  updateCartItem as apiUpdateCartItem,
} from "@/lib/api";
import { ROUTES } from "@/constants";

export type CartActionResult = { ok: true } | { ok: false; error: string };

function toActionError(error: unknown, fallback: string): CartActionResult {
  return {
    ok: false,
    error: error instanceof Error && error.message.trim() ? error.message : fallback,
  };
}

export async function addToCartAction(productId: string, variantId: string): Promise<CartActionResult> {
  const v = String(variantId ?? "").trim();
  if (!v) {
    return { ok: false, error: "اختر خيار المنتج (المتغير) قبل الإضافة للسلة." };
  }
  try {
    await apiAddToCart(productId, v);
    revalidatePath(ROUTES.cart);
    revalidatePath(ROUTES.checkout);
    revalidatePath(ROUTES.products);
    revalidatePath(ROUTES.shop);
    return { ok: true };
  } catch (error) {
    return toActionError(error, "تعذر إضافة المنتج للسلة");
  }
}

export async function updateCartQuantityAction(
  productId: string,
  quantity: number,
  variantId?: string
): Promise<CartActionResult> {
  try {
    await apiUpdateCartItem(productId, quantity, variantId);
    revalidatePath(ROUTES.cart);
    revalidatePath(ROUTES.checkout);
    return { ok: true };
  } catch (error) {
    return toActionError(error, "فشل تحديث الكمية");
  }
}

export async function removeCartItemAction(productId: string, variantId?: string): Promise<CartActionResult> {
  try {
    await apiRemoveCartItem(productId, variantId);
    revalidatePath(ROUTES.cart);
    revalidatePath(ROUTES.checkout);
    return { ok: true };
  } catch (error) {
    return toActionError(error, "فشل حذف المنتج من السلة");
  }
}

export async function clearCartAction(): Promise<CartActionResult> {
  try {
    await apiClearCart();
    revalidatePath(ROUTES.cart);
    revalidatePath(ROUTES.checkout);
    return { ok: true };
  } catch (error) {
    return toActionError(error, "تعذر تفريغ السلة");
  }
}

/** Postman: multipart field name `code` */
export async function applyCouponAction(code: string): Promise<CartActionResult> {
  const trimmed = String(code ?? "").trim();
  if (!trimmed) {
    return { ok: false, error: "أدخل كود الكوبون" };
  }
  try {
    await apiApplyCoupon(trimmed);
    revalidatePath(ROUTES.cart);
    revalidatePath(ROUTES.checkout);
    return { ok: true };
  } catch (error) {
    return toActionError(error, "تعذر تطبيق الكوبون");
  } 
}
