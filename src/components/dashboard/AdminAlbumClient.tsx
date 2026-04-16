'use client'

import { useState } from 'react'
import { updateAlbum, deleteAlbum } from '@/lib/actions/albums'

interface Album {
  id: string; wedding_id: string; title: string; description: string; visibility: string; sort_order: number
}

export default function AdminAlbumClient({ album, weddingId }: { album: Album; weddingId: string }) {
  const [message, setMessage] = useState('')
  const updateAction = updateAlbum.bind(null, album.id, weddingId)
  const deleteAction = deleteAlbum.bind(null, album.id, weddingId)

  async function handleUpdate(formData: FormData) {
    const result = await updateAction(formData)
    if (result?.error) setMessage(result.error)
    else setMessage('Kaydedildi.')
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8">
      <h2 className="text-sm font-semibold text-stone-700 mb-6">Albüm Ayarları</h2>
      <form action={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Başlık</label>
          <input name="title" defaultValue={album.title} required
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Açıklama</label>
          <input name="description" defaultValue={album.description}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Görünürlük</label>
          <select name="visibility" defaultValue={album.visibility}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition">
            <option value="private">Özel (sadece admin)</option>
            <option value="couple">Çifte özel</option>
            <option value="guest">Misafire açık</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Sıra</label>
          <input name="sort_order" type="number" defaultValue={album.sort_order}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition" />
        </div>
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-lg transition">
            Kaydet
          </button>
          {message && <span className="text-xs text-stone-500">{message}</span>}
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-stone-100">
        <form action={deleteAction}>
          <button type="submit"
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
            onClick={(e) => { if (!confirm('Bu albümü silmek istediğinize emin misiniz?')) e.preventDefault() }}>
            Albümü Sil
          </button>
        </form>
      </div>
    </div>
  )
}
