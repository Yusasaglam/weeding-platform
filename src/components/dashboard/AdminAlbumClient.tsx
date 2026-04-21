'use client'

import { useState } from 'react'
import { updateAlbum, deleteAlbum } from '@/lib/actions/albums'

interface Album {
  id: string; wedding_id: string; title: string; description: string; visibility: string; sort_order: number
}

export default function AdminAlbumClient({ album, weddingId }: { album: Album; weddingId: string }) {
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)
  const updateAction = updateAlbum.bind(null, album.id, weddingId)
  const deleteAction = deleteAlbum.bind(null, album.id, weddingId)

  async function handleUpdate(formData: FormData) {
    const result = await updateAction(formData)
    if (result?.error) {
      setMessage(result.error)
      setSaved(false)
    } else {
      setMessage('Değişiklikler kaydedildi.')
      setSaved(true)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-stone-100">
        <h2 className="font-serif text-lg text-stone-900">Albüm Ayarları</h2>
        <p className="text-xs text-stone-400 mt-0.5">Başlık, görünürlük ve sıralamayı düzenleyin.</p>
      </div>

      <div className="p-7">
        <form action={handleUpdate} className="space-y-5">
          <Field label="Başlık" name="title" defaultValue={album.title} required />
          <Field label="Açıklama" name="description" defaultValue={album.description} />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Görünürlük</label>
            <select
              name="visibility" defaultValue={album.visibility}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition bg-white"
            >
              <option value="private">Özel — sadece admin görebilir</option>
              <option value="couple">Çifte özel — çift de görebilir</option>
              <option value="guest">Misafire açık — herkes görebilir</option>
            </select>
          </div>
          <Field label="Sıra" name="sort_order" type="number" defaultValue={String(album.sort_order)} />

          <div className="pt-2 flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Kaydet
            </button>
            {message && (
              <span className={`text-xs font-medium ${saved ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="px-7 py-5 border-t border-stone-100 bg-stone-50/40">
        <p className="text-xs text-stone-400 mb-3">Tehlikeli Alan</p>
        <form action={deleteAction}>
          <button
            type="submit"
            className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
            onClick={(e) => { if (!confirm('Bu albümü silmek istediğinize emin misiniz? İçindeki medyalar da silinecek.')) e.preventDefault() }}
          >
            Albümü Kalıcı Olarak Sil
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, defaultValue, type = 'text', required }: {
  label: string; name: string; defaultValue?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <input
        name={name} type={type} defaultValue={defaultValue} required={required}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
      />
    </div>
  )
}
