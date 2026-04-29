/**
 * HTTP client aligned with `Pets Zone.postman_collection.json`.
 * Paths, methods, and body shapes (JSON vs multipart) match the collection’s live requests.
 */
import "server-only";

import { cookies } from "next/headers";
import type {
  Address,
  ApiEnvelope,
  ApiUser,
  Cart,
  CategoriesQueryParams,
  Category,
  LoginResponseData,
  Order,
  Product,
  ProductsQueryParams,
  Slider,
  SupportTicket,
  Vendor,
  VendorsQueryParams,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getBaseUrl(): string {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  let base = BASE_URL.trim().replace(/\/+$/, "");
  /** Postman uses {{base_url}}/api/... — accept env ending in /api without duplicating path */
  if (base.toLowerCase().endsWith("/api")) {
    base = base.slice(0, -4).replace(/\/+$/, "");
  }
  return base;
}

function queryString(params?: Record<string, string | undefined>): string {
  if (!params) return "";
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

async function getAuthHeader(): Promise<HeadersInit> {
  const jar = await cookies();
  const token = jar.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response from API");
  }
}

function tryParseJson(text: string): unknown | null {
  const t = text.trim();
  if (!t) return null;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return null;
  }
}

function firstValidationMessage(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;
  for (const arr of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(arr) && arr[0] != null && String(arr[0]).trim()) {
      return String(arr[0]).trim();
    }
  }
  return null;
}

async function handleJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const parsed = tryParseJson(text);

  if (!res.ok) {
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const b = parsed as { message?: string; errors?: Record<string, string[]> };
      const msg =
        (typeof b.message === "string" && b.message.trim()) ||
        firstValidationMessage(b.errors) ||
        `API Error: ${res.status}`;
      throw new Error(msg);
    }
    throw new Error(`API Error: ${res.status}`);
  }

  if (parsed == null) {
    if (!text.trim()) return {} as T;
    throw new Error("Invalid JSON response from API");
  }
  return parsed as T;
}

/** Public multipart (no Bearer) — e.g. reset-password steps in Postman */
async function apiFetchForm<T>(
  path: string,
  formData: FormData,
  init: Omit<RequestInit, "body"> = {}
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: init.method ?? "POST",
    headers: {
      Accept: "application/json",
      ...(init.headers as Record<string, string>),
    },
    body: formData,
    cache: "no-store",
  });

  return handleJsonResponse<T>(res);
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const { cache, next, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(rest.headers as Record<string, string>),
    },
    cache: cache ?? "no-store",
    next,
  });

  return handleJsonResponse<T>(res);
}

export async function apiFetchOptionalAuth<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const auth = await getAuthHeader();
  return apiFetch<T>(path, {
    ...init,
    headers: { ...auth, ...(init.headers as Record<string, string>) },
  });
}

export async function apiFetchAuth<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const auth = await getAuthHeader();
  if (!("Authorization" in auth)) {
    throw new Error("يجب تسجيل الدخول لإتمام هذا الإجراء");
  }

  return apiFetch<T>(path, {
    ...init,
    headers: { ...auth, ...(init.headers as Record<string, string>) },
  });
}

/** multipart + Bearer (omit Content-Type so boundary is set) */
export async function apiFetchAuthForm<T>(
  path: string,
  formData: FormData,
  init: Omit<RequestInit, "body"> = {}
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const auth = await getAuthHeader();
  if (!("Authorization" in auth)) {
    throw new Error("يجب تسجيل الدخول لإتمام هذا الإجراء");
  }

  const res = await fetch(url, {
    method: init.method ?? "POST",
    headers: {
      Accept: "application/json",
      ...auth,
      ...(init.headers as Record<string, string>),
    },
    body: formData,
    cache: "no-store",
  });

  return handleJsonResponse<T>(res);
}

// ── Authentication ───────────────────────────────────────────────────────

