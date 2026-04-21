import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Heart, Image, Users, ArrowRight, Plus } from 'lucide-react'

export default async function DashboardPage() {
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
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-rose-500 text-xs font-semibold tracking-widest uppercase mb-2">Hoş Geldiniz</p>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Genel Bakış</h1>
        <p className="text-stone-400 text-sm">Platformdaki tüm düğün etkinliklerini buradan yönetin.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Düğün"
          value={weddingCount ?? 0}
          icon={<Heart size={20} className="text-rose-500" />}
          bg="bg-rose-50"
          href="/dashboard/weddings"
        />
        <StatCard
          label="Medya Dosyası"
          value={mediaCount ?? 0}
          icon={<Image size={20} className="text-sky-500" />}
          bg="bg-sky-50"
        />
        <StatCard
          label="Kullanıcı"
          value={userCount ?? 0}
          icon={<Users size={20} className="text-violet-500" />}
          bg="bg-violet-50"
          href="/dashboard/users"
        />
      </div>

      {/* Recent weddings */}
      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-lg text-stone-900">Son Düğünler</h2>
            <p className="text-xs text-stone-400 mt-0.5">En son oluşturulan etkinlikler</p>
          </div>
          <Link
            href="/dashboard/weddings"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 font-medium transition-colors"
          >
            Tümünü gör <ArrowRight size={12} />
          </Link>
        </div>

        {recentWeddings && recentWeddings.length > 0 ? (
          <ul className="divide-y divide-stone-50">
            {recentWeddings.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/dashboard/weddings/${w.id}`}
                  className="flex items-center justify-between px-5 md:px-7 py-4 hover:bg-stone-50/60 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                      <Heart size={14} className="text-rose-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800 group-hover:text-stone-900">{w.title}</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {w.bride_name} & {w.groom_name}
                        {w.event_date && ` · ${new Date(w.event_date).toLocaleDateString('tr-TR')}`}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={w.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-7 py-16 text-center">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={20} className="text-rose-300" />
            </div>
            <p className="text-stone-500 text-sm mb-1">Henüz düğün yok.</p>
            <p className="text-stone-400 text-xs mb-5">İlk düğün etkinliğini oluşturarak başlayın.</p>
            <Link
              href="/dashboard/weddings/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus size={14} /> Düğün Oluştur
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label, value, icon, bg, href,
}: {
  label: string; value: number; icon: React.ReactNode; bg: string; href?: string
}) {
  const inner = (
    <div className={`bg-white rounded-3xl border border-stone-100 px-7 py-6 shadow-sm hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}>
      <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="font-serif text-4xl text-stone-900 mb-1">{value}</p>
      <p className="text-xs text-stone-400 font-medium">{label}</p>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft:     'bg-stone-100 text-stone-500',
    active:    'bg-green-50 text-green-700',
    delivered: 'bg-sky-50 text-sky-700',
    archived:  'bg-stone-100 text-stone-400',
  }
  const labels: Record<string, string> = {
    draft: 'Taslak', active: 'Aktif', delivered: 'Teslim edildi', archived: 'Arşiv',
  }
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${styles[status] ?? styles.draft}`}>
      {labels[status] ?? status}
    </span>
  )
}
