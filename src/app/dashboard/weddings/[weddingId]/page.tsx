import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, FolderOpen, Upload, QrCode, ChevronRight } from 'lucide-react'
import WeddingCouplesSection from '@/components/dashboard/WeddingCouplesSection'

interface Props { params: Promise<{ weddingId: string }> }

export default async function WeddingDetailPage({ params }: Props) {
  const { weddingId } = await params
  const admin = createAdminClient()

  const [
    { data: wedding },
    { data: albums },
    { count: mediaCount },
    { data: assignedRows },
    { data: allCouples },
  ] = await Promise.all([
    admin.from('weddings').select('*').eq('id', weddingId).single(),
    admin.from('albums').select('id, title, visibility, sort_order').eq('wedding_id', weddingId).order('sort_order'),
    admin.from('media_files').select('*', { count: 'exact', head: true }).eq('wedding_id', weddingId),
    admin.from('wedding_couples').select('user_id, users(id, full_name, email)').eq('wedding_id', weddingId),
    admin.from('users').select('id, full_name, email').eq('role', 'couple').order('full_name'),
  ])

  if (!wedding) notFound()

  const assignedCouples = (assignedRows ?? []).flatMap((r) => {
    const u = r.users
    if (!u) return []
    const user = Array.isArray(u) ? u[0] : u
    return user ? [{ id: user.id, full_name: user.full_name, email: user.email }] : []
  })

  const assignedIds = new Set(assignedCouples.map((u) => u.id))
  const availableCouples = (allCouples ?? []).filter((u) => !assignedIds.has(u.id))

  return (
    <div>
      <Link
        href="/dashboard/weddings"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8"
      >
        <ChevronLeft size={14} /> Düğünler
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="font-serif text-2xl md:text-4xl text-stone-900">{wedding.title}</h1>
            <StatusBadge status={wedding.status} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 bg-rose-300" />
            <span className="text-rose-300 text-xs">✦</span>
            <div className="h-px w-6 bg-rose-300" />
          </div>
          <p className="text-stone-400 text-sm">
            {wedding.bride_name} & {wedding.groom_name}
            {wedding.event_date && ` · ${new Date(wedding.event_date).toLocaleDateString('tr-TR')}`}
            {wedding.venue && ` · ${wedding.venue}`}
          </p>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <ActionCard
          href={`/dashboard/weddings/${weddingId}/albums`}
          icon={<FolderOpen size={20} className="text-amber-500" />}
          bg="bg-amber-50"
          label="Albümler"
          desc={`${albums?.length ?? 0} albüm`}
        />
        <ActionCard
          href={`/dashboard/weddings/${weddingId}/uploads`}
          icon={<Upload size={20} className="text-sky-500" />}
          bg="bg-sky-50"
          label="Medya Yükle"
          desc={`${mediaCount ?? 0} dosya yüklendi`}
        />
        <ActionCard
          href={`/dashboard/weddings/${weddingId}/qr`}
          icon={<QrCode size={20} className="text-violet-500" />}
          bg="bg-violet-50"
          label="QR Kodlar"
          desc="Oluştur & yönet"
        />
      </div>

      {/* Couple assignment */}
      <div className="mb-8">
        <WeddingCouplesSection
          weddingId={weddingId}
          assignedCouples={assignedCouples}
          availableCouples={availableCouples}
        />
      </div>

      {/* Albums list */}
      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 md:px-7 py-4 md:py-5 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-lg text-stone-900">Albümler</h2>
            <p className="text-xs text-stone-400 mt-0.5">{albums?.length ?? 0} albüm</p>
          </div>
          <Link
            href={`/dashboard/weddings/${weddingId}/albums/new`}
            className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors"
          >
            + Albüm Ekle
          </Link>
        </div>
        {!albums || albums.length === 0 ? (
          <div className="px-7 py-12 text-center">
            <p className="text-sm text-stone-400 mb-2">Henüz albüm yok.</p>
            <Link
              href={`/dashboard/weddings/${weddingId}/albums/new`}
              className="text-sm text-rose-500 hover:text-rose-700 font-medium transition-colors"
            >
              İlk albümü oluştur →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-stone-50">
            {albums.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/dashboard/weddings/${weddingId}/albums/${a.id}`}
                  className="flex items-center justify-between px-5 md:px-7 py-4 hover:bg-stone-50/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                      <FolderOpen size={13} className="text-amber-500" />
                    </div>
                    <span className="text-sm font-medium text-stone-800 group-hover:text-stone-900">{a.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <VisibilityBadge visibility={a.visibility} />
                    <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ActionCard({ href, icon, bg, label, desc }: {
  href: string; icon: React.ReactNode; bg: string; label: string; desc: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-stone-100 p-6 hover:border-rose-100 hover:shadow-md shadow-sm transition-all group"
    >
      <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-stone-800 mb-0.5">{label}</p>
      <p className="text-xs text-stone-400">{desc}</p>
    </Link>
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

function VisibilityBadge({ visibility }: { visibility: string }) {
  const map: Record<string, { label: string; style: string }> = {
    private: { label: 'Özel',          style: 'bg-stone-100 text-stone-500' },
    couple:  { label: 'Çifte özel',    style: 'bg-rose-50 text-rose-600' },
    guest:   { label: 'Misafire açık', style: 'bg-green-50 text-green-700' },
  }
  const c = map[visibility] ?? map.private
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.style}`}>{c.label}</span>
}
