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
    <div className="max-w-4xl">
      <Link href={`/dashboard/weddings/${weddingId}`} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft size={14} /> {wedding.title}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">QR Kodlar</h1>
        <p className="text-stone-500 text-sm mt-1">Misafirler bu QR kodları tarayarak galeriye erişir.</p>
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
