import type { Metadata } from "next";
import { Manrope, Onest } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/api";
import { mediaUrl } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { JsonLd, organizationJsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — фонд поддержки культуры, искусства и архитектуры`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Некоммерческий фонд поддержки культуры, искусства и архитектуры Кавказа. Выставки, биеннале, гранты и сохранение наследия.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="ru" className={`${onest.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-bg text-ink">
        <JsonLd
          data={organizationJsonLd({
            name: siteSettings.org_legal_name,
            url: SITE_URL,
            logoUrl: mediaUrl(siteSettings.logo?.url),
            phone: siteSettings.phone,
            address: siteSettings.address,
            email: siteSettings.email,
            sameAs: [
              siteSettings.telegram_url,
              siteSettings.vk_url,
              siteSettings.max_messenger_url,
              siteSettings.rutube_url,
            ].filter(Boolean),
          })}
        />
        <Header siteSettings={siteSettings} />
        <main className="flex-1">{children}</main>
        <Footer siteSettings={siteSettings} />
      </body>
    </html>
  );
}
