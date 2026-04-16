import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export default async function AuthRedirectPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.log('[auth/redirect] no user, going to /login')
    redirect('/login')
  }

  console.log('[auth/redirect] user.id=', user.id, 'email=', user.email)

  // Try regular client first (RLS: auth.uid() = id)
  // If it fails (e.g. RLS misconfigured), fall back to admin client
  let role: string | null = null

  const { data: profileRegular, error: rErr } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  console.log('[auth/redirect] regular client profile=', profileRegular, 'err=', rErr?.message)
  role = profileRegular?.role ?? null

  if (!role) {
    // Fallback: admin client bypasses RLS entirely
    const admin = createAdminClient()
    const { data: profileAdmin, error: aErr } = await admin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log('[auth/redirect] admin client profile=', profileAdmin, 'err=', aErr?.message)
    role = profileAdmin?.role ?? null

    if (!role) {
      // Profile doesn't exist at all — create it and send to waiting
      console.log('[auth/redirect] no profile found — creating guest profile')
      await admin.from('users').upsert({
        id: user.id,
        email: user.email ?? '',
        full_name: user.user_metadata?.full_name ?? '',
        role: 'couple',
      })
      console.log('[auth/redirect] -> /waiting (new user, no profile)')
      redirect('/waiting')
    }
  }

  console.log('[auth/redirect] resolved role=', role)

  if (role === 'admin') {
    console.log('[auth/redirect] -> /dashboard')
    redirect('/dashboard')
  }

  // couple (or any other role) — check wedding assignment
  const admin = createAdminClient()

  // Try both clients for wedding assignment
  let weddingId: string | null = null

  const { data: assignRegular } = await supabase
    .from('wedding_couples')
    .select('wedding_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  weddingId = assignRegular?.wedding_id ?? null
  console.log('[auth/redirect] regular assignment=', assignRegular)

  if (!weddingId) {
    const { data: assignAdmin } = await admin
      .from('wedding_couples')
      .select('wedding_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    weddingId = assignAdmin?.wedding_id ?? null
    console.log('[auth/redirect] admin assignment=', assignAdmin)
  }

  if (weddingId) {
    console.log('[auth/redirect] -> /wedding/', weddingId)
    redirect(`/wedding/${weddingId}`)
  }

  console.log('[auth/redirect] -> /waiting (no assignment)')
  redirect('/waiting')
}
