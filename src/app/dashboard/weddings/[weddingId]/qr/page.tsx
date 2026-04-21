import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import QrManager from '@/components/qr/QrManager'

interface Props { params: Promise<{ weddingId: string }> }

export default async function QrPage({ params }: Props) {
  const { weddingId } = await params
  const admin = createAdminClient()

  const [{ data: wedding }, { data: tokens }, { data: albums }] = await Promise.all([
    admin.from('weddings').select('id, title').eq('id', weddingId).single(),
    admin.from('guest_tokens').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: false }),
    admin.from('albums').select('id, title').eq('wedding_id', weddingId).order('sort_order'),
  ])

  if (!wedding) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return (
    <div>
      <Link href={`/dashboard/weddings/${weddingId}`} className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-4xl text-stone-900 mb-2">QR Kodlar</h1>
        <p className="text-stone-400 text-sm">Misafirler bu QR kodları tarayarak fotoğraf galerisine erişir.</p>
      </div>

      <QrManager
        weddingId={weddingId}
        tokens={tokens ?? []}
        albums={albums ?? []}
        appUrl={appUrl}
      />
    </div>
  )
}
