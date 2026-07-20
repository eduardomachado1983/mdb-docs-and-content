import Link from 'next/link'
import { SiteHeader } from '@/components/shared/site-header'
import { SiteLogo } from '@/components/shared/site-logo'
import { FaqAccordion } from '@/components/shared/faq-accordion'

const FEATURES = [
  { icon: '⚖️', title: '100% legal', desc: 'Tratamento regulamentado, conforme as normas da Anvisa.' },
  { icon: '🩺', title: 'Médicos prescritores', desc: 'Profissionais com CRM ativo, especializados em cannabis medicinal.' },
  { icon: '🔒', title: 'Dados protegidos', desc: 'Conformidade com a LGPD e acesso restrito.' },
  { icon: '🤝', title: 'Acompanhamento contínuo', desc: 'Equipe disponível para ajustar seu tratamento quando precisar.' },
]

const CONSULTAS = [
  { icon: '😴', title: 'Insônia', desc: 'Recupere noites de sono reparador com um tratamento individualizado.' },
  { icon: '🧠', title: 'Ansiedade', desc: 'Mais equilíbrio e qualidade de vida no seu dia a dia.' },
  { icon: '🤕', title: 'Dor crônica', desc: 'Alternativa terapêutica para dores persistentes e difíceis de controlar.' },
  { icon: '💆', title: 'Saúde mental', desc: 'Acolhimento e acompanhamento profissional contínuo.' },
  { icon: '🏃', title: 'Performance e bem-estar', desc: 'Recuperação física e qualidade de vida para quem treina.' },
  { icon: '⚡', title: 'Condições neurológicas', desc: 'Suporte a epilepsia e outras condições, com acompanhamento próximo.' },
]

const STEPS = [
  { t: 'Faça a triagem guiada', d: 'Cadastre-se e conte seus objetivos de saúde. A triagem prepara sua consulta para um atendimento mais focado.' },
  { t: 'Pague com Pix ou cartão', d: 'Pagamento seguro pelo Mercado Pago. O médico é acionado logo após a confirmação.' },
  { t: 'Consulte com um médico prescritor', d: 'Avaliação individual do seu caso e construção de um plano de tratamento personalizado.' },
  { t: 'Receba receita e laudo digitais', d: 'Após a validação, baixe seus documentos e inicie o tratamento com acompanhamento contínuo.' },
]

const TESTEMUNHOS = [
  { quote: 'Depois de anos de insônia, voltei a dormir bem. A triagem me preparou para a consulta e o médico entendeu exatamente o que eu precisava.', initials: 'CM', name: 'Carla Mendes', city: 'São Paulo, SP' },
  { quote: 'Tudo claro e dentro da lei. Recebi a receita e o laudo digitais já validados, sem sair de casa.', initials: 'RS', name: 'Rafael Souza', city: 'Curitiba, PR' },
  { quote: 'Trato minha ansiedade com acompanhamento de verdade. A equipe ajusta o tratamento sempre que preciso.', initials: 'JA', name: 'Juliana Alves', city: 'Recife, PE' },
]

