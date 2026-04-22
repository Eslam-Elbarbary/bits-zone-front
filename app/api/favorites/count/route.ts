import { NextResponse } from "next/server";
import { getFavoriteList } from "@/lib/api";
import { extractList } from "@/lib/api-data";
import type { Product } from "@/types/api";

export async function GET() {
  try {
    const res = await getFavoriteList();
    const list = extractList<Product>(res.data);
    return NextResponse.json({ count: list.length });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
