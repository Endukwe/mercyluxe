import Image from "next/image";
import Link from "next/link";

// Primary Mercy Luxe lockup, using the real brand artwork.
// - logo-color.png (black wordmark + gold sprig) for light backgrounds
// - logo-light.png (ivory wordmark + gold sprig) for dark backgrounds
// Both are transparent, derived from the supplied logo file.
const RATIO = 705 / 188;

export function Logo({
  variant = "full",
  onDark = false,
  priority = false,
}: {
  variant?: "full" | "wordmark" | "compact";
  onDark?: boolean;
  priority?: boolean;
}) {
  const height = variant === "compact" ? 34 : 60;
  const width = Math.round(height * RATIO);
  const src = onDark ? "/logo-light.png" : "/logo-color.png";

  const image = (
    <Image
      src={src}
      alt="Mercy Luxe"
      width={width}
      height={height}
      priority={priority}
      className="h-auto w-auto"
      style={{ height, width: "auto" }}
    />
  );

  if (variant !== "full") {
    return (
      <Link href="/" aria-label="Mercy Luxe home" className="inline-flex items-center">
        {image}
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="Mercy Luxe home" className="inline-flex flex-col items-center">
      {image}
      <span className="label-luxe mt-4 text-[10px] text-gold sm:text-[11px]">
        Interiors&nbsp;&nbsp;|&nbsp;&nbsp;Hospitality&nbsp;&nbsp;|&nbsp;&nbsp;Lifestyle
      </span>
    </Link>
  );
}
