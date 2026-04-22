import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

function searchParamsToQueryString(sp: Record<string, string | string[] | undefined>): string {
  const u = new URLSearchParams();
  for (const [key, val] of Object.entries(sp)) {
    if (val === undefined) continue;
    if (typeof val === "string") {
      if (val !== "") u.set(key, val);
    } else {
      for (const item of val) {
        if (item !== "") u.append(key, item);
      }
    }
  }
  return u.toString();
}

/** `/shop` is an alias for the product listing; forwards query params so links like `?search=` work. */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qs = searchParamsToQueryString(sp);
  redirect(qs ? `${ROUTES.products}?${qs}` : ROUTES.products);
}
