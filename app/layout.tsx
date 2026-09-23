import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SiteFrame } from "./components/SiteFrame";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mercyluxe.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mercy Luxe | Interiors, Hospitality & Lifestyle",
    template: "%s | Mercy Luxe",
  },
  description:
    "Elevated spaces. Meaningful experiences. Mercy Luxe is a Columbus, Ohio design studio for luxury interiors, hospitality, and lifestyle.",
  keywords: [
    "luxury interiors",
    "interior design Columbus Ohio",
    "Columbus Ohio interior designer",
    "hospitality design",
    "short-term rental design",
    "Airbnb design Columbus",
    "Soft Life Summer",
    "Mercy Luxe",
  ],
  applicationName: "Mercy Luxe",
  authors: [{ name: "Mercy Luxe" }],
  creator: "Mercy Luxe",
  publisher: "Mercy Luxe",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Mercy Luxe | Interiors, Hospitality & Lifestyle",
    description: "Elevated spaces. Meaningful experiences. Designed for Life. Curated for Legacy.",
    url: siteUrl,
    siteName: "Mercy Luxe",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercy Luxe | Interiors, Hospitality & Lifestyle",
    description: "Elevated spaces. Meaningful experiences. Designed for Life. Curated for Legacy.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1512",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InteriorDesignBusiness",
  "@id": `${siteUrl}/#business`,
  name: "Mercy Luxe",
  description:
    "Columbus, Ohio design studio for luxury interiors, hospitality, and lifestyle. Designed for Life. Curated for Legacy.",
  url: siteUrl,
  email: "Consults@MercyLuxe.net",
  image: `${siteUrl}/opengraph-image`,
  logo: `${siteUrl}/logo-color.png`,
  slogan: "Designed for Life. Curated for Legacy.",
  priceRange: "$$$",
  areaServed: { "@type": "City", name: "Columbus", containedInPlace: { "@type": "State", name: "Ohio" } },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Columbus",
    addressRegion: "OH",
    addressCountry: "US",
  },
  knowsAbout: [
    "Luxury interior design",
    "Hospitality design",
    "Short-term rental strategy",
    "Lifestyle styling",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-[100dvh] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
