import type { Metadata } from "next";
import { DisciplinePage } from "../components/DisciplinePage";
import { ux, PHOTO } from "../lib/images";

export const metadata: Metadata = {
  title: "Hospitality",
  description:
    "Boutique hotel, short-term rental, and commercial hospitality design built for five-star guest experiences.",
};

export default function HospitalityPage() {
  return (
    <DisciplinePage
      content={{
        discipline: "Hospitality",
        kicker: "Hospitality & Commercial",
        title: "Spaces guests remember",
        intro:
          "Great hospitality design is felt before it is noticed. We craft guest-facing spaces that photograph beautifully, review five stars, and earn their keep.",
        heroSeed: "mercyluxe-hospitality-hero",
        heroImage:
          "https://images.unsplash.com/photo-1554009975-d74653b879f1?q=80&w=2000&auto=format&fit=crop",
        offerings: [
          {
            title: "Boutique hotels & venues",
            copy: "Distinctive, brand-forward interiors that give guests a reason to stay, share, and return.",
          },
          {
            title: "Short-term rental styling",
            copy: "Turnkey design and styling tuned for occupancy and reviews, from the entry photo to the coffee bar.",
          },
        ],
        offeringImages: [
          ux(PHOTO.hosPatternBed, 1200),
          ux(PHOTO.hosCozyChair, 1200),
        ],
        gallerySeeds: [
          "hospitality-gallery-a",
          "hospitality-gallery-b",
          "hospitality-gallery-c",
          "hospitality-gallery-d",
          "hospitality-gallery-e",
        ],
        galleryImages: [
          ux(PHOTO.hosWhiteBed, 1000),
          ux(PHOTO.hosFireplace, 1000),
          ux(PHOTO.hosWoodPanel, 1000),
          ux(PHOTO.detLeatherSofa, 1000),
          ux(PHOTO.intSectionalArt, 1000),
        ],
      }}
    />
  );
}
