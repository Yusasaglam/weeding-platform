import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Plus, Heart, Calendar, ChevronRight } from 'lucide-react'

export default async function WeddingsPage() {
  const admin = createAdminClient()
  const { data: weddings } = await admin
    .from('weddings')
    .select('id, title, bride_name, groom_name, event_date, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <p className="text-rose-500 text-xs font-semibold tracking-widest uppercase mb-2">Yönetim</p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-1">Düğünler</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 bg-rose-300" />
            <span className="text-rose-300 text-xs">✦</span>
            <div className="h-px w-6 bg-rose-300" />
          </div>
          <p className="text-stone-400 text-sm">
            {weddings?.length ?? 0} düğün etkinliği
          </p>
        </div>
        <Link
          href="/dashboard/weddings/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm shadow-rose-100 shrink-0"
        >
          <Plus size={15} />
          Yeni Düğün
        </Link>
      </div>

      {!weddings || weddings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-100 px-8 py-20 text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart size={24} className="text-rose-300" />
          </div>
          <p className="font-serif text-xl text-stone-700 mb-2">Henüz düğün yok</p>
          <p className="text-stone-400 text-sm mb-7 max-w-xs mx-auto">İlk düğün etkinliğini oluşturup misafir galerisi kurmaya başlayın.</p>
          <Link
            href="/dashboard/weddings/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors"
          >
            <Plus size={15} /> İlk Düğünü Oluştur
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {weddings.map((w) => (
            <Link
              key={w.id}
              href={`/dashboard/weddings/${w.id}`}
              className="bg-white rounded-2xl border border-stone-100 px-6 py-5 hover:border-rose-100 hover:shadow-md shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                  <Heart size={16} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800 group-hover:text-stone-900">{w.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-stone-400">{w.bride_name} & {w.groom_name}</p>
                    {w.event_date && (
                      <span className="flex items-center gap-1 text-xs text-stone-300">
                        <Calendar size={10} />
                        {new Date(w.event_date).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={w.status} />
                <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft:     'bg-stone-100 text-stone-500',
    active:    'bg-green-50 text-green-700',
    delivered: 'bg-sky-50 text-sky-700',
    archived:  'bg-stone-100 text-stone-400',
  }
  const labels: Record<string, string> = {
    draft: 'Taslak', active: 'Aktif', delivered: 'Teslim edildi', archived: 'Arşiv',
  }
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${map[status] ?? map.draft}`}>
      {labels[status] ?? status}
    </span>
  )
}
