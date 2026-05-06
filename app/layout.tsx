import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SITE_BRAND, SITE_NAME } from "@/constants";

const SITE_URL = "https://petszone-eg.com";
const LOGO_URL = `${SITE_URL}/logo-pets-zone.png`;

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "PETS ZONE",
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_BRAND}`,
  },
  description:
    "PETS ZONE متجر إلكتروني متخصص في مستلزمات الحيوانات الأليفة: أطعمة أصلية، رمل ونظافة، ألعاب وإكسسوارات، ومنتجات عناية مع شحن سريع داخل مصر.",
  keywords: [
    "مستلزمات حيوانات أليفة",
    "أكل كلاب وقطط",
    "رمل قطط",
    "PET SHOP مصر",
    "PETS ZONE",
    "توصيل مستلزمات حيوانات",
  ],
  openGraph: {
    title: SITE_NAME,
    description:
      "كل ما يحتاجه حيوانك الأليف في مكان واحد: منتجات موثوقة، أسعار مناسبة، وتجربة شراء سهلة مع شحن سريع.",
    type: "website",
    locale: "ar_SA",
    siteName: "PETS ZONE",
    url: SITE_URL,
    images: [
      {
        url: "/logo-pets-zone.png",
        width: 512,
        height: 512,
        alt: "PETS ZONE Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      "متجر PETS ZONE لمستلزمات الحيوانات الأليفة في مصر: طعام، عناية، ألعاب وإكسسوارات مع شحن سريع.",
    images: ["/logo-pets-zone.png"],
  },
  icons: {
    icon: "/logo-pets-zone.png?v=6",
    shortcut: "/logo-pets-zone.png?v=6",
    apple: "/logo-pets-zone.png?v=6",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={alexandria.variable} suppressHydrationWarning>
      <body
        className="min-h-svh bg-gradient-to-b from-primary/[0.05] via-background to-muted/35 font-sans"
        suppressHydrationWarning
      >
        <Providers>
          <script
            type="application/ld+json"
            // Helps Google pick the right brand/logo in search results.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "PETS ZONE",
                url: SITE_URL,
                logo: LOGO_URL,
              }),
            }}
          />
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 text-pretty">{children}</main>
            <SiteFooter />
          </div>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
