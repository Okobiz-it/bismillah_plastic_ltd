import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";

import { IMAGES } from "@/constants/images";

export async function generateMetadata(): Promise<Metadata> {
  const { companyName, description } = siteConfig;

  return {
    title: `${companyName} — Recycled Plastic Manufacturer & Exporter | Bangladesh`,
    description: description,
    keywords: "recycled PET flakes, PET flakes manufacturer Bangladesh, recycled plastic exporter, PET chips supplier, plastic recycling company Bangladesh, recycled plastic raw materials, HDPE recycled material, PP recycled material",
    icons: {
      icon: IMAGES.FAVICON,
      shortcut: IMAGES.FAVICON,
      apple: IMAGES.FAVICON,
    },
    openGraph: {
      title: `${companyName} — Recycled Plastic Chips & Flakes Manufacturer`,
      description: description,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased selection:bg-brand/30 selection:text-white scroll-smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": siteConfig.companyName,
              "url": "https://mapleagglobal.com",
              "logo": IMAGES.MAPLE_LOGO,
              "description": siteConfig.description,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Baluadangga, Chauliapotti",
                "addressLocality": "Dinajpur",
                "addressCountry": "BD"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+8801842084883",
                "contactType": "sales",
                "email": "bismillahplastic76@gmail.com",
                "availableLanguage": "English"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
