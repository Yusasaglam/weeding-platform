import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import BulkUploader from '@/components/media/BulkUploader'

interface Props {
  params:      Promise<{ weddingId: string }>
  searchParams: Promise<{ albumId?: string }>
}

export default async function UploadsPage({ params, searchParams }: Props) {
  const { weddingId }    = await params
  const { albumId }      = await searchParams
  const admin = createAdminClient()

  const [{ data: wedding }, { data: albums }] = await Promise.all([
    admin.from('weddings').select('id, title').eq('id', weddingId).single(),
    admin.from('albums').select('id, title').eq('wedding_id', weddingId).order('sort_order'),
  ])

  if (!wedding) notFound()

  return (
    <div className="max-w-3xl">
      <Link href={`/dashboard/weddings/${weddingId}`} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Medya Yükle</h1>

      <BulkUploader
        weddingId={weddingId}
        albums={albums ?? []}
        defaultAlbumId={albumId ?? ''}
      />
    </div>
  )
}
