import Link from 'next/link'

// Folíolos da folha de cannabis do logo (leque de 7, apontando para cima).
const LEAFLETS = [
  { rot: 0, scale: 1 },
  { rot: 32, scale: 0.82 },
  { rot: -32, scale: 0.82 },
  { rot: 64, scale: 0.58 },
  { rot: -64, scale: 0.58 },
  { rot: 94, scale: 0.4 },
  { rot: -94, scale: 0.4 },
]

const LEAFLET = 'M0 0 C 8 -24 6 -58 0 -84 C -6 -58 -8 -24 0 0 Z'

function LeafIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-9 w-9" aria-hidden>
      <defs>
        <linearGradient id="biosativa-leaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2f9e6f" />
          <stop offset="1" stopColor="#57bc90" />
        </linearGradient>
      </defs>
      <g transform="translate(50 90)">
        {LEAFLETS.map((l, i) => (
          <path key={i} d={LEAFLET} fill="url(#biosativa-leaf)" transform={`rotate(${l.rot}) scale(${l.scale})`} />
        ))}
        <rect x="-1.4" y="-6" width="2.8" height="12" rx="1.4" fill="#2f9e6f" />
      </g>
    </svg>
  )
}

export function SiteLogo({ light, href = '/' }: { light?: boolean; href?: string; iconClassName?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <LeafIcon />
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight">
          <span className={light ? 'text-white' : 'text-brand-700'}>Bio</span>
          <span className="text-[#c9a24e]">Sativa</span>
        </div>
        <div className={`text-[9px] font-bold tracking-[0.14em] ${light ? 'text-white/70' : 'text-[#c9a24e]'}`}>
          MEDICINAL CANNABIS CLINIC
        </div>
      </div>
    </Link>
  )
}
