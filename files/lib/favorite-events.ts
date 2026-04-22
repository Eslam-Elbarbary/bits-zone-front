/** Dispatched after favorites change so the header badge can refetch. */
export const FAVORITES_UPDATED_EVENT = "petszone:favorites-updated";

export function dispatchFavoritesUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
}
