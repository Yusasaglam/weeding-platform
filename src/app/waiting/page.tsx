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

  const { data: profileRegular } = await supabase
    .from('users').select('role, full_name, email').eq('id', user.id).single()

  if (profileRegular) {
    if (profileRegular.role === 'admin') redirect('/dashboard')
  } else {
    const { data: profileAdmin } = await admin
      .from('users').select('role, full_name, email').eq('id', user.id).single()
    if (profileAdmin?.role === 'admin') redirect('/dashboard')
  }

  const email = profileRegular?.email ?? user.email

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm px-8 py-12">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">💍</span>
          </div>
          <h1 className="font-serif text-2xl text-stone-900 mb-2">Hesabınız Hazır</h1>
          <p className="text-stone-500 text-sm mb-6">
            Fotoğrafçınız sizi düğününüze bağlayana kadar bekleyin.
          </p>
          <p className="text-xs text-stone-400 mb-8">{email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-stone-400 hover:text-stone-700 underline underline-offset-2 transition"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
