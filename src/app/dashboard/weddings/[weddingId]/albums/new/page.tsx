import { createAlbum } from '@/lib/actions/albums'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props { params: Promise<{ weddingId: string }> }

export default async function NewAlbumPage({ params }: Props) {
  const { weddingId } = await params
  const action = createAlbum.bind(null, weddingId)

  return (
    <div>
      <Link href={`/dashboard/weddings/${weddingId}/albums`} className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ChevronLeft size={14} /> Albümler
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-4xl text-stone-900 mb-2">Yeni Albüm</h1>
        <p className="text-stone-400 text-sm">Fotoğraflarınızı kategorize etmek için albüm oluşturun.</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
          <form action={action} className="space-y-6">
            <Field name="title" label="Başlık" placeholder="Albüm adı" required />
            <Field name="description" label="Açıklama" placeholder="Kısa açıklama (opsiyonel)" />
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-stone-700 mb-2">Görünürlük</label>
              <select
                id="visibility" name="visibility" defaultValue="private"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition bg-white"
              >
                <option value="private">Özel — sadece admin görebilir</option>
                <option value="couple">Çifte özel — çift de görebilir</option>
                <option value="guest">Misafire açık — herkes görebilir</option>
              </select>
            </div>
            <Field name="sort_order" label="Sıra" type="number" placeholder="0" />
            <div className="pt-2 flex items-center gap-4">
              <button
                type="submit"
                className="px-7 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm shadow-rose-100"
              >
                Albümü Oluştur
              </button>
              <Link href={`/dashboard/weddings/${weddingId}/albums`} className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({
  name, label, placeholder, type = 'text', required,
}: {
  name: string; label: string; placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-stone-700 mb-2">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <input
        id={name} name={name} type={type} placeholder={placeholder} required={required}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
      />
    </div>
  )
}
