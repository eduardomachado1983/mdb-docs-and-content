'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, X, ArrowRight, ArrowLeft, ArrowUp, Search, Shield, Lock, Heart, Stethoscope, FileText, Package, ChevronDown, Star, MessageCircleHeart, ShieldCheck } from 'lucide-react'

const CONDITIONS = ['Insônia', 'Ansiedade', 'Dor crônica', 'Depressão', 'Enxaqueca', 'Fibromialgia', 'Epilepsia', 'TDAH', 'Autismo', 'Parkinson', 'Estresse', 'Obesidade']

const TESTIMONIAL_DATA = {
  Google: [
    { initials: 'NA', name: 'Natalia Almeida', date: '17/05/2025', text: 'Faço tratamento há mais de um ano, mas só na Vitalis vi o verdadeiro diferencial no cuidado com o paciente.' },
    { initials: 'LP', name: 'Luciana Pereira', date: '17/05/2025', text: 'Desde o primeiro momento, muito bem atendida! Melhorou meu sono e minha ansiedade em 30 dias.' },
    { initials: 'BD', name: 'Beatriz Dobruski', date: '17/03/2025', text: 'O suporte da equipe foi excepcional, sempre solícitos e buscando feedback. Recomendo demais!' },
    { initials: 'VO', name: 'Vera Oliveira', date: '11/05/2025', text: 'Um mês de tratamento e já sinto resultado na ansiedade e no sono. Vou seguir com o acompanhamento.' },
    { initials: 'LM', name: 'Luadi Morais', date: '17/02/2025', text: 'Fiquei 5 dias sem dores pela primeira vez. Atenção antes, durante e principalmente no pós. Gratidão!' },
    { initials: 'FN', name: 'Fabricio Nas', date: '17/05/2025', text: 'Experiência excelente, super indico para quem quer se cuidar e entender os benefícios do tratamento.' },
  ],
  'Reclame Aqui': [
    { initials: 'AV', name: 'Anna Velcic', date: '11/05/2025', text: 'Experiência maravilhosa do começo ao fim, sempre prontos para atender rapidamente.' },
    { initials: 'TJ', name: 'Thiago Jatobá', date: '11/05/2025', text: 'Atendimento rápido e preço acessível. Primeira semana e já sinto menos ansiedade e melhor sono.' },
    { initials: 'RC', name: 'Rafael Costa', date: '09/05/2025', text: 'Resolveram minha dúvida de importação em minutos. Suporte nota 10.' },
  ],
}

const GALLERY = [
  { id: 'gal-1', title: 'Vitalis Runner', meta: 'Evento • 2024', image: '/images/Vitalis Runner.webp' },
  { id: 'gal-2', title: 'Praia limpa', meta: 'Ação • 2024', image: '/images/Praia limpa.webp' },
  { id: 'gal-3', title: 'Maratona', meta: 'Patrocínio • 2024', image: '/images/Maratona.webp' },
  { id: 'gal-4', title: 'Meetup Saúde', meta: 'Comunidade • 2025', image: '/images/Meetup Saúde.webp' },
]

const FAQS = [
  { q: 'Como funciona a consulta online?', a: 'Após a triagem guiada, você é conectado a um médico de plantão por vídeo. Todo o processo é 100% online, do agendamento ao recebimento dos documentos.', open: true },
  { q: 'Quais condições podem ser tratadas?', a: 'Insônia, ansiedade, dor crônica, depressão, enxaqueca, epilepsia, entre outras — sempre mediante avaliação médica individual.', open: false },
  { q: 'Preciso pagar antes de me cadastrar?', a: 'Não. Primeiro você se cadastra e faz a triagem. O pagamento é feito de forma segura para acionar a consulta com o médico.', open: false },
  { q: 'Meus dados estão seguros?', a: 'Sim. Seus dados pessoais, documentos e informações de saúde são tratados conforme a LGPD e ficam visíveis apenas para os profissionais responsáveis pelo seu caso.', open: false },
  { q: 'Como recebo minha receita?', a: 'Após a validação do médico, seus documentos ficam disponíveis para download em formato digital, prontos para iniciar o tratamento.', open: false },
]

