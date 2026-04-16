import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Props { params: Promise<{ weddingId: string }> }

export default async function CoupleDashboardPage({ params }: Props) {
  const { weddingId } = await params
  const supabase = await createClient()

  const { data: albums } = await supabase
    .from('albums')
    .select('id, title, description, visibility')
    .eq('wedding_id', weddingId)
    .order('sort_order')

  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-800 mb-6">Albümler</h2>

      {!albums || albums.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-400 text-sm">Henüz albüm yok. Fotoğrafçınız yakında ekleyecek.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {albums.map((a) => (
            <Link
              key={a.id}
              href={`/wedding/${weddingId}/albums/${a.id}`}
              className="bg-white rounded-2xl border border-stone-200 px-5 py-5 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-semibold text-stone-800">{a.title}</p>
              {a.description && <p className="text-xs text-stone-400 mt-1">{a.description}</p>}
              <p className="text-xs text-stone-400 mt-2">{a.visibility === 'guest' ? 'Misafire açık' : 'Çifte özel'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
