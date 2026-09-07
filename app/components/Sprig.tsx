// Mercy Luxe botanical mark - the gold olive sprig from the brand kit's primary
// lockup, recreated as scalable SVG: an asymmetric spray sweeping up to the
// right with a smaller left branch and a trailing stem. Gold gradient or
// currentColor. Geometry is generated so it stays crisp at any size.

type Leaf = { d: string; transform: string };

function leaf(cx: number, cy: number, len: number, wid: number, ang: number): Leaf {
  const d = `M0 0 C ${wid} ${-len * 0.35}, ${wid * 0.7} ${-len * 0.82}, 0 ${-len} C ${-wid * 0.7} ${-len * 0.82}, ${-wid} ${-len * 0.35}, 0 0 Z`;
  return { d, transform: `translate(${cx} ${cy}) rotate(${ang})` };
}

// A branch: a quadratic stem plus leaves spaced along it.
function branch(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bow: [number, number],
  count: number,
  lean: number,
  leafLen: number
): { stem: string; leaves: Leaf[] } {
  const cxp = (x1 + x2) / 2 + bow[0];
  const cyp = (y1 + y2) / 2 + bow[1];
  const stem = `M${x1} ${y1} Q ${cxp} ${cyp} ${x2} ${y2}`;
  const leaves: Leaf[] = [];
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 0.4);
    const mt = 1 - t;
    const px = mt * mt * x1 + 2 * mt * t * cxp + t * t * x2;
    const py = mt * mt * y1 + 2 * mt * t * cyp + t * t * y2;
    const spread = i % 2 ? 22 : -16;
    const len = leafLen * (0.72 + 0.42 * Math.sin(t * Math.PI));
    leaves.push(leaf(px, py, len, 3.4, lean + spread));
  }
  leaves.push(leaf(x2, y2, leafLen * 0.9, 3.2, lean)); // tip leaf
  return { stem, leaves };
}

function buildSprig() {
  const cx = 104;
  const cy = 70;
  const right = branch(cx, cy, 192, 22, [14, -10], 5, 60, 26);
  const left = branch(cx, cy, 54, 40, [-10, -6], 3, -60, 20);
  const trailStem = `M${cx} ${cy} C 116 88 128 98 138 112`;
  const trailLeaf = leaf(138, 112, 17, 3.4, 150);

  return {
    stems: [right.stem, left.stem, trailStem],
    leaves: [...right.leaves, ...left.leaves, trailLeaf],
  };
}

const SPRIG = buildSprig();

export function Sprig({
  className = "",
  gold = true,
}: {
  className?: string;
  gold?: boolean;
}) {
  const paint = gold ? "url(#sprigGold)" : "currentColor";
  return (
    <svg
      viewBox="0 0 220 130"
      className={className}
      role="img"
      aria-label="Mercy Luxe olive sprig"
      fill="none"
    >
      <defs>
        <linearGradient id="sprigGold" x1="50" y1="20" x2="190" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8f6d40" />
          <stop offset="0.5" stopColor="#c9a96a" />
          <stop offset="1" stopColor="#8f6d40" />
        </linearGradient>
      </defs>
      {SPRIG.stems.map((d, i) => (
        <path key={`s${i}`} d={d} stroke={paint} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      ))}
      <g fill={paint}>
        {SPRIG.leaves.map((l, i) => (
          <path key={`l${i}`} d={l.d} transform={l.transform} />
        ))}
      </g>
    </svg>
  );
}
