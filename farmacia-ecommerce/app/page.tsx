import Link from 'next/link'
import { SiteHeader } from '@/components/shared/site-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ControlledClassTag } from '@/components/shared/order-status-pill'
import { formatBRL } from '@/lib/utils'
import { PRODUCTS } from '@/lib/mock-data'

const ABOUT_CARDS = [
  ['💊', 'Medicamentos Controlados', 'Receita A e B, psicotrópicos'],
  ['🔬', 'Análise Farmacêutica', 'Farmacêutico responsável'],
  ['🚚', 'Entrega Rastreada', 'Código de rastreio incluído'],
  ['🔒', 'LGPD Compliant', 'Dados protegidos'],
]

const STEPS = [
  ['1', '📋', 'Tenha sua receita', 'Receita médica e/ou laudo do especialista'],
  ['2', '👤', 'Cadastre-se', 'Crie sua conta com dados e endereço'],
  ['3', '💊', 'Escolha produtos', 'Selecione conforme a receita'],
  ['4', '📤', 'Envie documentos', 'Upload na plataforma'],
  ['5', '⚡', 'Pague via PIX', 'Confirmação instantânea'],
  ['6', '🚚', 'Receba em casa', 'Rastreamento em tempo real'],
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-gradient-to-br from-brand-500 to-brand-400 px-6 py-14 text-center text-white">
        <div className="mx-auto max-w-[640px]">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-wide">
            🏪 FARMÁCIA ESPECIALIZADA EM MEDICAMENTOS CONTROLADOS
          </div>
          <h1 className="mb-3.5 text-[clamp(28px,5vw,42px)] font-black leading-[1.15] tracking-tight">
            Seus medicamentos com segurança e cuidado total
          </h1>
          <p className="mx-auto mb-6 max-w-[460px] text-[15px] leading-7 opacity-85">
            Dispensação especializada de medicamentos controlados. Envie sua receita, escolha seus produtos e receba em casa com rastreamento completo.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Link href="/registro"><Button size="lg" className="bg-white text-brand-600 hover:bg-white/90">🛒 Comprar agora</Button></Link>
            <a href="#como-funciona">
              <Button size="lg" variant="outline" className="border-white/40 bg-white/15 text-white hover:bg-white/20">Como funciona →</Button>
            </a>
          </div>
        </div>
        <div className="mt-11 flex flex-wrap justify-center gap-8">
          {[['2.400+', 'Pacientes'], ['98%', 'Satisfação'], ['24h', 'Análise'], ['100%', 'ANVISA']].map(([n, l]) => (
            <div key={n} className="text-center">
              <div className="text-2xl font-black">{n}</div>
              <div className="text-[11px] opacity-70">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="mx-auto max-w-[1000px] px-6 py-14">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div>
            <div className="mb-3 inline-block rounded-full bg-brand-50 px-3.5 py-1 text-[11px] font-bold text-brand-600">SOBRE A FARMÁCIA</div>
            <h2 className="mb-3.5 text-[26px] font-black leading-tight tracking-tight text-navy-800">Especialistas em medicamentos de controle especial</h2>
            <p className="mb-3.5 text-[14px] leading-8 text-navy-300">
              Somos uma farmácia e associação especializada na dispensação de medicamentos sujeitos a controle especial, seguindo a Portaria 344/98 da ANVISA.
            </p>
            <p className="text-[14px] leading-8 text-navy-300">
              Nossa equipe de farmacêuticos analisa cada receita e laudo individualmente, garantindo segurança e conformidade regulatória.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ABOUT_CARDS.map(([ic, t, d]) => (
              <Card key={t} className="p-3.5">
                <div className="mb-2 text-2xl">{ic}</div>
                <div className="mb-0.5 text-[13px] font-bold text-navy-800">{t}</div>
                <div className="text-[11px] leading-6 text-navy-300">{d}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="produtos" className="bg-surface-page px-6 py-14">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-7 text-center">
            <div className="mb-2.5 inline-block rounded-full bg-brand-50 px-3.5 py-1 text-[11px] font-bold text-brand-600">PRODUTOS &amp; VALORES</div>
            <h2 className="mb-2 text-[26px] font-black tracking-tight text-navy-800">Nosso catálogo</h2>
            <p className="text-[14px] text-navy-300">Medicamentos dispensados com receita e/ou laudo médico.</p>
          </div>
          <div className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-line-200 bg-white">
                <div className="bg-gradient-to-br from-brand-50 to-brand-100 py-6 text-center text-4xl">💊</div>
                <div className="p-3.5">
                  <h3 className="mb-0.5 text-[13px] font-extrabold text-navy-800">{p.name}</h3>
                  <p className="mb-2.5 text-[11px] text-navy-300">{p.activeIngredient}</p>
                  <div className="mb-2.5 flex flex-wrap gap-1">
                    <ControlledClassTag controlledClass={p.controlledClass} />
                    {p.requiresPrescription && <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600">📝 Receita</span>}
                    {p.requiresReport && <span className="inline-flex items-center rounded-full bg-admin-50 px-2 py-1 text-[11px] font-bold text-admin-600">📄 Laudo</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-brand-600">{formatBRL(p.priceCents)}</span>
                    <Link href="/registro"><Button size="sm">Comprar</Button></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto max-w-[520px] rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-center text-[13px] text-brand-600">
            📋 Para comprar, é necessário receita médica e/ou laudo. <strong>Cadastre-se</strong> para iniciar.
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-[1000px] px-6 py-14">
        <div className="mb-9 text-center">
          <div className="mb-2.5 inline-block rounded-full bg-brand-50 px-3.5 py-1 text-[11px] font-bold text-brand-600">COMO FUNCIONA</div>
          <h2 className="text-[26px] font-black tracking-tight text-navy-800">Simples, seguro e rápido</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3.5">
          {STEPS.map(([n, ic, t, d]) => (
            <Card key={n} className="p-4">
              <div className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[12px] font-black text-white">{n}</div>
              <div className="mb-2 text-2xl">{ic}</div>
              <div className="mb-1 text-[13px] font-bold text-navy-800">{t}</div>
              <div className="text-[11px] leading-6 text-navy-300">{d}</div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/registro"><Button size="lg">🚀 Começar agora — é grátis</Button></Link>
        </div>
      </section>

      <footer className="bg-navy-900 px-6 py-8 text-center text-white/50">
        <div className="mb-2.5 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-sm">💊</div>
          <span className="text-[13px] font-extrabold text-white">PharmaCRM</span>
        </div>
        <p className="text-[12px] leading-6">
          Farmácia &amp; Associação especializada em medicamentos controlados.<br />ANVISA regularizada — CRF ativo.
        </p>
      </footer>
    </div>
  )
}
