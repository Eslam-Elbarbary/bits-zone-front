import { getCart, getFavoriteList } from "@/lib/api";
import { extractList } from "@/lib/api-data";
import { HeaderChrome } from "@/components/shared/header-chrome";
import { cartTotalQuantity } from "@/lib/cart-utils";
import type { Product } from "@/types/api";
import { cn } from "@/lib/utils";

export async function SiteHeader({ className }: { className?: string }) {
  const [cartCount, favoriteCount] = await Promise.all([
    (async () => {
      try {
        const res = await getCart();
        return cartTotalQuantity(res.data);
      } catch {
        return 0;
      }
    })(),
    (async () => {
      try {
        const res = await getFavoriteList();
        return extractList<Product>(res.data).length;
      } catch {
        return 0;
      }
    })(),
  ]);

  return (
    <div className={cn(className)}>
      <HeaderChrome cartCount={cartCount} favoriteCount={favoriteCount} />
    </div>
  );
}
