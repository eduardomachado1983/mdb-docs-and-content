// Folhas de cada "lótus" de cannabis (7 folíolos abrindo em leque a partir
// da base, com um par inferior curvando para fora, como no logo da marca).
const LEAFLETS = [
  { rot: 0, scale: 1 },
  { rot: 30, scale: 0.86 },
  { rot: -30, scale: 0.86 },
  { rot: 62, scale: 0.62 },
  { rot: -62, scale: 0.62 },
  { rot: 96, scale: 0.42 },
  { rot: -96, scale: 0.42 },
]

// Folíolo lanceolado apontando para cima, com a base na origem.
const LEAFLET = 'M0 0 C 11 -30 8 -76 0 -108 C -8 -76 -11 -30 0 0 Z'
// Gota central (tip para cima, bulbo arredondado embaixo).
const DROP = 'M0 -54 C 16 -26 20 -2 0 10 C -20 -2 -16 -26 0 -54 Z'

function Lotus({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      {LEAFLETS.map((l, i) => (
        <path key={i} d={LEAFLET} fill="#cfe8e4" transform={`rotate(${l.rot}) scale(${l.scale})`} />
      ))}
      <path d={DROP} fill="#efe9dc" />
    </g>
  )
}

export function LeafBackground() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g opacity="0.7">
        <Lotus transform="translate(640 700) scale(2.5)" />
        <Lotus transform="translate(70 640) scale(2.1)" />
        <Lotus transform="translate(1210 640) scale(2.1)" />
      </g>
    </svg>
  )
}
