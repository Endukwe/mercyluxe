import type { Metadata } from "next";
import { DisciplinePage } from "../components/DisciplinePage";
import { ux, PHOTO } from "../lib/images";

export const metadata: Metadata = {
  title: "Interiors",
  description:
    "Full-service luxury residential interior design in Columbus, Ohio. Concept to final styling by Mercy Luxe.",
  alternates: { canonical: "/interiors" },
  openGraph: {
    title: "Interiors | Mercy Luxe",
    description:
      "Full-service luxury residential interior design in Columbus, Ohio. Concept to final styling by Mercy Luxe.",
    url: "/interiors",
    type: "website",
  },
};

export default function InteriorsPage() {
  return (
    <DisciplinePage
      content={{
        discipline: "Interiors",
        kicker: "Interiors",
        title: "Beautiful spaces. Intentionally designed.",
        intro:
          "Mercy Luxe Interiors provides styling and design for residential and investment properties, creating elevated, functional spaces that reflect each client's lifestyle, needs, and budget. Projects range from refreshing a single room to furnishing and styling an entire property.",
        heroSeed: "mercyluxe-interiors-hero",
        heroImage:
          "https://images.unsplash.com/photo-1745301558339-44eb3217d5da?q=80&w=2000&auto=format&fit=crop",
        offerings: [
          {
            title: "Full-home styling",
            copy: "From layout and finishes to the last styled surface, we furnish and style an entire property so the result feels considered and complete.",
          },
          {
            title: "Space refresh",
            copy: "A single room that needs to sing. A focused spruce-up brings the same rigor to one space as we do to a whole home.",
          },
          {
            title: "Airbnb & short-term rental design",
            copy: "Guest-ready furnishing and styling built to photograph beautifully and welcome every stay.",
          },
        ],
        serviceList: [
          "Interior design & room styling",
          "Full-home styling",
          "Space refresh / spruce-up",
          "Furniture, décor & accessory sourcing",
          "Mood boards & design concepts",
          "Color, paint & finish selections",
          "Furniture layout & space planning",
          "Shopping assistance",
          "Installation-day styling",
          "Airbnb & short-term rental interior design",
          "Guest-ready furnishing and styling",
        ],
        serviceListNote:
          "Additional design, sourcing, setup and implementation services are quoted separately based on project scope.",
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
