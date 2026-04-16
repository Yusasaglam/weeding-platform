import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { claimAdmin } from '@/lib/actions/setup'

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: admins } = await admin
    .from('users').select('id').eq('role', 'admin').limit(1)

  if (admins && admins.length > 0) redirect('/login')

  const { data: profile } = await admin
    .from('users').select('email, role').eq('id', user.id).single()

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-8 py-10">
          <h1 className="text-xl font-semibold text-stone-800 mb-2">İlk Admin Kurulumu</h1>
          <p className="text-sm text-stone-500 mb-6">
            Sistemde henüz admin yok. Kendinizi admin olarak atayabilirsiniz.
          </p>
          <div className="bg-stone-50 rounded-xl p-4 mb-6 text-sm space-y-1">
            <p className="text-stone-600">
              <span className="font-medium">Email:</span> {profile?.email ?? user.email}
            </p>
            <p className="text-stone-600">
              <span className="font-medium">Mevcut rol:</span> {profile?.role ?? 'profil yok'}
            </p>
          </div>
          <form action={claimAdmin}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-lg transition"
            >
              Admini Ol ve Dashboard'a Git
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
