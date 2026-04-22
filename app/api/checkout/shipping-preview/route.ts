import { NextResponse } from "next/server";
import { calculateShipping } from "@/lib/api";
import { shippingTotalFromApiData } from "@/lib/checkout-utils";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "طلب غير صالح" }, { status: 400 });
  }
  const rawId =
    body && typeof body === "object" && body !== null && "address_id" in body
      ? (body as { address_id: unknown }).address_id
      : undefined;
  if (rawId === undefined || rawId === null || rawId === "") {
    return NextResponse.json({ ok: false, message: "address_id مطلوب" }, { status: 400 });
  }
  const addressId = typeof rawId === "number" ? rawId : parseInt(String(rawId), 10);
  if (Number.isNaN(addressId) || addressId < 1) {
    return NextResponse.json({ ok: false, message: "عنوان غير صالح" }, { status: 400 });
  }

  try {
    const res = await calculateShipping(addressId);
    const total = shippingTotalFromApiData(res.data);
    return NextResponse.json({
      ok: true,
      total_shipping: total,
      raw: res.data,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "تعذر حساب الشحن";
    return NextResponse.json({ ok: false, message: msg }, { status: 422 });
  }
}
