import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Calendar, MapPin, QrCode, Images } from 'lucide-react'
import CoupleQrList from '@/components/wedding/CoupleQrList'
import CoupleGallerySection from '@/components/wedding/CoupleGallerySection'

interface Props { params: Promise<{ weddingId: string }> }

export default async function CoupleDashboardPage({ params }: Props) {
  const { weddingId } = await params
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [weddingRes, albumsRes, tokensRes, favsRes] = await Promise.all([
    supabase.from('weddings').select('*').eq('id', weddingId).single(),
    supabase
      .from('albums')
      .select('id, title, description, visibility')
      .eq('wedding_id', weddingId)
      .in('visibility', ['couple', 'guest'])
      .order('sort_order'),
    admin
      .from('guest_tokens')
      .select('id, token, label, album_id, expires_at, is_active')
      .eq('wedding_id', weddingId)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('favorites')
      .select('media_file_id')
      .eq('user_id', user.id),
  ])

  const wedding = weddingRes.data
  const albums = albumsRes.data ?? []
  const tokens = tokensRes.data ?? []
  const favSet = (favsRes.data ?? []).map((f) => f.media_file_id)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Fetch all media for visible albums
  const albumIds = albums.map((a) => a.id)
  const { data: allMedia } = albumIds.length > 0
    ? await admin
        .from('media_files')
        .select('id, storage_path, file_name, file_type, album_id')
        .in('album_id', albumIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const albumsWithMedia = albums.map((a) => ({
    ...a,
    media_files: (allMedia ?? []).filter((m) => m.album_id === a.id),
  }))

  const totalPhotos = (allMedia ?? []).length

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">

      {/* Wedding profile card — same style as admin stat cards */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="bg-stone-900 px-7 pt-8 pb-6 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative">
            <p className="text-rose-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
              Düğün Galerisi
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight">
              {wedding?.bride_name && wedding?.groom_name
                ? `${wedding.bride_name} & ${wedding.groom_name}`
                : wedding?.title ?? 'Düğünüm'}
            </h1>
          </div>
        </div>

        <div className="px-7 py-5 flex flex-wrap items-center gap-5">
          {wedding?.event_date && (
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <Calendar size={14} className="text-rose-400 shrink-0" />
              {new Date(wedding.event_date).toLocaleDateString('tr-TR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
          )}
          {wedding?.venue && (
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <MapPin size={14} className="text-rose-400 shrink-0" />
              {wedding.venue}
            </div>
          )}
          <div className="flex items-center gap-2 text-stone-500 text-sm ml-auto">
            <Images size={14} className="text-stone-400 shrink-0" />
            {totalPhotos} fotoğraf
          </div>
        </div>
      </div>

      {/* QR Kodlar — en üstte */}
      {tokens.length > 0 && (
        <section className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-lg text-stone-900">Misafir QR Kodları</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Bu kodları misafirlerinizle paylaşın — fotoğraf yüklesinler
              </p>
            </div>
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
              <QrCode size={16} className="text-violet-500" />
            </div>
          </div>
          <div className="px-7 py-5">
            <CoupleQrList tokens={tokens} albums={albums} appUrl={appUrl} />
          </div>
        </section>
      )}

      {/* Fotoğraflar — direkt görünür */}
      <section className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-lg text-stone-900">Fotoğraflar</h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {totalPhotos > 0 ? `${totalPhotos} fotoğraf · ${albums.length} albüm` : 'Henüz fotoğraf yok'}
            </p>
          </div>
        </div>

        <div className="px-7 py-6 space-y-8">
          <CoupleGallerySection
            albums={albumsWithMedia}
            favSet={favSet}
            weddingId={weddingId}
          />
        </div>
      </section>

    </div>
  )
}
