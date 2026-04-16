import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus } from 'lucide-react'

interface Props { params: Promise<{ weddingId: string }> }

export default async function AlbumsIndexPage({ params }: Props) {
  const { weddingId } = await params
  const admin = createAdminClient()

  const [{ data: wedding }, { data: albums }] = await Promise.all([
    admin.from('weddings').select('id, title').eq('id', weddingId).single(),
    admin.from('albums').select('id, title, description, visibility, sort_order').eq('wedding_id', weddingId).order('sort_order'),
  ])

  if (!wedding) notFound()

  return (
    <div className="max-w-5xl">
      <Link href={`/dashboard/weddings/${weddingId}`} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Albümler</h1>
        <Link href={`/dashboard/weddings/${weddingId}/albums/new`}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus size={14} /> Yeni Albüm
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {!albums || albums.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-stone-400 mb-3">Henüz albüm yok.</p>
            <Link href={`/dashboard/weddings/${weddingId}/albums/new`} className="text-sm text-stone-700 underline underline-offset-2">
              İlk albümü oluştur
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {albums.map((a) => (
              <li key={a.id}>
                <Link href={`/dashboard/weddings/${weddingId}/albums/${a.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{a.title}</p>
                    {a.description && <p className="text-xs text-stone-400 mt-0.5">{a.description}</p>}
                  </div>
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

function VisibilityBadge({ visibility }: { visibility: string }) {
  const map: Record<string, { label: string; style: string }> = {
    private: { label: 'Özel',          style: 'bg-stone-100 text-stone-500' },
    couple:  { label: 'Çifte özel',    style: 'bg-rose-50 text-rose-600' },
    guest:   { label: 'Misafire açık', style: 'bg-green-50 text-green-700' },
  }
  const c = map[visibility] ?? map.private
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.style}`}>{c.label}</span>
}
