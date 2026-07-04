import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STEPS = [
  { title: '1. Cadastro', desc: 'Preencha seus dados pessoais e faça a triagem com nosso assistente.' },
  { title: '2. Pagamento', desc: 'Pague sua consulta via Pix ou cartão, com segurança.' },
  { title: '3. Atendimento', desc: 'Um médico avalia seu caso e emite receita ou laudo.' },
  { title: '4. Liberação', desc: 'Nossa equipe valida tudo e seus documentos ficam disponíveis.' },
]

export default function LandingPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
      <header className="flex items-center justify-between">
        <span className="text-xl font-bold text-teal-700 dark:text-teal-400">Sua Logo</span>
        <nav className="flex gap-3">
          <Link href="/login"><Button variant="ghost">Entrar</Button></Link>
          <Link href="/registro"><Button>Criar conta</Button></Link>
        </nav>
      </header>

      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Consulta médica online, do jeito simples.
        </h1>
        <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400">
          Faça sua triagem, pague com Pix e receba atendimento médico sem sair de casa.
        </p>
        <Link href="/registro">
          <Button size="lg">Começar agora</Button>
        </Link>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle className="text-base">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <footer className="border-t border-slate-200 pt-8 text-center text-sm text-slate-400 dark:border-slate-800">
        Sua Logo Telemedicina — projeto de demonstração.
      </footer>
    </main>
  )
}
