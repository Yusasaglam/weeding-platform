import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, FolderOpen, ChevronRight } from 'lucide-react'

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
    <div>
      <Link href={`/dashboard/weddings/${weddingId}`} className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl text-stone-900 mb-2">Albümler</h1>
          <p className="text-stone-400 text-sm">{albums?.length ?? 0} albüm · {wedding.title}</p>
        </div>
        <Link
          href={`/dashboard/weddings/${weddingId}/albums/new`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm shadow-rose-100 mt-1"
        >
          <Plus size={15} /> Yeni Albüm
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
        {!albums || albums.length === 0 ? (
          <div className="px-8 py-20 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FolderOpen size={24} className="text-amber-400" />
            </div>
            <p className="font-serif text-xl text-stone-700 mb-2">Henüz albüm yok</p>
            <p className="text-stone-400 text-sm mb-7 max-w-xs mx-auto">Fotoğraflarınızı organize etmek için albüm oluşturun.</p>
            <Link
              href={`/dashboard/weddings/${weddingId}/albums/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors"
            >
              <Plus size={15} /> İlk Albümü Oluştur
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-stone-50">
            {albums.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/dashboard/weddings/${weddingId}/albums/${a.id}`}
                  className="flex items-center justify-between px-7 py-4 hover:bg-stone-50/60 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                      <FolderOpen size={15} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800 group-hover:text-stone-900">{a.title}</p>
                      {a.description && <p className="text-xs text-stone-400 mt-0.5">{a.description}</p>}
                    </div>
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

function VisibilityBadge({ visibility }: { visibility: string }) {
  const map: Record<string, { label: string; style: string }> = {
    private: { label: 'Özel',          style: 'bg-stone-100 text-stone-500' },
    couple:  { label: 'Çifte özel',    style: 'bg-rose-50 text-rose-600' },
    guest:   { label: 'Misafire açık', style: 'bg-green-50 text-green-700' },
  }
  const c = map[visibility] ?? map.private
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.style}`}>{c.label}</span>
}
