import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import UserRow from '@/components/users/UserRow'
import Link from 'next/link'
import { Users } from 'lucide-react'

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
    <div>
      <div className="mb-10">
        <p className="text-rose-500 text-xs font-semibold tracking-widest uppercase mb-2">Yönetim</p>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-1">Kullanıcılar</h1>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-6 bg-rose-300" />
          <span className="text-rose-300 text-xs">✦</span>
          <div className="h-px w-6 bg-rose-300" />
        </div>
        <p className="text-stone-400 text-sm">
          {coupleCount} çift hesabı
          {unassignedCount > 0 && (
            <span className="ml-2 text-amber-600 font-medium">· {unassignedCount} düğüne atanmamış</span>
          )}
        </p>
      </div>

      {unassignedCount > 0 && (
        <div className="mb-6 flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-700">
          <span className="text-lg shrink-0">⚠️</span>
          <p>
            Atanmamış kullanıcıları bir düğüne bağlamak için{' '}
            <Link href="/dashboard/weddings" className="font-semibold underline underline-offset-2">
              düğün sayfasına gidin
            </Link>{' '}
            ve &ldquo;Çift Hesapları&rdquo; bölümünden atama yapın.
          </p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm overflow-x-auto">
        {(!users || users.length === 0) ? (
          <div className="px-8 py-20 text-center">
            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Users size={24} className="text-violet-300" />
            </div>
            <p className="font-serif text-xl text-stone-600 mb-2">Henüz kullanıcı yok</p>
            <p className="text-stone-400 text-sm">Çiftler kayıt olduktan sonra burada listelenecek.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60 text-left">
                <th className="px-7 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-7 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Rol</th>
                <th className="px-7 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Düğün</th>
                <th className="px-7 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Rol Değiştir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
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
        )}
      </div>
    </div>
  )
}
