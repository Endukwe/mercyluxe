// Curated Unsplash imagery, hand-picked to match the Mercy Luxe palette
// (warm ivory, taupe, brushed gold). Placeholders for real project photography.
// `ux` builds an optimized, cropped URL; images.unsplash.com is allowlisted in
// next.config.mjs. Swap these ids for real Mercy Luxe photos before launch.

export const ux = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

// Reusable, roughly grouped by mood. Ids are verified to load.
export const PHOTO = {
  // Warm residential interiors
  intWarmLiving: "photo-1648881806148-e5c51179c826",
  intLeatherOttoman: "photo-1704040686428-7534b262d0d8",
  intModernNeutral: "photo-1720247520881-672bc136da8a",
  intMoodyLounge: "photo-1758448755778-90ebf4d0f1e7",
  intSectionalArt: "photo-1758957701419-2c6e266f7988",
  intBrightWindows: "photo-1757924461488-ef9ad0670978",
  // Hospitality
  hosPatternBed: "photo-1685592437742-3b56edb46b15",
  hosWoodPanel: "photo-1590381105924-c72589b9ef3f",
  hosWhiteBed: "photo-1731336478850-6bce7235e320",
  hosCozyChair: "photo-1742338658963-b72587e3b86e",
  hosFireplace: "photo-1737807478491-6e258b44bd04",
  // Lifestyle / Soft Life Summer
  lifHat: "photo-1645026869770-f3d6f8f6bf3c",
  lifWhiteGold: "photo-1578747522731-9e5a179b02f7",
  lifBouquet: "photo-1645027002467-90e834ff5edc",
  lifSitting: "photo-1645026869755-2615d0b92e84",
  lifFlatlay: "photo-1691053318576-4bf08315e877",
  // Detail / texture
  detShadow: "photo-1788506663435-ab911706ad9d",
  detVases: "photo-1572853566597-b83cde546912",
  detLeatherSofa: "photo-1567016376408-0226e4d0c1ea",
  detKitchen: "photo-1729837149090-764b4272c2d7",
  detDoorway: "photo-1752407828488-1c6fafa47c50",
  detContainer: "photo-1617214922084-5db8d3c3df5a",
} as const;
