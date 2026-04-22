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

export async function addToCartAction(productId: string, variantId: string): Promise<void> {
  const v = String(variantId ?? "").trim();
  if (!v) {
    throw new Error("اختر خيار المنتج (المتغير) قبل الإضافة للسلة.");
  }
  await apiAddToCart(productId, v);
  revalidatePath(ROUTES.cart);
  revalidatePath(ROUTES.checkout);
  revalidatePath(ROUTES.products);
  revalidatePath(ROUTES.shop);
}

export async function updateCartQuantityAction(
  productId: string,
  quantity: number,
  variantId?: string
): Promise<void> {
  await apiUpdateCartItem(productId, quantity, variantId);
  revalidatePath(ROUTES.cart);
  revalidatePath(ROUTES.checkout);
}

export async function removeCartItemAction(productId: string, variantId?: string): Promise<void> {
  await apiRemoveCartItem(productId, variantId);
  revalidatePath(ROUTES.cart);
  revalidatePath(ROUTES.checkout);
}

export async function clearCartAction(): Promise<void> {
  await apiClearCart();
  revalidatePath(ROUTES.cart);
  revalidatePath(ROUTES.checkout);
}

/** Postman: multipart field name `code` */
export async function applyCouponAction(code: string): Promise<void> {
  const trimmed = String(code ?? "").trim();
  if (!trimmed) {
    throw new Error("أدخل كود الكوبون");
  }
  await apiApplyCoupon(trimmed);
  revalidatePath(ROUTES.cart);
  revalidatePath(ROUTES.checkout);
}
