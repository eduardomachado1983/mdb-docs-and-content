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

  // Verificar sessão demo
  const demoUserCookie = request.cookies.get('demo_user')?.value
  let demoUser: { role: string; email: string } | null = null
  if (demoUserCookie) {
    try {
      demoUser = JSON.parse(demoUserCookie)
    } catch {
      // Cookie inválido, ignorar
    }
  }

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
  const isAuthenticated = !!user || !!demoUser

  // Verificar rotas protegidas
  const protectedEntry = Object.entries(PROTECTED_ROUTES).find(
    ([route]) => pathname.startsWith(route)
  )

  if (protectedEntry) {
    const [, requiredRole] = protectedEntry

    // Não autenticado → login
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Verificar role
    let userRole: string | null = null
    if (demoUser) {
      userRole = demoUser.role
    } else if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      userRole = profile?.role ?? null
    }

    if (!userRole || userRole !== requiredRole) {
      const redirectMap: Record<string, string> = {
        patient: '/dashboard',
        doctor: '/medico',
        admin: '/admin',
      }
      const redirectTo = userRole ? redirectMap[userRole] || '/' : '/login'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  // Redirecionar usuário logado para sua área.
  const switchingRole = request.nextUrl.searchParams.has('role')
  if (pathname === '/login' && isAuthenticated && !switchingRole) {
    let userRole: string | null = null
    if (demoUser) {
      userRole = demoUser.role
    } else if (user) {
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
      userRole = profile?.role ?? null
    }

    const redirectMap: Record<string, string> = {
      patient: '/dashboard',
      doctor: '/medico',
      admin: '/admin',
    }
    if (userRole) {
      return NextResponse.redirect(
        new URL(redirectMap[userRole] || '/', request.url)
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
