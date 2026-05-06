/** Short brand for copyright, page title suffix, placeholders */
export const SITE_BRAND = "PETS ZONE";

export const SITE_NAME = "PETS ZONE — مستلزمات الحيوانات الأليفة";

export const ROUTES = {
  home: "/",
  search: "/search",
  categories: "/categories",
  shop: "/shop",
  vendors: "/vendors",
  vendor: (id: string | number) => `/vendors/${id}`,
  products: "/products",
  product: (id: string | number) => `/products/${id}`,
  cart: "/cart",
  checkout: "/checkout",
  profile: "/profile",
  login: "/login",
  resetPassword: "/reset-password",
  register: "/register",
  verifyEmail: "/verify-email",
  favorites: "/favorites",
  orders: "/orders",
  tickets: "/tickets",
  ticketNew: "/tickets/new",
  ticket: (id: string | number) => `/tickets/${id}`,
  points: "/points",
  wallet: "/wallet",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  privacy: "/privacy",
} as const;

/** Primary nav (desktop + mobile sheet) */
export const HEADER_NAV_LINKS = [
  { href: ROUTES.home, label: "الرئيسية" },
  { href: ROUTES.about, label: "من نحن" },
  { href: ROUTES.shop, label: "المتجر" },
  { href: ROUTES.categories, label: "الفئات" },
  { href: ROUTES.vendors, label: "المتاجر" },
  { href: ROUTES.orders, label: "طلباتي" },
  { href: ROUTES.tickets, label: "تذاكر الدعم" },
  { href: ROUTES.faq, label: "الأسئلة الشائعة" },
  { href: ROUTES.contact, label: "تواصل معنا" },
] as const;

export const PRODUCT_SORT = {
  latest: "latest",
  oldest: "oldest",
  priceAsc: "price_asc",
  priceDesc: "price_desc",
} as const;

/** Home strip — quick searches when API categories are empty */
export const PET_QUICK_CATEGORIES = [
  { key: "food", label: "أكل جاف ورطب", icon: "heart" as const },
  { key: "litter", label: "رمل ونظافة", icon: "sparkles" as const },
  { key: "accessories", label: "إكسسوارات وملابس", icon: "bag" as const },
  { key: "toys", label: "ألعاب وتسلية", icon: "star" as const },
  { key: "health", label: "صحة وعناية", icon: "shield" as const },
  { key: "beds", label: "أسِرّة ومستلزمات", icon: "package" as const },
] as const;
