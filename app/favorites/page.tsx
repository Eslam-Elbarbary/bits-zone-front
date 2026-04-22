import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { getFavoriteList } from "@/lib/api";
import type { Product } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "المفضلة" };
}

export default async function FavoritesPage() {
  let products: Product[] = [];
  let needLogin = false;

  try {
    const res = await getFavoriteList();
    const raw = res.data;
    if (Array.isArray(raw)) products = raw as Product[];
  } catch {
    needLogin = true;
  }

  if (needLogin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">المفضلة</h1>
        <p className="mt-4 text-muted-foreground">سجّل الدخول لعرض منتجاتك المفضلة.</p>
        <Button asChild className="mt-6 bg-primary">
          <Link href={ROUTES.login}>تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">المفضلة</h1>
      {products.length === 0 ? (
        <p className="text-muted-foreground">
          لا توجد منتجات بعد.{" "}
          <Link href={ROUTES.shop} className="text-primary hover:underline">
            تصفح المنتجات
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
