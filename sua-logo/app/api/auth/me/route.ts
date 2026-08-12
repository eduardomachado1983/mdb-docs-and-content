import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getProfile, getUser } from '@/lib/supabase/server'

export async function GET() {
  const cookieStore = await cookies()
  const demoUser = cookieStore.get('demo_user')?.value

  if (demoUser) {
    const demo = JSON.parse(demoUser)
    return NextResponse.json({
      user: { id: 'demo', email: demo.email },
      profile: { role: demo.role, name: 'Usuário Demo', id: 'demo' },
      isDemo: true,
    })
  }

  const user = await getUser()
  if (!user) return NextResponse.json({ user: null, profile: null })

  const profile = await getProfile()
  return NextResponse.json({ user: { id: user.id, email: user.email }, profile })
}