export async function registerUser(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<ApiEnvelope<{ user: ApiUser }>>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(payload: { email: string; code: string; phone?: string }) {
  return apiFetch<ApiEnvelope<unknown>>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      code: payload.code,
      phone: payload.phone ?? "",
    }),
  });
}

export async function verifyPhone(payload: { phone: string; code: string }) {
  return apiFetch<ApiEnvelope<unknown>>("/api/auth/verify-phone", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendVerificationCode(payload: { email: string; phone?: string }) {
  return apiFetch<ApiEnvelope<unknown>>("/api/auth/resend-verification-code", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      phone: payload.phone ?? "",
    }),
  });
}

export async function loginUser(payload: { login: string; password: string }) {
  return apiFetch<ApiEnvelope<LoginResponseData>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutUser() {
  return apiFetchAuth<ApiEnvelope<unknown>>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  return apiFetchAuth<ApiEnvelope<{ user: ApiUser }>>("/api/user");
}

// ── Reset password (Postman: multipart formdata) ───────────────────────────

export async function resetPasswordSendCode(payload: {
  email?: string;
  phone?: string;
}) {
  const fd = new FormData();
  if (payload.email) fd.append("email", payload.email);
  if (payload.phone) fd.append("phone", payload.phone);
  return apiFetchForm<ApiEnvelope<unknown>>(
    "/api/auth/reset-password/send-code",
    fd
  );
}

export async function resetPasswordVerifyCode(payload: {
  code: string;
  email?: string;
  phone?: string;
}) {
  const fd = new FormData();
  fd.append("code", payload.code);
  if (payload.email) fd.append("email", payload.email);
  if (payload.phone) fd.append("phone", payload.phone);
  return apiFetchForm<ApiEnvelope<unknown>>(
    "/api/auth/reset-password/verify-code",
    fd
  );
}

export async function resetPasswordSetNew(payload: {
  reset_token: string;
  password: string;
  password_confirmation: string;
}) {
  const fd = new FormData();
  fd.append("reset_token", payload.reset_token);
  fd.append("password", payload.password);
  fd.append("password_confirmation", payload.password_confirmation);
  return apiFetchForm<ApiEnvelope<unknown>>(
    "/api/auth/reset-password/set-new-password",
    fd
  );
}

// ── Profile (Postman: POST multipart + _method=PUT) ────────────────────────

export async function updateProfile(payload: {
  name?: string;
  email?: string;
  phone?: string;
  image?: File | Blob;
}) {
  const fd = new FormData();
  if (payload.name !== undefined) fd.append("name", payload.name);
  if (payload.email !== undefined) fd.append("email", payload.email);
  if (payload.phone !== undefined) fd.append("phone", payload.phone);
  if (payload.image) fd.append("image", payload.image);
  fd.append("_method", "PUT");
  return apiFetchAuthForm<ApiEnvelope<{ user: ApiUser }>>("/api/profile", fd);
}

export async function updatePassword(body: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetchAuth<ApiEnvelope<unknown>>("/api/password", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// ── Categories & vendors ─────────────────────────────────────────────────

export async function getCategories(params?: CategoriesQueryParams) {
  return apiFetchOptionalAuth<ApiEnvelope<Category[]>>(
    `/api/categories${queryString(params)}`,
    { next: { revalidate: 120 } }
  );
}

export async function getCategoryById(id: string) {
  return apiFetchOptionalAuth<ApiEnvelope<Category>>(`/api/categories/${id}`, {
    next: { revalidate: 120 },
  });
}

export async function getVendors(params?: VendorsQueryParams) {
  return apiFetchOptionalAuth<ApiEnvelope<Vendor[]>>(
    `/api/vendors${queryString(params)}`,
    { next: { revalidate: 120 } }
  );
}

export async function getVendorById(id: string) {
  return apiFetchOptionalAuth<ApiEnvelope<Vendor>>(`/api/vendors/${id}`, {
    next: { revalidate: 60 },
  });
}

/** Postman: multipart rating + comment */
export async function rateVendor(
  id: string,
  rating: number,
  comment?: string
) {
  const fd = new FormData();
  fd.append("rating", String(rating));
  if (comment) fd.append("comment", comment);
  return apiFetchAuthForm<ApiEnvelope<unknown>>(
    `/api/vendors/${id}/rate`,
    fd
  );
}

export async function reportVendor(
  id: string,
  reason: string,
  description: string
) {
  const fd = new FormData();
  fd.append("reason", reason);
  fd.append("description", description);
  return apiFetchAuthForm<ApiEnvelope<unknown>>(
    `/api/vendors/${id}/report`,
    fd
  );
}

// ── Products ─────────────────────────────────────────────────────────────

export async function getProducts(params?: ProductsQueryParams) {
  return apiFetchOptionalAuth<ApiEnvelope<Product[]>>(
    `/api/products${queryString(params)}`,
    { cache: "no-store" }
  );
}

/** Same as getProducts but uncached — used for infinite scroll / load-more. */
export async function getProductsFresh(params?: ProductsQueryParams) {
  return apiFetchOptionalAuth<ApiEnvelope<Product[]>>(
    `/api/products${queryString(params)}`,
    { cache: "no-store" }
  );
}

export async function getProductById(id: string) {
  return apiFetchOptionalAuth<ApiEnvelope<Product>>(`/api/products/${id}`, {
    cache: "no-store",
  });
}

export async function toggleProductFavorite(id: string) {
  return apiFetchAuth<ApiEnvelope<unknown>>(
    `/api/products/${id}/toggle-favorite`,
    { method: "POST" }
  );
}

export async function rateProduct(
  id: string,
  rating: number,
  comment?: string
) {
  const fd = new FormData();
  fd.append("rating", String(rating));
  if (comment) fd.append("comment", comment);
  return apiFetchAuthForm<ApiEnvelope<unknown>>(
    `/api/products/${id}/rate`,
    fd
  );
}

export async function reportProduct(
  id: string,
  reason: string,
  description: string
) {
  const fd = new FormData();
  fd.append("reason", reason);
  fd.append("description", description);
  return apiFetchAuthForm<ApiEnvelope<unknown>>(
    `/api/products/${id}/report`,
    fd
  );
}

// ── Sliders ──────────────────────────────────────────────────────────────

export async function getSliders() {
  return apiFetchOptionalAuth<ApiEnvelope<Slider[]>>("/api/sliders", {
    next: { revalidate: 30 },
  });
}

// ── Addresses ────────────────────────────────────────────────────────────

export async function getAddresses() {
  return apiFetchAuth<ApiEnvelope<Address[]>>("/api/addresses");
}

export async function createAddress(data: {
  name: string;
  address: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  state?: string;
  city?: string;
  is_default?: string | boolean;
}) {
  return apiFetchAuthForm<ApiEnvelope<Address>>(
    "/api/addresses",
    toFormData(data)
  );
}

export async function deleteAddress(id: string) {
  return apiFetchAuth<ApiEnvelope<unknown>>(`/api/addresses/${id}`, {
    method: "DELETE",
  });
}

// ── Favorites ───────────────────────────────────────────────────────────

export async function getFavoriteList() {
  return apiFetchAuth<ApiEnvelope<Product[]>>("/api/favorite-list");
}

// ── Tickets (Postman: create/update-status/add-message = multipart) ─────

export async function getTickets() {
  return apiFetchAuth<ApiEnvelope<SupportTicket[]>>("/api/tickets");
}

export async function createTicket(input: {
  subject: string;
  description: string;
  attachments?: File[];
}) {
  const fd = new FormData();
  fd.append("subject", input.subject);
  fd.append("description", input.description);
  input.attachments?.forEach((file, i) => {
    fd.append(`attachments[${i}]`, file);
  });
  return apiFetchAuthForm<ApiEnvelope<SupportTicket>>("/api/tickets", fd);
}

/** Postman: PUT …/tickets/:id?subject=&description= */
export async function updateTicket(
  id: string,
  subject: string,
  description: string
) {
  const q = new URLSearchParams({ subject, description });
  return apiFetchAuth<ApiEnvelope<unknown>>(
    `/api/tickets/${id}?${q.toString()}`,
    { method: "PUT" }
  );
}

export async function getTicketById(id: string) {
  return apiFetchAuth<ApiEnvelope<SupportTicket>>(`/api/tickets/${id}`);
}

export async function deleteTicket(id: string) {
  return apiFetchAuth<ApiEnvelope<SupportTicket | unknown>>(`/api/tickets/${id}`, {
    method: "DELETE",
  });
}

export async function updateTicketStatus(id: string, status: string) {
  const fd = new FormData();
  fd.append("status", status);
  return apiFetchAuthForm<ApiEnvelope<unknown>>(
    `/api/tickets/${id}/update-status`,
    fd
  );
}

export async function addTicketMessage(id: string, message: string) {
  const fd = new FormData();
  fd.append("message", message);
  return apiFetchAuthForm<ApiEnvelope<unknown>>(
    `/api/tickets/${id}/add-message`,
    fd
  );
}

// ── Cart ─────────────────────────────────────────────────────────────────

export async function getCart() {
  return apiFetchAuth<ApiEnvelope<Cart>>("/api/cart");
}

/** POST …/cart/:productId — multipart `variant_id` (required by backend validation). */
export async function addToCart(productId: string, variantId: string) {
  const trimmed = String(variantId ?? "").trim();
  if (!trimmed) {
    throw new Error("The variant id field is required.");
  }
  const fd = new FormData();
  fd.append("variant_id", trimmed);
  return apiFetchAuthForm<ApiEnvelope<Cart>>(`/api/cart/${productId}`, fd);
}

export async function updateCartItem(
  productId: string,
  quantity: number,
  variantId?: string
) {
  const q = new URLSearchParams({ quantity: String(quantity) });
  if (variantId) q.set("variant_id", variantId);
  return apiFetchAuth<ApiEnvelope<Cart>>(
    `/api/cart/${productId}?${q.toString()}`,
    { method: "PUT" }
  );
}

export async function removeCartItem(productId: string, variantId?: string) {
  const q = variantId ? `?variant_id=${encodeURIComponent(variantId)}` : "";
  return apiFetchAuth<ApiEnvelope<Cart>>(`/api/cart/${productId}${q}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  return apiFetchAuth<ApiEnvelope<unknown>>("/api/cart", { method: "DELETE" });
}

function assertCartEnvelopeOk(envelope: ApiEnvelope<Cart>, fallback: string): void {
  if (envelope && typeof envelope === "object" && envelope.success === false) {
    const msg =
      (typeof envelope.message === "string" && envelope.message.trim()) ||
      firstValidationMessage(envelope.errors) ||
      fallback;
    throw new Error(msg);
  }
}

function isCouponRouteUnavailable(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /\bAPI Error:\s*(404|405)\b/i.test(msg);
}

/**
 * Postman: POST multipart `/api/cart/apply-coupon` with field `code`.
 * Optional: same path with `coupon_code`, or `/api/cart/apply_coupon` — only on HTTP 404/405.
 * Never call `/api/cart/coupon`: on many Laravel apps that matches `cart/{productId}` with id "coupon"
 * and returns ".Product not found".
 */
export async function applyCoupon(code: string) {
  const trimmed = String(code ?? "").trim();
  if (!trimmed) {
    throw new Error("أدخل كود الكوبون");
  }

  const multipartAttempts: { path: string; field: "code" | "coupon_code" }[] = [
    { path: "/api/cart/apply-coupon", field: "code" },
    { path: "/api/cart/apply-coupon", field: "coupon_code" },
    { path: "/api/cart/apply_coupon", field: "code" },
    { path: "/api/cart/apply_coupon", field: "coupon_code" },
  ];

  let lastUnavailable: Error | null = null;

  for (const { path, field } of multipartAttempts) {
    try {
      const fd = new FormData();
      fd.append(field, trimmed);
      const envelope = await apiFetchAuthForm<ApiEnvelope<Cart>>(path, fd);
      assertCartEnvelopeOk(envelope, "تعذر تطبيق الكوبون");
      return envelope;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      if (isCouponRouteUnavailable(e)) {
        lastUnavailable = err;
        continue;
      }
      throw err;
    }
  }

  for (const field of ["code", "coupon_code"] as const) {
    try {
      const envelope = await apiFetchAuth<ApiEnvelope<Cart>>("/api/cart/apply-coupon", {
        method: "POST",
        body: JSON.stringify(field === "code" ? { code: trimmed } : { coupon_code: trimmed }),
      });
      assertCartEnvelopeOk(envelope, "تعذر تطبيق الكوبون");
      return envelope;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      if (isCouponRouteUnavailable(e)) {
        lastUnavailable = err;
        continue;
      }
      throw err;
    }
  }

  throw lastUnavailable ?? new Error("تعذر تطبيق الكوبون");
}

// ── Orders ───────────────────────────────────────────────────────────────

export async function getOrders() {
  return apiFetchAuth<ApiEnvelope<Order[]>>("/api/orders");
}

export async function getOrderById(id: string) {
  return apiFetchAuth<ApiEnvelope<Order>>(`/api/orders/${id}`);
}

/** Postman: multipart payment_method */
export async function payOrder(id: string, payment_method: string) {
  const fd = new FormData();
  fd.append("payment_method", payment_method);
  return apiFetchAuthForm<ApiEnvelope<unknown>>(`/api/orders/${id}/pay`, fd);
}

export async function calculateShipping(addressId: number) {
  return apiFetchAuth<ApiEnvelope<unknown>>("/api/orders/calculate-shipping", {
    method: "POST",
    body: JSON.stringify({ address_id: addressId }),
  });
}

export async function createOrder(form: {
  address_id: string;
  coupon_code?: string;
  use_wallet?: string;
  use_points?: string;
  notes?: string;
}) {
  return apiFetchAuthForm<ApiEnvelope<Order>>("/api/orders", toFormData(form));
}

export async function reorder(id: string) {
  return apiFetchAuth<ApiEnvelope<unknown>>(`/api/orders/${id}/reorder`, {
    method: "POST",
  });
}

export async function cancelOrder(id: string) {
  return apiFetchAuth<ApiEnvelope<unknown>>(`/api/orders/${id}/cancel`, {
    method: "POST",
  });
}

/** Postman: POST multipart `reason` + `details` (nullable — always send both keys for Laravel). */
export async function requestRefund(
  id: string,
  payload?: { reason?: string; details?: string }
) {
  const fd = new FormData();
  fd.append("reason", payload?.reason ?? "");
  fd.append("details", payload?.details ?? "");

  const envelope = await apiFetchAuthForm<ApiEnvelope<unknown>>(
    `/api/orders/${id}/refund-request`,
    fd
  );
  if (envelope && typeof envelope === "object" && envelope.success === false) {
    const msg =
      (typeof envelope.message === "string" && envelope.message.trim()) ||
      firstValidationMessage(envelope.errors) ||
      "تعذر إنشاء طلب الاسترجاع";
    throw new Error(msg);
  }
  return envelope;
}

// ── Points & wallet ─────────────────────────────────────────────────────

export async function getPointsHistory() {
  return apiFetchAuth<ApiEnvelope<unknown>>("/api/points/history");
}

export async function getWalletHistory() {
  return apiFetchAuth<ApiEnvelope<unknown>>("/api/wallet/history");
}

function toFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    fd.append(k, String(v));
  });
  return fd;
}
