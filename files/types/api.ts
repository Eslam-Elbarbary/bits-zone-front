/** Matches Postman collection: Multi-Vendor E-Commerce API response envelope */

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  image?: string | null;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  roles?: string[];
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponseData {
  user: ApiUser;
  token?: string;
  access_token?: string;
}

export interface Category {
  id: number;
  name: string;
  name_ar?: string;
  image?: string | null;
  parent_id?: number | null;
  children?: Category[];
  products_count?: number;
  [key: string]: unknown;
}

export interface Vendor {
  id: number;
  name: string;
  name_ar?: string | null;
  image?: string | null;
  rating?: number;
  is_verified?: boolean;
  description?: string | null;
  bio?: string | null;
  products_count?: number;
  [key: string]: unknown;
}

/** Normalized row for showing vendor branches / store addresses from `GET /api/vendors/:id`. */
export interface VendorLocationDisplay {
  id: string;
  title: string;
  lines: string[];
  phone?: string | null;
  mapsUrl?: string | null;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: number | string;
  name?: string | null;
  title?: string | null;
  sku?: string | null;
  price?: number | string | null;
  sale_price?: number | string | null;
  stock_status?: string | null;
  [key: string]: unknown;
}

export interface Product {
  id: number;
  name: string;
  name_ar?: string;
  sku?: string;
  price: number | string;
  compare_at_price?: number | string | null;
  sale_price?: number | string | null;
  discount_percent?: number | null;
  image?: string | null;
  images?: string[];
  thumbnail?: string | null;
  rating?: number;
  reviews_count?: number;
  is_favorite?: boolean;
  stock_status?: string;
  featured?: boolean;
  vendor?: Vendor;
  category?: Category;
  short_description?: string;
  description?: string;
  variants?: ProductVariant[];
  variant?: ProductVariant | null;
  default_variant_id?: number | string | null;
  variant_id?: number | string | null;
  [key: string]: unknown;
}

export interface Slider {
  id: number;
  title?: string;
  image: string;
  link?: string | null;
  [key: string]: unknown;
}

export interface Address {
  id: number;
  name: string;
  phone?: string | null;
  address: string;
  city?: string | null;
  state?: string | null;
  is_default?: boolean;
  latitude?: string | null;
  longitude?: string | null;
  [key: string]: unknown;
}

export interface Cart {
  items?: unknown[];
  subtotal?: number | string;
  total?: number | string;
  coupon?: string | null;
  [key: string]: unknown;
}

/** Postman: GET /api/points/history — shape varies by backend; keep index signature. */
export interface PointsHistoryEntry {
  id?: number | string;
  points?: number | string;
  amount?: number | string;
  point?: number | string;
  value?: number | string;
  type?: string;
  description?: string | null;
  note?: string | null;
  reason?: string | null;
  title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  order_id?: number | string | null;
  balance_after?: number | string | null;
  balance?: number | string | null;
  [key: string]: unknown;
}

/** Postman: GET /api/wallet/history — flexible wallet transaction rows. */
export interface WalletHistoryEntry {
  id?: number | string;
  amount?: number | string;
  value?: number | string;
  change?: number | string;
  credit?: number | string;
  debit?: number | string;
  type?: string;
  description?: string | null;
  note?: string | null;
  reason?: string | null;
  title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  order_id?: number | string | null;
  balance_after?: number | string | null;
  balance?: number | string | null;
  [key: string]: unknown;
}

/** Support ticket row — aligns with GET/POST /api/tickets (shape may vary). */
export interface TicketMessage {
  id?: number | string;
  message?: string;
  body?: string;
  content?: string;
  user_id?: number | string;
  user?: ApiUser;
  is_admin?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface SupportTicket {
  id: number | string;
  subject?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  created_at?: string | null;
  updated_at?: string | null;
  messages?: TicketMessage[];
  replies?: TicketMessage[];
  ticket_messages?: TicketMessage[];
  user?: ApiUser;
  user_id?: number | string;
  [key: string]: unknown;
}

export interface Order {
  id: number | string;
  user_id?: number | string;
  address_id?: number | string;
  coupon_id?: number | string | null;
  sub_total?: number | string;
  order_discount?: number | string;
  coupon_discount?: number | string;
  total_shipping?: number | string;
  points_discount?: number | string;
  wallet_used?: number | string;
  total?: number | string;
  total_commission?: number | string;
  status?: string;
  payment_status?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: ApiUser;
  items?: unknown[];
  [key: string]: unknown;
}

export type ProductsQueryParams = {
  search?: string;
  featured?: string;
  vendor_id?: string;
  category_id?: string;
  min_price?: string;
  max_price?: string;
  stock?: string;
  sort?: string;
  per_page?: string;
  page?: string;
};

/** Postman: Categories → index query params */
export type CategoriesQueryParams = {
  search?: string;
  featured?: string;
  parent_id?: string;
  status?: string;
  sort?: string;
  per_page?: string;
  page?: string;
};

/** Postman: Vendors → index query params */
export type VendorsQueryParams = {
  search?: string;
  featured?: string;
  sort?: string;
  per_page?: string;
  page?: string;
};
