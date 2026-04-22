export const SITE_NAME = "خطوات صغيرة — العناية الآمنة بالأطفال";

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

/** Home strip — quick searches; align with API categories when ready */
export const CHILD_QUICK_CATEGORIES = [
  { key: "feeding", label: "التغذية والرضاعة", icon: "heart" as const },
  { key: "diapers", label: "الحفاضات والعناية", icon: "sparkles" as const },
  { key: "clothes", label: "ملابس أطفال", icon: "bag" as const },
  { key: "toys", label: "ألعاب وتنمية", icon: "star" as const },
  { key: "health", label: "صحة وسلامة", icon: "shield" as const },
  { key: "nursery", label: "غرفة ومستلزمات", icon: "package" as const },
] as const;
