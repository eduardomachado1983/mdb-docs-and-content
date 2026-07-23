import Link from 'next/link'

// Broto de duas folhas — versão simplificada do símbolo da BioSativa.
function LeafIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-9 w-9" aria-hidden>
      <defs>
        <linearGradient id="biosativa-leaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2f9e6f" />
          <stop offset="1" stopColor="#7fd6ab" />
        </linearGradient>
      </defs>
      <g transform="translate(50 88)">
        <rect x="-1.6" y="-40" width="3.2" height="40" rx="1.6" fill="#2f9e6f" />
        <path
          d="M0 -22 C 20 -26 34 -14 38 4 C 16 6 0 -4 0 -22 Z"
          fill="url(#biosativa-leaf)"
        />
        <path
          d="M0 -34 C -20 -38 -34 -26 -38 -8 C -16 -6 0 -16 0 -34 Z"
          fill="url(#biosativa-leaf)"
        />
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
