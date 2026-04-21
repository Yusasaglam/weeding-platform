import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload, ImageIcon } from 'lucide-react'
import AdminAlbumClient from '@/components/dashboard/AdminAlbumClient'

interface Props { params: Promise<{ weddingId: string; albumId: string }> }

export default async function AlbumDetailPage({ params }: Props) {
  const { weddingId, albumId } = await params
  const admin = createAdminClient()

  const [{ data: album }, { data: wedding }, { data: mediaFiles }] = await Promise.all([
    admin.from('albums').select('*').eq('id', albumId).eq('wedding_id', weddingId).single(),
    admin.from('weddings').select('id, title').eq('id', weddingId).single(),
    admin.from('media_files').select('*').eq('album_id', albumId).order('created_at', { ascending: false }),
  ])

  if (!album || !wedding) notFound()

  return (
    <div>
      <Link href={`/dashboard/weddings/${weddingId}`} className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-1">{album.title}</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 bg-rose-300" />
            <span className="text-rose-300 text-xs">✦</span>
            <div className="h-px w-6 bg-rose-300" />
          </div>
          <div className="flex items-center gap-3">
            {album.description && <p className="text-stone-400 text-sm">{album.description}</p>}
            <VisibilityBadge visibility={album.visibility} />
          </div>
        </div>
        <Link
          href={`/dashboard/weddings/${weddingId}/uploads?albumId=${albumId}`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm shadow-rose-100 mt-1"
        >
          <Upload size={15} /> Medya Yükle
        </Link>
      </div>

      {/* Media grid */}
      {!mediaFiles || mediaFiles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-100 px-8 py-20 text-center shadow-sm mb-8">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <ImageIcon size={24} className="text-stone-300" />
          </div>
          <p className="font-serif text-xl text-stone-600 mb-2">Bu albümde henüz medya yok</p>
          <p className="text-stone-400 text-sm mb-7">Fotoğraf ve video yükleyerek galeriyi oluşturun.</p>
          <Link
            href={`/dashboard/weddings/${weddingId}/uploads?albumId=${albumId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors"
          >
            <Upload size={15} /> Fotoğraf & Video Yükle
          </Link>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-sm text-stone-400 mb-4 font-medium">{mediaFiles.length} dosya</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {mediaFiles.map((f) => (
              <MediaThumb key={f.id} file={f} />
            ))}
          </div>
        </div>
      )}

      <AdminAlbumClient album={album} weddingId={weddingId} />
    </div>
  )
}

function MediaThumb({ file }: { file: { id: string; file_name: string; file_type: string; storage_path: string } }) {
  return (
    <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden relative group">
      {file.file_type === 'image' ? (
        <img
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wedding-media/${file.storage_path}`}
          alt={file.file_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-stone-800">
          <span className="text-3xl">🎬</span>
        </div>
      )}
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
  return <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${c.style}`}>{c.label}</span>
}
