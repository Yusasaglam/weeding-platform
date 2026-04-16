import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Heart, Image, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const admin = createAdminClient()

  const [
    { count: weddingCount },
    { count: mediaCount },
    { count: userCount },
  ] = await Promise.all([
    admin.from('weddings').select('*', { count: 'exact', head: true }),
    admin.from('media_files').select('*', { count: 'exact', head: true }),
    admin.from('users').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentWeddings } = await admin
    .from('weddings')
    .select('id, title, bride_name, groom_name, event_date, status')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Genel Bakış</h1>
        <p className="text-stone-500 text-sm mt-1">Düğün medya platformu yönetim paneli.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Düğün" value={weddingCount ?? 0} icon={<Heart size={18} className="text-rose-400" />} />
        <StatCard label="Medya Dosyası" value={mediaCount ?? 0} icon={<Image size={18} className="text-sky-400" />} />
        <StatCard label="Kullanıcı" value={userCount ?? 0} icon={<Users size={18} className="text-violet-400" />} />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700">Son Düğünler</h2>
          <Link href="/dashboard/weddings" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
            Tümünü gör
          </Link>
        </div>
        {recentWeddings && recentWeddings.length > 0 ? (
          <ul className="divide-y divide-stone-100">
            {recentWeddings.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/dashboard/weddings/${w.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-800">{w.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {w.bride_name} & {w.groom_name}
                      {w.event_date && ` · ${new Date(w.event_date).toLocaleDateString('tr-TR')}`}
                    </p>
                  </div>
                  <StatusBadge status={w.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-stone-400">Henüz düğün yok.</p>
            <Link href="/dashboard/weddings/new" className="mt-3 inline-block text-sm text-stone-700 underline underline-offset-2">
              İlk düğünü oluştur
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 px-6 py-5">
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-semibold text-stone-800">{value}</p>
      <p className="text-xs text-stone-400 mt-0.5">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-stone-100 text-stone-500',
    active: 'bg-green-50 text-green-700',
    delivered: 'bg-sky-50 text-sky-700',
    archived: 'bg-stone-100 text-stone-400',
  }
  const labels: Record<string, string> = {
    draft: 'Taslak', active: 'Aktif', delivered: 'Teslim edildi', archived: 'Arşiv',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] ?? styles.draft}`}>
      {labels[status] ?? status}
    </span>
  )
}
