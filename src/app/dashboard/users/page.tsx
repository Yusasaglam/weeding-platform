import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import UserRow from '@/components/users/UserRow'
import Link from 'next/link'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user: me } } = await supabase.auth.getUser()

  const admin = createAdminClient()

  const [{ data: users }, { data: weddings }, { data: assignments }] = await Promise.all([
    admin.from('users').select('id, full_name, email, role, created_at').order('created_at', { ascending: false }),
    admin.from('weddings').select('id, title').order('created_at', { ascending: false }),
    admin.from('wedding_couples').select('user_id, wedding_id'),
  ])

  const weddingMap = new Map((weddings ?? []).map((w) => [w.id, w.title]))

  const assignmentsByUser = (assignments ?? []).reduce<Record<string, { wedding_id: string; title: string }[]>>(
    (acc, a) => {
      if (!acc[a.user_id]) acc[a.user_id] = []
      acc[a.user_id].push({ wedding_id: a.wedding_id, title: weddingMap.get(a.wedding_id) ?? '—' })
      return acc
    },
    {}
  )

  const coupleCount = (users ?? []).filter((u) => u.role === 'couple').length
  const unassignedCount = (users ?? []).filter(
    (u) => u.role === 'couple' && !assignmentsByUser[u.id]?.length
  ).length

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-800">Kullanıcılar</h1>
        <p className="text-stone-500 text-sm mt-1">
          {coupleCount} çift hesabı
          {unassignedCount > 0 && (
            <span className="ml-2 text-amber-600 font-medium">
              · {unassignedCount} henüz düğüne atanmamış
            </span>
          )}
        </p>
      </div>

      {unassignedCount > 0 && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
          Atanmamış kullanıcıları düğüne bağlamak için{' '}
          <Link href="/dashboard/weddings" className="font-medium underline underline-offset-2">
            düğün sayfasına gidin
          </Link>{' '}
          ve "Çift Hesapları" bölümünden kullanıcı seçin.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Kullanıcı</th>
              <th className="px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Rol</th>
              <th className="px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Düğün</th>
              <th className="px-6 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide">Rol Değiştir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {(users ?? []).map((u) => (
              <UserRow
                key={u.id}
                user={u}
                weddings={weddings ?? []}
                userAssignments={assignmentsByUser[u.id] ?? []}
                currentUserId={me?.id ?? ''}
              />
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div className="px-6 py-12 text-center text-stone-400 text-sm">
            Henüz kayıtlı kullanıcı yok.
          </div>
        )}
      </div>
    </div>
  )
}
