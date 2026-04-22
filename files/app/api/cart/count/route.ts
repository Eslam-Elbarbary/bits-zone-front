import { NextResponse } from "next/server";
import { getCart } from "@/lib/api";
import { cartTotalQuantity } from "@/lib/cart-utils";

export async function GET() {
  try {
    const res = await getCart();
    return NextResponse.json({ count: cartTotalQuantity(res.data) });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
