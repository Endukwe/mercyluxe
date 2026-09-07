import type { Metadata } from "next";
import { DisciplinePage } from "../components/DisciplinePage";
import { ux, PHOTO } from "../lib/images";

export const metadata: Metadata = {
  title: "Lifestyle & Soft Life Summer",
  description:
    "Editorial lifestyle styling and the Soft Life Summer ready-to-wear collection from Mercy Luxe.",
};

export default function LifestylePage() {
  return (
    <DisciplinePage
      content={{
        discipline: "Lifestyle",
        kicker: "Lifestyle & Soft Life Summer",
        title: "The soft life, styled",
        intro:
          "The Mercy Luxe eye, beyond the walls. Editorial styling for the moments you gather for, and a seasonal capsule for the way you actually live.",
        heroSeed: "mercyluxe-lifestyle-hero",
        heroImage:
          "https://images.unsplash.com/photo-1607784750393-5edbcd13fc36?q=80&w=2000&auto=format&fit=crop",
        offerings: [
          {
            title: "Soft Life Summer capsule",
            copy: "A ready-to-wear collection built on the same instincts as our interiors: texture, ease, and quiet confidence.",
          },
          {
            title: "Event & editorial styling",
            copy: "Tablescapes, gatherings, and brand shoots styled with intention, so every frame feels like a Mercy Luxe room.",
          },
        ],
        offeringImages: [
          ux(PHOTO.lifWhiteGold, 1200),
          ux(PHOTO.lifFlatlay, 1200),
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
