/** Dispatched after cart mutations so the header badge can refetch without a full navigation. */
export const CART_UPDATED_EVENT = "petszone:cart-updated";

export function dispatchCartUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
