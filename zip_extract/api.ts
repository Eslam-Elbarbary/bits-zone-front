/**
 * lib/api.ts
 * ─────────────────────────────────────────────────────────
 * All API calls must be defined here.
 * Endpoint names and paths must match your Postman collection.
 * Types must match Postman response schemas (see types/api.ts).
 * ─────────────────────────────────────────────────────────
 */

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ── Core fetch wrapper ──────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}

// Auth-aware wrapper (SSR-safe, reads token from cookies)
async function apiFetchAuth<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = cookies().get("token")?.value;
  return apiFetch<T>(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    cache: "no-store",
  });
}

// ── Add your Postman collection endpoints below ─────────
// Pattern: one function per Postman request, named to match

// EXAMPLE — replace with your actual Postman collection:

export async function getProducts(params?: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  return apiFetch<unknown>(`/products${query ? `?${query}` : ""}`, {
    next: { revalidate: 60 },
  });
}

export async function getProductById(id: string) {
  return apiFetch<unknown>(`/products/${id}`, { cache: "no-store" });
}

export async function createProduct(body: unknown) {
  return apiFetchAuth<unknown>("/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateProduct(id: string, body: unknown) {
  return apiFetchAuth<unknown>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteProduct(id: string) {
  return apiFetchAuth<{ success: boolean }>(`/products/${id}`, {
    method: "DELETE",
  });
}

// Add more endpoints here following the same pattern...
