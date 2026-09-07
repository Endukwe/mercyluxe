import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

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

export const metadata: Metadata = {
  title: {
    default: "Mercy Luxe | Interiors, Hospitality & Lifestyle",
    template: "%s | Mercy Luxe",
  },
  description:
    "Elevated spaces. Meaningful experiences. Mercy Luxe is a Columbus, Ohio design studio for luxury interiors, hospitality, and lifestyle.",
  keywords: ["luxury interiors", "hospitality design", "Columbus Ohio interior designer", "Mercy Luxe"],
  openGraph: {
    title: "Mercy Luxe | Interiors, Hospitality & Lifestyle",
    description: "Elevated spaces. Meaningful experiences. Designed for Life. Curated for Legacy.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-[100dvh] antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
