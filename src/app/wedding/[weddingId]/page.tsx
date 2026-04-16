import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import CoupleQrList from '@/components/wedding/CoupleQrList'

interface Props { params: Promise<{ weddingId: string }> }

export default async function CoupleDashboardPage({ params }: Props) {
  const { weddingId } = await params
  const supabase = await createClient()
  const admin = createAdminClient()

  const [{ data: albums }, { data: tokens }, { data: albumsForQr }] = await Promise.all([
    supabase
      .from('albums')
      .select('id, title, description, visibility')
      .eq('wedding_id', weddingId)
      .order('sort_order'),
    admin
      .from('guest_tokens')
      .select('id, token, label, album_id, expires_at, is_active')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false }),
    admin
      .from('albums')
      .select('id, title')
      .eq('wedding_id', weddingId)
      .order('sort_order'),
  ])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return (
    <div className="space-y-12">
      {/* Albümler */}
      <section>
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
                <p className="text-xs text-stone-400 mt-2">
                  {a.visibility === 'guest' ? 'Misafire açık' : 'Çifte özel'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Barkodlar */}
      <section>
        <h2 className="text-lg font-semibold text-stone-800 mb-2">Misafir Barkodları</h2>
        <p className="text-stone-500 text-sm mb-6">
          Misafirlerinizin galeriye erişmesi için bu barkodları paylaşın.
        </p>
        <CoupleQrList
          tokens={tokens ?? []}
          albums={albumsForQr ?? []}
          appUrl={appUrl}
        />
      </section>
    </div>
  )
}
