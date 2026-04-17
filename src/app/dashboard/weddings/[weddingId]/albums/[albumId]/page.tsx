import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload } from 'lucide-react'
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
    <div className="max-w-5xl">
      <Link href={`/dashboard/weddings/${weddingId}`} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{album.title}</h1>
          {album.description && <p className="text-stone-500 text-sm mt-1">{album.description}</p>}
          <div className="mt-2"><VisibilityBadge visibility={album.visibility} /></div>
        </div>
        <Link href={`/dashboard/weddings/${weddingId}/uploads?albumId=${albumId}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Upload size={14} /> Medya Yükle
        </Link>
      </div>

      {!mediaFiles || mediaFiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 px-8 py-16 text-center mb-8">
          <p className="text-sm text-stone-400">Bu albümde henüz medya yok.</p>
          <Link href={`/dashboard/weddings/${weddingId}/uploads?albumId=${albumId}`}
            className="mt-3 inline-block text-sm text-stone-700 underline underline-offset-2">
            Fotoğraf & video yükle
          </Link>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-sm text-stone-500 mb-4">{mediaFiles.length} dosya</p>
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
    <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden relative">
      {file.file_type === 'image' ? (
        <img
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wedding-media/${file.storage_path}`}
          alt={file.file_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl">🎬</span>
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
