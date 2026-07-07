import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {
            // Server Components não podem setar cookies
          }
        },
      },
    }
  )
}

// Service role client — bypassa RLS.
// NÃO usar @supabase/ssr aqui: com cookies, o ssr injeta o JWT do usuário
// (papel authenticated) e o RLS volta a valer, ignorando a service key.
// O client puro do supabase-js, sem cookies, usa a service role de fato.
// Usar APENAS em API routes seguras, nunca no cliente.
export async function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )
}

// Helper: retorna o usuário autenticado ou null
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper: retorna o profile do usuário (com role)
export async function getProfile() {
  const { profile } = await getUserAndProfile()
  return profile
}

// Helper: user + profile numa única validação de sessão. Usar em vez de
// chamar getUser() e getProfile() separadamente na mesma página — cada um
// faz sua própria validação de sessão (round-trip à API do Supabase Auth),
// então chamar os dois dobra essa espera à toa.
export async function getUserAndProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  return { user, profile }
}