export default function LandingPage() {
  return (
    <div>
      <SiteHeader />

      <section className="mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-12 px-6 pb-10 pt-16 md:grid-cols-[1.05fr_.95fr]">
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-100 px-3.5 py-1.5 text-[13px] font-bold text-teal-600">
            ● Cannabis medicinal, 100% dentro da lei
          </div>
          <h1 className="mb-[18px] text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">
            Cannabis medicinal com acompanhamento médico de verdade
          </h1>
          <p className="mb-7 max-w-[520px] text-lg leading-relaxed text-navy-500">
            Trate insônia, ansiedade, dor crônica e outras condições com médicos prescritores — triagem
            guiada, plano de tratamento personalizado e receita e laudo digitais, sempre conforme a Anvisa.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/registro"
              className="w-full rounded-[8px] bg-brand-500 px-6 py-3.5 text-center text-base font-bold text-primary-on shadow-[0_10px_22px_rgba(140,231,192,.5)] transition active:scale-[0.98] sm:w-auto"
            >
              Iniciar minha consulta →
            </Link>
            <a href="#como-funciona" className="w-full rounded-[8px] border border-line-400 bg-white/70 px-[22px] py-3.5 text-center text-base font-bold text-navy-700 backdrop-blur-md transition active:scale-[0.98] sm:w-auto">
              Como funciona
            </a>
          </div>
          <div className="mt-9 flex gap-6">
            {[['100%', 'Legal, conforme Anvisa'], ['CRM', 'Médicos prescritores'], ['LGPD', 'Dados protegidos']].map(([n, d]) => (
              <div key={n}>
                <div className="text-2xl font-extrabold text-navy-900">{n}</div>
                <div className="text-[13px] font-semibold text-navy-200">{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="animate-fade-up rounded-[22px] border border-white/30 bg-white/65 p-6 shadow-[0_8px_32px_rgba(1,82,73,.14),inset_0_1px_0_rgba(255,255,255,.45)] backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-surface-page pb-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-500 font-extrabold text-primary-on">
              Dr
            </div>
            <div>
              <div className="text-[15px] font-bold">Consulta por vídeo</div>
              <div className="text-[13px] text-navy-200">Médico prescritor • agora</div>
            </div>
            <div className="ml-auto rounded-2xl bg-teal-100 px-2.5 py-1.5 text-xs font-bold text-teal-600">Online</div>
          </div>
          <div className="flex flex-col gap-2.5 py-4">
            {['Triagem guiada dos seus objetivos', 'Plano de tratamento personalizado', 'Receita e laudo digitais'].map((t) => (
              <div key={t} className="flex items-center gap-2.5 text-sm text-navy-600">
                <span className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-[#def5e9]">✓</span>
                {t}
              </div>
            ))}
          </div>
          <Link
            href="/registro"
            className="block w-full rounded-[8px] bg-teal-500 py-3.5 text-center text-[15px] font-bold text-primary-on"
          >
            Começar agora
          </Link>
        </div>
      </section>

      <section id="quem-somos" className="border-y border-[#e9eff6] bg-white">
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-11 px-6 py-14 md:grid-cols-2">
          <div>
            <div className="mb-3 text-[13px] font-extrabold tracking-wide text-brand-700">QUEM SOMOS</div>
            <h2 className="mb-4 text-[26px] font-extrabold tracking-tight sm:text-[31px]">
              Medicina, tecnologia e cuidado humano
            </h2>
            <p className="mb-3.5 text-base leading-relaxed text-navy-500">
              A Sua Logo é uma clínica digital especializada em cannabis medicinal. Conectamos você a
              médicos prescritores registrados no CRM, que avaliam seu caso individualmente e constroem um
              plano de tratamento sob medida — sempre dentro da lei e das normas da Anvisa.
            </p>
            <p className="text-base leading-relaxed text-navy-500">
              Levamos a privacidade a sério: seus dados pessoais, documentos e informações de saúde são
              tratados conforme a LGPD e ficam visíveis apenas para os profissionais responsáveis pelo seu
              caso.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line-100 bg-surface-muted p-5">
                <div className="mb-2 text-2xl">{f.icon}</div>
                <div className="mb-1 text-[15px] font-bold">{f.title}</div>
                <div className="text-[13px] leading-relaxed text-navy-300">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="consultas" className="mx-auto grid max-w-[1140px] px-6 py-14">
        <div className="mb-9 text-center">
          <div className="mb-2.5 text-[13px] font-extrabold tracking-wide text-brand-700">O QUE TRATAMOS</div>
          <h2 className="text-[26px] font-extrabold tracking-tight sm:text-[31px]">Para o que a cannabis medicinal pode ajudar</h2>
        </div>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {CONSULTAS.map((c) => (
            <div key={c.title} className="rounded-2xl border border-line-100 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(20,50,90,.09)]">
              <div className="mb-3.5 flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#def5e9] text-[22px]">
                {c.icon}
              </div>
              <div className="mb-1.5 text-[17px] font-bold">{c.title}</div>
              <div className="text-sm leading-relaxed text-navy-300">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="bg-navy-900 text-white">
        <div className="mx-auto grid max-w-[1140px] px-6 py-14">
          <div className="mb-10 text-center">
            <div className="mb-2.5 text-[13px] font-extrabold tracking-wide text-[#5fb0ff]">COMO FUNCIONA</div>
            <h2 className="text-[26px] font-extrabold tracking-tight sm:text-[31px]">
              Do primeiro contato ao tratamento, em 4 passos
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-white/10 bg-white/[.06] p-6">
                <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#3d8bff] to-[#12c3ac] text-[17px] font-extrabold">
                  {i + 1}
                </div>
                <div className="mb-1.5 text-base font-bold">{s.t}</div>
                <div className="text-sm leading-relaxed text-[#b8cbe0]">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1140px] px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-7 rounded-[22px] bg-gradient-to-r from-brand-500 to-teal-500 p-8 shadow-[0_20px_44px_rgba(140,231,192,.45)] sm:p-11">
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-white sm:text-[28px]">Pronto para começar seu tratamento?</h2>
            <p className="text-base text-[#e3f0ff]">Leva poucos minutos. Triagem guiada e atendimento humanizado.</p>
          </div>
          <Link
            href="/registro"
            className="whitespace-nowrap rounded-[8px] bg-white px-7 py-[15px] text-base font-extrabold text-brand-600"
          >
            Iniciar consulta →
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1140px] px-6 pb-14 pt-5">
        <div className="mb-9 text-center">
          <div className="mb-2.5 text-[13px] font-extrabold tracking-wide text-brand-700">DEPOIMENTOS</div>
          <h2 className="text-[26px] font-extrabold sm:text-[31px]">Quem já começou o tratamento</h2>
        </div>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {TESTEMUNHOS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-line-100 bg-white p-[26px]">
              <div className="mb-[18px] text-[17px] italic leading-relaxed text-navy-700">&ldquo;{t.quote}&rdquo;</div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-navy-200">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-[#e9eff6] bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-14">
          <div className="mb-8 text-center">
            <div className="mb-2.5 text-[13px] font-extrabold tracking-wide text-brand-700">PERGUNTAS FREQUENTES</div>
            <h2 className="text-[26px] font-extrabold sm:text-[31px]">Ainda com dúvidas?</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <footer className="bg-[#0b2138] text-[#c6d6e8]">
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-8 px-6 pb-7 pt-12 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-3.5">
              <SiteLogo light />
            </div>
            <p className="max-w-[320px] text-sm leading-relaxed text-[#9db4cc]">
              Clínica digital especializada em cannabis medicinal, com médicos prescritores e validação
              de documentos. Este é um ambiente de demonstração.
            </p>
          </div>
          <div>
            <div className="mb-3 text-sm font-bold text-white">Contato</div>
            <div className="text-sm leading-[2] text-[#9db4cc]">
              contato@sualogo.com.br<br />0800 123 4567<br />Seg a Sex, 8h às 20h
            </div>
          </div>
          <div>
            <div className="mb-3 text-sm font-bold text-white">Institucional</div>
            <div className="text-sm leading-[2] text-[#9db4cc]">
              Termos de uso<br />Política de privacidade<br />LGPD
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-[18px] text-center text-[13px] text-[#7a92ac]">
          © 2026 Sua Logo Telemedicina — Ambiente de demonstração.
        </div>
      </footer>
    </div>
  )
}
