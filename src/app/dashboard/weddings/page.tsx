import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function WeddingsPage() {
  const admin = createAdminClient()
  const { data: weddings } = await admin
    .from('weddings')
    .select('id, title, bride_name, groom_name, event_date, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Düğünler</h1>
          <p className="text-stone-500 text-sm mt-1">Tüm düğün etkinliklerini yönetin.</p>
        </div>
        <Link
          href="/dashboard/weddings/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={14} />
          Yeni Düğün
        </Link>
      </div>

      {!weddings || weddings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-400 text-sm mb-3">Henüz düğün yok.</p>
          <Link href="/dashboard/weddings/new" className="text-sm text-stone-700 underline underline-offset-2">
            İlk düğünü oluştur
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {weddings.map((w) => (
            <Link
              key={w.id}
              href={`/dashboard/weddings/${w.id}`}
              className="bg-white rounded-2xl border border-stone-200 px-6 py-4 hover:border-stone-300 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-stone-800">{w.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {w.bride_name} & {w.groom_name}
                  {w.event_date && ` · ${new Date(w.event_date).toLocaleDateString('tr-TR')}`}
                </p>
              </div>
              <StatusBadge status={w.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: 'bg-stone-100 text-stone-500',
    active: 'bg-green-50 text-green-700',
    delivered: 'bg-sky-50 text-sky-700',
    archived: 'bg-stone-100 text-stone-400',
  }
  const labels: Record<string, string> = {
    draft: 'Taslak', active: 'Aktif', delivered: 'Teslim edildi', archived: 'Arşiv',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${map[status] ?? map.draft}`}>
      {labels[status] ?? status}
    </span>
  )
}
