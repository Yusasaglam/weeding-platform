import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, FolderOpen, Upload, QrCode } from 'lucide-react'
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
    // Who is already assigned to this wedding?
    admin.from('wedding_couples')
      .select('user_id, users(id, full_name, email)')
      .eq('wedding_id', weddingId),
    // All couple-role accounts in the system
    admin.from('users')
      .select('id, full_name, email')
      .eq('role', 'couple')
      .order('full_name'),
  ])

  if (!wedding) notFound()

  // Build assigned list from join result
  const assignedCouples = (assignedRows ?? []).flatMap((r) => {
    const u = r.users
    if (!u) return []
    const user = Array.isArray(u) ? u[0] : u
    return user ? [{ id: user.id, full_name: user.full_name, email: user.email }] : []
  })

  const assignedIds = new Set(assignedCouples.map((u) => u.id))

  // Couples not yet assigned to THIS wedding (may be assigned to others — that's fine)
  const availableCouples = (allCouples ?? []).filter((u) => !assignedIds.has(u.id))

  return (
    <div className="max-w-5xl">
      <Link
        href="/dashboard/weddings"
        className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Düğünler
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{wedding.title}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {wedding.bride_name} & {wedding.groom_name}
            {wedding.event_date && ` · ${new Date(wedding.event_date).toLocaleDateString('tr-TR')}`}
            {wedding.venue && ` · ${wedding.venue}`}
          </p>
        </div>
        <StatusBadge status={wedding.status} />
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <ActionCard
          href={`/dashboard/weddings/${weddingId}/albums`}
          icon={<FolderOpen size={18} className="text-amber-500" />}
          label="Albümler"
          desc={`${albums?.length ?? 0} albüm`}
        />
        <ActionCard
          href={`/dashboard/weddings/${weddingId}/uploads`}
          icon={<Upload size={18} className="text-sky-500" />}
          label="Yükle"
          desc={`${mediaCount ?? 0} dosya`}
        />
        <ActionCard
          href={`/dashboard/weddings/${weddingId}/qr`}
          icon={<QrCode size={18} className="text-violet-500" />}
          label="QR Kodlar"
          desc="Oluştur & yönet"
        />
      </div>

      {/* Couple assignment — the main fix */}
      <div className="mb-8">
        <WeddingCouplesSection
          weddingId={weddingId}
          assignedCouples={assignedCouples}
          availableCouples={availableCouples}
        />
      </div>

      {/* Albums list */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700">Albümler</h2>
          <Link
            href={`/dashboard/weddings/${weddingId}/albums/new`}
            className="text-xs text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors"
          >
            + Albüm ekle
          </Link>
        </div>
        {!albums || albums.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-stone-400">Henüz albüm yok.</p>
            <Link
              href={`/dashboard/weddings/${weddingId}/albums/new`}
              className="mt-2 inline-block text-sm text-stone-700 underline underline-offset-2"
            >
              İlk albümü oluştur
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {albums.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/dashboard/weddings/${weddingId}/albums/${a.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm text-stone-800">{a.title}</span>
                  <VisibilityBadge visibility={a.visibility} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ActionCard({ href, icon, label, desc }: {
  href: string; icon: React.ReactNode; label: string; desc: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-stone-200 px-5 py-5 hover:border-stone-300 hover:shadow-sm transition-all"
    >
      <div className="mb-3">{icon}</div>
      <p className="text-sm font-semibold text-stone-800">{label}</p>
      <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: 'bg-stone-100 text-stone-500', active: 'bg-green-50 text-green-700',
    delivered: 'bg-sky-50 text-sky-700', archived: 'bg-stone-100 text-stone-400',
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

function VisibilityBadge({ visibility }: { visibility: string }) {
  const map: Record<string, { label: string; style: string }> = {
    private: { label: 'Özel',          style: 'bg-stone-100 text-stone-500' },
    couple:  { label: 'Çifte özel',    style: 'bg-rose-50 text-rose-600' },
    guest:   { label: 'Misafire açık', style: 'bg-green-50 text-green-700' },
  }
  const c = map[visibility] ?? map.private
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.style}`}>{c.label}</span>
}
