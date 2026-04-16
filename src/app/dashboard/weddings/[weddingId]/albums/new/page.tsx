import { createAlbum } from '@/lib/actions/albums'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props { params: Promise<{ weddingId: string }> }

export default async function NewAlbumPage({ params }: Props) {
  const { weddingId } = await params
  const action = createAlbum.bind(null, weddingId)

  return (
    <div className="max-w-2xl">
      <Link href={`/dashboard/weddings/${weddingId}/albums`} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft size={14} /> Albümler
      </Link>
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Yeni Albüm</h1>

      <div className="bg-white rounded-2xl border border-stone-200 p-8">
        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1.5">Başlık *</label>
            <input id="title" name="title" required placeholder="Albüm adı"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1.5">Açıklama</label>
            <input id="description" name="description" placeholder="Kısa açıklama (opsiyonel)"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
          </div>
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-stone-700 mb-1.5">Görünürlük</label>
            <select id="visibility" name="visibility" defaultValue="private"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition">
              <option value="private">Özel (sadece admin)</option>
              <option value="couple">Çifte özel</option>
              <option value="guest">Misafire açık</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium text-stone-700 mb-1.5">Sıra</label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={0}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
          </div>
          <div className="pt-2">
            <button type="submit" className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-xl transition-colors">
              Albümü Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
