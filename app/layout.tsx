import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SITE_NAME } from "@/constants";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | خطوات صغيرة`,
  },
  description:
    "متجر متخصص في العناية بالأطفال — تغذية، حفاضات، ملابس، ألعاب تعليمية وتوصيل موثوق.",
  keywords: ["عناية بالأطفال", "مستلزمات أطفال", "تغذية الأطفال", "حفاضات", "ملابس أطفال", "ألعاب أطفال"],
  openGraph: {
    title: SITE_NAME,
    description: "عناية آمنة ومستلزمات موثوقة لطفلك في مكان واحد.",
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
