import Image from "next/image";

// Mercy Luxe ML submark / monogram, using the real brand artwork.
// - monogram-color.png (black ML + gold flourish) for light backgrounds
// - monogram-light.png (ivory ML + gold flourish) for dark backgrounds
// Both transparent, derived from the supplied monogram file.
const W = 234;
const H = 181;

export function Monogram({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Image
      src={onDark ? "/monogram-light.png" : "/monogram-color.png"}
      alt="Mercy Luxe ML monogram"
      width={W}
      height={H}
      className={className}
    />
  );
}