export default function VitalisLanding() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(0)
  const [showTop, setShowTop] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const paraRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  const tabNames = Object.keys(TESTIMONIAL_DATA)
  const currentTestimonials = TESTIMONIAL_DATA[tabNames[activeTab] as keyof typeof TESTIMONIAL_DATA]
  const perPage = 3
  const pages = Math.ceil(currentTestimonials.length / perPage)
  const validPage = Math.min(page, pages - 1)
  const visibleTestimonials = currentTestimonials.slice(validPage * perPage, validPage * perPage + perPage)

  const selectedCount = Object.keys(selected).length
  const selectedLabel = selectedCount === 0 ? 'Selecione ao menos uma condição para começar.' : `${selectedCount}${selectedCount === 1 ? ' condição selecionada' : ' condições selecionadas'}`

  const paraText = 'Unimos telemedicina, tecnologia e atendimento humanizado para tornar o cuidado com a saúde acessível e seguro para todos.'
  const words = paraText.split(' ')

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) document.body.style.overflow = ''
    else document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })

    document.querySelectorAll('[data-reveal]').forEach(n => io.observe(n))

    if (paraRef.current) {
      const pio = new IntersectionObserver((es) => {
        es.forEach(e => {
          if (e.isIntersecting) {
            setRevealed(true)
            pio.disconnect()
          }
        })
      }, { threshold: 0.4 })
      pio.observe(paraRef.current)
    }

    return () => {
      io.disconnect()
    }
  }, [])

  const toggleCondition = (name: string) => {
    setSelected(s => {
      const ns = { ...s }
      if (ns[name]) delete ns[name]
      else ns[name] = true
      return ns
    })
  }

  const scrollGallery = (dir: number) => {
    if (photoRef.current) {
      photoRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="sticky top-0 z-150 border-b border-gray-100 bg-white">
        <div className="container mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="BioSativa" width={120} height={40} className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <a href="/login" className="flex items-center gap-1.5 text-sm font-medium text-[#1c5344]">
              Entrar <ChevronRight className="h-4 w-4" />
            </a>
            <Link href="/registro" className="rounded-[12px] bg-[#90E2C4] px-6 py-2.5 text-sm font-medium text-[#123a30]">
              Iniciar consulta
            </Link>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      <div className={`fixed inset-0 z-200 bg-[#1c5344] text-white transition-transform duration-1000 overflow-y-auto ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="container mx-auto max-w-[1200px] px-5">
          <div className="flex items-center justify-between py-6">
            <Image src="/logo.svg" alt="BioSativa" width={120} height={40} className="h-8 w-auto invert" />
            <button onClick={() => setMenuOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-transparent">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
            <div className="grid grid-cols-2 gap-8 gap-x-10">
              <a href="#" onClick={() => setMenuOpen(false)} className="text-2xl font-light text-white hover:opacity-80">Início</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="text-2xl font-light text-white hover:opacity-80">Sobre nós</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="text-2xl font-light text-white hover:opacity-80">Como funciona</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="text-2xl font-light text-white hover:opacity-80">Patologias</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="text-2xl font-light text-white hover:opacity-80">Depoimentos</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="text-2xl font-light text-white hover:opacity-80">Central de ajuda</a>
            </div>
            <div className="rounded-3xl bg-[#123a30] p-8">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">Comece agora</div>
              <h3 className="mb-3 font-light text-xl text-white">Sua primeira consulta em minutos</h3>
              <p className="mb-6 text-sm text-white/75">Triagem guiada, médicos disponíveis e prontuário digital seguro.</p>
              <Link href="/registro" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[#1c5344]">
                Agendar consulta <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section id="top" className="container mx-auto max-w-[1200px] px-5 py-6">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#90E2C4] via-[#90E2C4] to-[#00894A]">
          <div className="grid grid-cols-1 gap-10 px-10 py-11 md:grid-cols-2 md:gap-10 md:px-10 md:py-11">
            <div className="flex flex-col justify-end pb-13">
              <h1 className="mb-5 w-full max-w-xs text-3xl font-semibold leading-tight text-white drop-shadow-md md:text-5xl">Cuidar da sua saúde nunca foi tão simples</h1>
              <p className="mb-8 max-w-sm text-base font-semibold text-white/92">Consultas com médicos de plantão, triagem guiada e prontuário digital — do conforto da sua casa, quando você precisar.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/registro" className="inline-flex items-center gap-2 rounded-[12px] bg-[#90E2C4] px-6 py-3 text-sm font-medium text-[#123a30]">
                  Agendar consulta <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#processos" className="inline-flex items-center rounded-[12px] bg-white/90 px-6 py-3 text-sm font-medium text-[#1a1a1a]">
                  Como funciona
                </a>
              </div>
            </div>
            <div className="relative min-h-80">
              <Image
                src="/images/hero.webp"
                alt="Paciente usando a plataforma"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute left-0 top-6 flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f7f0] text-[#1c5344]">📸</span>
                <div className="text-sm font-semibold text-[#1a1a1a]">+640 mil<br /><span className="text-xs text-gray-500">seguidores</span></div>
              </div>
              <div className="absolute bottom-9 right-0 flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f7f0] text-[#1c5344]"><MessageCircleHeart className="h-5 w-5" /></span>
                <div className="text-sm font-semibold text-[#1a1a1a]">+2.300<br /><span className="text-xs text-gray-500">depoimentos</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patologias */}
      <section id="patologias" className="container mx-auto max-w-[1200px] px-5 py-[72px]">
        <div data-reveal className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_.9fr]">
          <h2 className="text-3xl font-semibold leading-tight text-[#1a1a1a] md:text-4xl">Para qual condição você busca cuidado?</h2>
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#90E2C4]/42 px-3.5 py-1.5 text-xs font-semibold text-[#155041]">Patologias</div>
            <p className="text-sm leading-relaxed text-gray-600">Selecione as condições que deseja tratar e inicie sua triagem guiada com nossos especialistas ainda hoje.</p>
          </div>
        </div>
        <div className="mb-7 flex flex-wrap gap-3">
          {CONDITIONS.map(name => {
            const on = selected[name]
            return (
              <button key={name} onClick={() => toggleCondition(name)} className={`rounded-full border-1.5 px-5 py-2.5 text-sm font-medium transition-all ${on ? 'border-[#1c5344] bg-[#1c5344] text-white' : 'border-gray-200 bg-white text-[#1a1a1a]'}`}>
                {name}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/registro" className="inline-flex items-center gap-2 rounded-[12px] bg-[#90E2C4] px-6 py-3 text-sm font-medium text-[#123a30]">
            Iniciar minha triagem <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-sm text-gray-600">{selectedLabel}</span>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="border-y border-gray-200 bg-[#E4FFF5]">
        <div className="container mx-auto max-w-[1200px] px-5 py-20">
          <h2 className="mb-7 text-3xl font-semibold text-[#1a1a1a] md:text-4xl">Quem somos</h2>
          <div className="grid grid-cols-1 gap-11 md:grid-cols-2">
            <div>
              <div ref={paraRef} className="mb-8 text-2xl font-light leading-relaxed text-[#1a1a1a] md:text-3xl">
                {words.map((word, i) => (
                  <span key={i} className={`transition-all duration-500 ${revealed ? 'text-[#1a1a1a] opacity-100' : 'text-gray-300 opacity-50'}`} style={{ transitionDelay: `${i * 0.05}s` }}>
                    {word}{' '}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Stethoscope className="h-5 w-5" />, title: 'Médicos prescritores', body: 'Especialistas com CRM ativo e experiência clínica.' },
                  { icon: <ShieldCheck className="h-5 w-5" />, title: '100% legal', body: 'Tratamento conforme as normas da Anvisa.' },
                  { icon: <Lock className="h-5 w-5" />, title: 'Dados protegidos', body: 'Privacidade garantida sob a LGPD.' },
                  { icon: <Heart className="h-5 w-5" />, title: 'Cuidado contínuo', body: 'Acompanhamento próximo em cada etapa.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e6f7f0] text-[#1c5344]">{item.icon}</span>
                    <div className="mb-1 text-sm font-medium text-[#1a1a1a]">{item.title}</div>
                    <div className="text-xs leading-relaxed text-gray-600">{item.body}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[#90E2C4] p-9">
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full text-xs font-semibold text-black">Nossa missão</div>
              <p className="mb-8 text-2xl font-light leading-relaxed text-black">Democratizar o acesso a um cuidado de saúde seguro, humano e conforme a lei.</p>
              <div className="flex justify-between border-t border-white/18 pt-5">
                {[
                  { value: '+5 mil', label: 'pacientes acompanhados' },
                  { value: '4,9/5', label: 'avaliação média' },
                  { value: '2023', label: 'desde a fundação' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-semibold text-black">{stat.value}</div>
                    <div className="text-xs text-black/75">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processos */}
      <section id="processos" className="container mx-auto max-w-[1200px] px-5 py-20">
        <div data-reveal className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_.9fr]">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] md:text-4xl">Do primeiro contato ao tratamento, em 4 etapas</h2>
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full text-xs font-semibold">Processos</div>
            <p className="text-sm leading-relaxed text-gray-600">Um caminho simples e acompanhado de perto, do agendamento à chegada dos seus medicamentos.</p>
            <Link href="/registro" className="mt-1 inline-flex w-fit items-center gap-2 rounded-[12px] bg-[#90E2C4] px-6 py-2.5 text-sm font-medium text-[#123a30]">
              Falar com um médico <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div data-reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: '1', title: 'Triagem guiada', body: 'Cadastre-se e conte seus objetivos de saúde. A triagem prepara sua consulta para um atendimento mais focado.' },
            { n: '2', title: 'Consulta médica', body: 'Avaliação individual do seu caso, 100% online, com médicos de plantão e plano de tratamento personalizado.' },
            { n: '3', title: 'Receita e validação', body: 'Se apto, o médico emite a receita e acompanhamos a documentação necessária junto aos órgãos competentes.' },
            { n: '4', title: 'Entrega e acompanhamento', body: 'Suporte completo na importação e entrega, com acompanhamento contínuo da equipe.' },
          ].map(step => (
            <div key={step.n} className="rounded-3xl border border-gray-200 bg-[#faf9f6] p-6">
              <span className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-[#90E2C4] font-semibold text-[#123a30]">{step.n}</span>
              <div className="mb-2 mt-4 text-lg font-medium text-[#1a1a1a]">{step.title}</div>
              <p className="text-sm leading-relaxed text-gray-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Card */}
      <section className="container mx-auto max-w-[1200px] px-5 pb-20">
        <div data-reveal className="overflow-hidden rounded-[28px] bg-[#C79A49]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-11">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-transparent text-xs font-semibold text-white">Atendimento humanizado</div>
              <h2 className="mb-3 text-2xl font-semibold text-white md:text-3xl">Uma jornada de cuidado com quem entende de você</h2>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-white">Nossa equipe acompanha cada etapa do seu tratamento — da triagem à entrega dos medicamentos — com suporte por chat e ajustes sempre que precisar.</p>
              <Link href="/registro" className="inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-2.5 text-sm font-medium text-[#1c5344]">
                Iniciar jornada <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-80 overflow-hidden rounded-lg">
              <Image
                src="/images/video-thumbnail.webp"
                alt="Consulta médica"
                fill
                className="object-cover"
              />
              <button className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/92 shadow-lg">
                <svg className="h-7 w-7 ml-0.5 fill-[#1c5344]" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="border-y border-gray-200 bg-[#E4FFF5]">
        <div className="container mx-auto max-w-[1200px] px-5 py-20">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_.9fr]">
            <h2 className="text-3xl font-semibold text-[#1a1a1a] md:text-4xl">Relatos reais de pacientes</h2>
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit text-xs font-semibold">Depoimentos</div>
              <p className="text-sm leading-relaxed text-gray-600">Sua satisfação é a nossa prioridade — histórias de quem já cuida da saúde com a Vitalis.</p>
            </div>
          </div>
          <div className="mb-8 flex gap-6 border-b border-gray-200">
            {tabNames.map((name, i) => (
              <button key={name} onClick={() => { setActiveTab(i); setPage(0) }} className={`pb-3 text-sm font-semibold transition-colors ${activeTab === i ? 'border-b-2 border-[#1c5344] text-[#1c5344]' : 'border-b-2 border-transparent text-gray-600'}`}>
                {name}
              </button>
            ))}
          </div>
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTestimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e6f7f0] font-semibold text-[#1c5344]">{t.initials}</span>
                  <div>
                    <div className="text-sm font-medium text-[#1a1a1a]">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.date}</div>
                  </div>
                </div>
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#C79A49] text-[#C79A49]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#1a1a1a]">{t.text}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setPage(Math.max(0, validPage - 1))} className="flex h-11 w-11 items-center justify-center rounded-full border-1.5 border-[#90E2C4] bg-white text-[#90E2C4]">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i)} className={`rounded-full transition-all ${i === validPage ? 'h-2 w-7 bg-[#1c5344]' : 'h-2 w-2 bg-gray-300'}`} />
              ))}
            </div>
            <button onClick={() => setPage(Math.min(pages - 1, validPage + 1))} className="flex h-11 w-11 items-center justify-center rounded-full border-1.5 border-[#90E2C4] bg-[#90E2C4] text-white">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="container mx-auto max-w-[1200px] px-5 py-20">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_.9fr]">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] md:text-4xl">Desde 2023, fazendo história pela sua saúde</h2>
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit text-xs font-semibold">Nossa jornada</div>
            <p className="text-sm leading-relaxed text-gray-600">Eventos, ações e conteúdos que aproximam cuidado e comunidade.</p>
          </div>
        </div>
        <div ref={photoRef} className="mb-5 flex gap-4 overflow-x-auto pb-1 scroll-smooth">
          {GALLERY.map(g => (
            <div key={g.id} className="flex-none rounded-2xl overflow-hidden" style={{ minHeight: '300px', width: '320px' }}>
              <div className="relative h-full w-full">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="font-medium">{g.title}</div>
                  <div className="text-xs opacity-80">{g.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => scrollGallery(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border-1.5 border-[#90E2C4] bg-white text-[#90E2C4]">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scrollGallery(1)} className="flex h-11 w-11 items-center justify-center rounded-full border-1.5 border-[#90E2C4] bg-[#90E2C4] text-white">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-gray-200 bg-[#E4FFF5]">
        <div className="container mx-auto max-w-[900px] px-5 py-20">
          <h2 className="mb-12 text-3xl font-semibold text-[#1a1a1a] md:text-4xl">Dúvidas frequentes</h2>
          <div className="space-y-0">
            {FAQS.map((faq, i) => (
              <details key={i} open={expandedFaq === i} className="border-b border-gray-200">
                <summary onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="flex cursor-pointer items-center justify-between gap-5 py-5.5 font-medium text-[#1a1a1a]">
                  {faq.q}
                  <span className="flex-none transition-transform" style={{ transform: expandedFaq === i ? 'rotate(180deg)' : 'none' }}>
                    <ChevronDown className="h-5 w-5 text-[#90E2C4]" />
                  </span>
                </summary>
                {expandedFaq === i && (
                  <div className="pb-5 text-sm leading-relaxed text-gray-600">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto max-w-[1200px] px-5 py-20">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#90E2C4] via-[#90E2C4] to-[#00894A] p-16 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-transparent text-xs font-semibold text-white">Comece hoje</div>
          <h2 className="mb-3 text-3xl font-semibold text-white drop-shadow-md md:text-4xl">Inicie seu cuidado com a Vitalis</h2>
          <p className="mb-8 text-base text-white/90">Conquiste mais qualidade de vida com acompanhamento médico de verdade.</p>
          <Link href="/registro" className="inline-flex items-center gap-2 rounded-[12px] bg-[#90E2C4] px-8 py-3 text-sm font-medium text-[#123a30]">
            Agendar consulta <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#99722C] text-white/80">
        <div className="container mx-auto max-w-[1200px] px-5 py-16">
          <div className="mb-10 grid grid-cols-1 gap-9 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="mb-4">
                <Image src="/logo.svg" alt="BioSativa" width={120} height={40} className="h-8 w-auto invert" />
              </div>
              <p className="mb-4 max-w-xs text-xs leading-relaxed text-white/80">Plataforma de telemedicina que une tecnologia e atendimento humanizado para cuidar da sua saúde.</p>
              <div className="flex gap-2.5">
                {['instagram', 'linkedin', 'youtube', 'facebook', 'x'].map(social => (
                  <a key={social} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white hover:bg-white/20">
                    {social.charAt(0).toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3.5 font-semibold text-white">Navegação</div>
              <div className="space-y-2.5 text-xs">
                <a href="#" className="block hover:opacity-80">Início</a>
                <a href="#" className="block hover:opacity-80">Sobre nós</a>
                <a href="#" className="block hover:opacity-80">Depoimentos</a>
                <a href="#" className="block hover:opacity-80">Central de ajuda</a>
              </div>
            </div>
            <div>
              <div className="mb-3.5 font-semibold text-white">Institucional</div>
              <div className="space-y-2.5 text-xs">
                <a href="#" className="block hover:opacity-80">Termos de uso</a>
                <a href="#" className="block hover:opacity-80">Política de privacidade</a>
                <a href="#" className="block hover:opacity-80">LGPD</a>
              </div>
            </div>
            <div>
              <div className="mb-3.5 font-semibold text-white">Contato</div>
              <div className="space-y-2.5 text-xs leading-relaxed">suporte@vitalis.com.br<br />0800 123 4567<br />Seg a Sex, 8h às 20h</div>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-2xl bg-white/12 px-3 py-1.5 text-xs"><ShieldCheck className="h-3 w-3" /> LGPD</span>
                <span className="inline-flex items-center gap-1.5 rounded-2xl bg-white/12 px-3 py-1.5 text-xs"><Star className="h-3 w-3 fill-[#C79A49] text-[#C79A49]" /> 4,9/5</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/15 pt-5.5 text-center text-xs text-white/60">© 2026 Vitalis — Todos os direitos reservados.</div>
        </div>
      </footer>

      {/* Scroll to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5.5 right-5.5 z-120 flex h-13 w-13 items-center justify-center rounded-full bg-[#90E2C4] shadow-lg">
          <ArrowUp className="h-5.5 w-5.5 text-black" />
        </button>
      )}

      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        [data-reveal].in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal], [data-reveal].in {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
