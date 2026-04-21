import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import BulkUploader from '@/components/media/BulkUploader'

interface Props {
  params:       Promise<{ weddingId: string }>
  searchParams: Promise<{ albumId?: string }>
}

export default async function UploadsPage({ params, searchParams }: Props) {
  const { weddingId }  = await params
  const { albumId }    = await searchParams
  const admin = createAdminClient()

  const [{ data: wedding }, { data: albums }] = await Promise.all([
    admin.from('weddings').select('id, title').eq('id', weddingId).single(),
    admin.from('albums').select('id, title').eq('wedding_id', weddingId).order('sort_order'),
  ])

  if (!wedding) notFound()

  return (
    <div>
      <Link href={`/dashboard/weddings/${weddingId}`} className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-4xl text-stone-900 mb-2">Medya Yükle</h1>
        <p className="text-stone-400 text-sm">Fotoğraf ve videolarınızı sürükleyip bırakın veya seçin.</p>
      </div>

      <div className="max-w-2xl">
        <BulkUploader
          weddingId={weddingId}
          albums={albums ?? []}
          defaultAlbumId={albumId ?? ''}
        />
      </div>
    </div>
  )
}
