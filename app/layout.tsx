import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SITE_BRAND, SITE_NAME } from "@/constants";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_BRAND}`,
  },
  description:
    "متجر مستلزمات الحيوانات الأليفة — أكل جاف ورطب، رمل، ألعاب، علاج، وتوصيل داخل القاهرة الجديدة والمحافظات.",
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
    description: "كل ما يحتاجه حيوانك الأليف في مكان واحد — جودة موثوقة وتوصيل سريع.",
    type: "website",
    locale: "ar_SA",
  },
  icons: {
    icon: "/logo-pets-zone.svg",
    shortcut: "/logo-pets-zone.svg",
    apple: "/logo-pets-zone.svg",
  },
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
