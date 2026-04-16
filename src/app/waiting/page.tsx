import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'

export default async function WaitingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  // Check assignment — use admin client to bypass any RLS issue
  const { data: assignment } = await admin
    .from('wedding_couples')
    .select('wedding_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (assignment?.wedding_id) redirect(`/wedding/${assignment.wedding_id}`)

  // Read role — try both clients
  let role = 'couple'
  const { data: profileRegular } = await supabase
    .from('users').select('role, full_name, email').eq('id', user.id).single()

  if (profileRegular) {
    role = profileRegular.role
    if (role === 'admin') redirect('/dashboard')
  } else {
    const { data: profileAdmin } = await admin
      .from('users').select('role, full_name, email').eq('id', user.id).single()
    if (profileAdmin?.role === 'admin') redirect('/dashboard')
    role = profileAdmin?.role ?? 'couple'
  }

  const email = profileRegular?.email ?? user.email

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-8 py-12">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">💍</span>
          </div>
          <h1 className="text-xl font-semibold text-stone-800 mb-2">Hesabınız Hazır</h1>
          <p className="text-stone-500 text-sm mb-6">
            Fotoğrafçınız sizi düğününüze bağlayana kadar bekleyin.
          </p>
          <p className="text-xs text-stone-400 mb-2">{email}</p>
          <p className="text-xs text-stone-300 mb-8">rol: {role}</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-stone-500 hover:text-stone-800 underline underline-offset-2 transition"
            >
              Çıkış Yap
            </button>
          </form>
        </div>

        {/* Debug: if you're the admin and stuck here */}
        <p className="text-xs text-stone-400 mt-4">
          Admin misiniz?{' '}
          <a href="/setup" className="underline">Kurulum sayfasına gidin</a>
        </p>
      </div>
    </div>
  )
}
