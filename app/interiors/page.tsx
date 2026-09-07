import type { Metadata } from "next";
import { DisciplinePage } from "../components/DisciplinePage";
import { ux, PHOTO } from "../lib/images";

export const metadata: Metadata = {
  title: "Interiors",
  description:
    "Full-service luxury residential interior design in Columbus, Ohio. Concept to final styling by Mercy Luxe.",
};

export default function InteriorsPage() {
  return (
    <DisciplinePage
      content={{
        discipline: "Interiors",
        kicker: "Residential Interiors",
        title: "Homes designed to be lived in",
        intro:
          "We shape rooms around the people in them. Every plan, palette, and piece is chosen to make a home feel considered, warm, and unmistakably yours.",
        heroSeed: "mercyluxe-interiors-hero",
        heroImage:
          "https://images.unsplash.com/photo-1745301558339-44eb3217d5da?q=80&w=2000&auto=format&fit=crop",
        offerings: [
          {
            title: "Full-service design",
            copy: "From floor plans and finishes to the last styled surface, we manage the whole arc of the project so the result feels seamless and complete.",
          },
          {
            title: "Room-by-room",
            copy: "A single space that needs to sing. We bring the same rigor to one room as we do to a whole home.",
          },
          {
            title: "Custom & heritage sourcing",
            copy: "We mix bespoke fabrication with collected, characterful pieces so your rooms hold history as well as polish.",
          },
        ],
        offeringImages: [
          ux(PHOTO.intMoodyLounge, 1200),
          ux(PHOTO.detVases, 1200),
          ux(PHOTO.detDoorway, 1200),
        ],
        gallerySeeds: [
          "interior-gallery-a",
          "interior-gallery-b",
          "interior-gallery-c",
          "interior-gallery-d",
          "interior-gallery-e",
        ],
        galleryImages: [
          ux(PHOTO.intModernNeutral, 1000),
          ux(PHOTO.detContainer, 1000),
          ux(PHOTO.detKitchen, 1000),
          ux(PHOTO.intLeatherOttoman, 1000),
          ux(PHOTO.detShadow, 1000),
        ],
      }}
    />
  );
}
