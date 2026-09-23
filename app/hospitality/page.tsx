import type { Metadata } from "next";
import { DisciplinePage } from "../components/DisciplinePage";
import { ux, PHOTO } from "../lib/images";

export const metadata: Metadata = {
  title: "Hospitality",
  description:
    "Boutique hotel, short-term rental, and commercial hospitality design built for five-star guest experiences.",
  alternates: { canonical: "/hospitality" },
  openGraph: {
    title: "Hospitality | Mercy Luxe",
    description:
      "Boutique hotel, short-term rental, and commercial hospitality design built for five-star guest experiences.",
    url: "/hospitality",
    type: "website",
  },
};

export default function HospitalityPage() {
  return (
    <DisciplinePage
      content={{
        discipline: "Hospitality",
        kicker: "Hospitality",
        title: "Turn your space into an income-producing property",
        intro:
          "Mercy Luxe Hospitality provides consulting, setup and optimization for short-, mid- and long-term rentals. We help clients move from an idea or available property to a thoughtfully positioned rental business — combining strategy, design and hospitality to create rentals that are attractive, functional and positioned to perform.",
        heroSeed: "mercyluxe-hospitality-hero",
        heroImage:
          "https://images.unsplash.com/photo-1554009975-d74653b879f1?q=80&w=2000&auto=format&fit=crop",
        offerings: [
          {
            title: "Rental consulting & strategy",
            copy: "Short-, mid- and long-term rental strategy, market assessment, and the business and banking setup guidance to get you positioned to perform.",
          },
          {
            title: "Listing creation & optimization",
            copy: "Airbnb, Vrbo and Furnished Finder account setup, listing creation, and pricing and positioning strategy that wins bookings.",
          },
          {
            title: "Property setup & rental readiness",
            copy: "Furniture and décor sourcing, space spruce-up, guest-experience planning, and the hosting systems that keep it running.",
          },
        ],
        offeringImages: [
          ux(PHOTO.hosPatternBed, 1200),
          ux(PHOTO.hosCozyChair, 1200),
          ux(PHOTO.hosFireplace, 1200),
        ],
        serviceList: [
          "Short-term rental consulting",
          "Mid-term & long-term rental strategy",
          "Property and market assessment",
          "Business registration & business setup guidance",
          "Business banking / account setup guidance",
          "Airbnb, Vrbo, Furnished Finder & other platform account setup",
          "Listing creation & optimization",
          "Pricing and positioning strategy",
          "Guest-experience planning",
          "Property setup and rental readiness",
          "Furniture & décor sourcing",
          "Rental space spruce-up",
          "Hosting systems and operational guidance",
          "Ongoing consulting and support",
        ],
        serviceListNote:
          "Additional design, sourcing, setup and implementation services are quoted separately based on project scope.",
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
