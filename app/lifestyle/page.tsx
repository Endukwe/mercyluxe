import type { Metadata } from "next";
import { DisciplinePage } from "../components/DisciplinePage";
import { ux, PHOTO } from "../lib/images";

export const metadata: Metadata = {
  title: "Lifestyle & Soft Life Summer",
  description:
    "Editorial lifestyle styling and the Soft Life Summer ready-to-wear collection from Mercy Luxe.",
  alternates: { canonical: "/lifestyle" },
  openGraph: {
    title: "Lifestyle & Soft Life Summer | Mercy Luxe",
    description:
      "Editorial lifestyle styling and the Soft Life Summer ready-to-wear collection from Mercy Luxe.",
    url: "/lifestyle",
    type: "website",
  },
};

export default function LifestylePage() {
  return (
    <DisciplinePage
      content={{
        discipline: "Lifestyle",
        kicker: "Lifestyle & Soft Life Summer",
        title: "Thoughtfully curated for the way you live",
        intro:
          "Mercy Luxe Lifestyle extends the brand beyond the home and into everyday living — curated products, experiences and services that embody effortless elegance, comfort and intentional living. Luxury that is beautiful, comfortable and made for real life.",
        heroSeed: "mercyluxe-lifestyle-hero",
        heroImage:
          "https://images.unsplash.com/photo-1607784750393-5edbcd13fc36?q=80&w=2000&auto=format&fit=crop",
        offerings: [
          {
            title: "Fashion & ready-to-wear",
            copy: "The Mercy Luxe collections, including Soft Life Summer — built on the same instincts as our interiors: texture, ease, and quiet confidence.",
          },
          {
            title: "Curated lifestyle products",
            copy: "Home and lifestyle accessories and seasonal collections, chosen with the Mercy Luxe eye for effortless, intentional living.",
          },
          {
            title: "Events & experiences",
            copy: "Special events, pop-ups and curated brand experiences styled so every moment feels like a Mercy Luxe room.",
          },
        ],
        offeringImages: [
          ux(PHOTO.lifWhiteGold, 1200),
          ux(PHOTO.lifFlatlay, 1200),
          ux(PHOTO.lifHat, 1200),
        ],
        serviceList: [
          "Mercy Luxe fashion & ready-to-wear collections",
          "Curated lifestyle products",
          "Home and lifestyle accessories",
          "Special events and curated experiences",
          "Seasonal collections",
          "Pop-ups and brand experiences",
          "Future lifestyle collaborations and collections",
        ],
        gallerySeeds: [
          "lifestyle-gallery-a",
          "lifestyle-gallery-b",
          "lifestyle-gallery-c",
          "lifestyle-gallery-d",
          "lifestyle-gallery-e",
        ],
        galleryImages: [
          ux(PHOTO.lifSitting, 1000),
          ux(PHOTO.lifBouquet, 1000),
          ux(PHOTO.lifHat, 1000),
          ux(PHOTO.detShadow, 1000),
          ux(PHOTO.detContainer, 1000),
        ],
      }}
    />
  );
}
