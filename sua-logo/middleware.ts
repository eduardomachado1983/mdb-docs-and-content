import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

const PROTECTED_ROUTES = {
  '/dashboard': 'patient',
  '/medico': 'doctor',
  '/admin': 'admin',
  '/api/patient': 'patient',
  '/api/doctor': 'doctor',
  '/api/admin': 'admin',
} as const

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // Criar cliente Supabase com SSR
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Atualizar sessão (importante para Server Components)
  const { data: { user } } = await supabase.auth.getUser()

  // Verificar rotas protegidas
  const protectedEntry = Object.entries(PROTECTED_ROUTES).find(
    ([route]) => pathname.startsWith(route)
  )

  if (protectedEntry) {
    const [, requiredRole] = protectedEntry

    // Não autenticado → login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Verificar role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== requiredRole) {
      const redirectMap: Record<string, string> = {
        patient: '/dashboard',
        doctor: '/medico',
        admin: '/admin',
      }
      const redirectTo = profile ? redirectMap[profile.role] || '/' : '/login'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  // Redirecionar usuário logado para sua área
  if (pathname === '/login' && user) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    const redirectMap: Record<string, string> = {
      patient: '/dashboard',
      doctor: '/medico',
      admin: '/admin',
    }
    if (profile) {
      return NextResponse.redirect(
        new URL(redirectMap[profile.role] || '/', request.url)
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
