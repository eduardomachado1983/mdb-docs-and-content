const LEAVES = [
  { top: '4%', left: '6%', size: 90, rotate: -18 },
  { top: '10%', left: '82%', size: 130, rotate: 22 },
  { top: '58%', left: '1%', size: 110, rotate: 8 },
  { top: '68%', left: '88%', size: 100, rotate: -24 },
  { top: '38%', left: '46%', size: 170, rotate: 4 },
  { top: '82%', left: '30%', size: 80, rotate: -12 },
  { top: '20%', left: '35%', size: 70, rotate: 16 },
]

export function LeafBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="absolute select-none text-teal-700 opacity-[0.09]"
          style={{ top: leaf.top, left: leaf.left, fontSize: leaf.size, transform: `rotate(${leaf.rotate}deg)` }}
        >
          🌿
        </span>
      ))}
    </div>
  )
}
