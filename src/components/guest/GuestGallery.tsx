'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Album { id: string; title: string; description: string; is_guest_uploads: boolean }
interface MediaFile { id: string; storage_path: string; file_name: string; file_type: string }
interface Wedding { id: string; title: string; bride_name: string; groom_name: string; event_date: string | null; venue: string }

interface Props {
  wedding: Wedding
  albums: Album[]
  mediaByAlbum: Record<string, MediaFile[]>
  supabaseUrl: string
  token: string
}

function getStorageKey(token: string, name: string) {
  return `guest_uploads_${token}_${name.trim().toLowerCase()}`
}

export default function GuestGallery({ wedding, albums, mediaByAlbum, supabaseUrl, token }: Props) {
  const [guestName, setGuestName] = useState('')
  const [nameConfirmed, setNameConfirmed] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [myUploadIds, setMyUploadIds] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // LocalStorage'dan bu isim+token'ın yüklediği foto ID'lerini al
  useEffect(() => {
    if (!nameConfirmed || !guestName.trim()) return
    try {
      const stored = localStorage.getItem(getStorageKey(token, guestName))
      if (stored) setMyUploadIds(JSON.parse(stored))
    } catch {}
  }, [nameConfirmed, guestName, token])

  function mediaUrl(path: string) {
    return `${supabaseUrl}/storage/v1/object/public/wedding-media/${path}`
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setUploading(true)
    const newIds: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Yükleniyor ${i + 1}/${files.length}: ${file.name}`)

      const fd = new FormData()
      fd.append('token', token)
      fd.append('file', file)

      const res = await fetch('/api/guest-upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { file: uploaded } = await res.json()
        if (uploaded?.id) newIds.push(uploaded.id)
      }
    }

    // Bu cihazın yüklediği ID'leri kaydet
    setMyUploadIds((prev) => {
      const updated = [...prev, ...newIds]
      try { localStorage.setItem(getStorageKey(token, guestName), JSON.stringify(updated)) } catch {}
      return updated
    })

    setUploading(false)
    setUploadProgress(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    router.refresh()
  }, [token, router])

  if (!nameConfirmed) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center">
            <div className="text-3xl mb-4">💍</div>
            <h1 className="text-xl font-semibold text-stone-800 mb-1">{wedding.title}</h1>
            <p className="text-stone-500 text-sm mb-6">
              {wedding.bride_name} & {wedding.groom_name}
            </p>
            <p className="text-stone-600 text-sm mb-4">Galeriye girmek için adınızı yazın</p>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setNameConfirmed(true)}
              placeholder="Adınız (opsiyonel)"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition mb-4"
            />
            <button
              onClick={() => setNameConfirmed(true)}
              className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-lg transition"
            >
              Galeriye Gir
            </button>
          </div>
        </div>
      </div>
    )
  }

  const regularAlbums = albums.filter((a) => !a.is_guest_uploads)
  const guestUploadAlbum = albums.find((a) => a.is_guest_uploads)

  // Sadece bu cihazdan yüklenen fotoğraflar
  const allGuestFiles = guestUploadAlbum ? (mediaByAlbum[guestUploadAlbum.id] ?? []) : []
  const myFiles = allGuestFiles.filter((f) => myUploadIds.includes(f.id))

  const regularTotal = regularAlbums.reduce((s, a) => s + (mediaByAlbum[a.id]?.length ?? 0), 0)

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-4 py-5 text-center">
        <h1 className="text-lg font-semibold text-stone-800">{wedding.title}</h1>
        <p className="text-stone-400 text-sm">{wedding.bride_name} & {wedding.groom_name}</p>
        {guestName && (
          <p className="text-stone-500 text-sm mt-1">Hoş geldiniz, {guestName} 👋</p>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Upload butonu */}
        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          {uploading ? (
            <div className="w-full py-4 rounded-2xl border border-stone-200 bg-white text-center">
              <p className="text-sm text-stone-500">{uploadProgress ?? 'Yükleniyor...'}</p>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 rounded-2xl border border-dashed border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-800 text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <span className="text-lg">📷</span>
              Fotoğraf / Video Yükle
            </button>
          )}
        </div>

        {regularTotal === 0 && myFiles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm">Henüz fotoğraf yok.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Düğün fotoğrafları */}
            {regularAlbums.map((album) => {
              const files = mediaByAlbum[album.id] ?? []
              if (files.length === 0) return null
              return (
                <section key={album.id}>
                  <h2 className="text-base font-semibold text-stone-800 mb-1">{album.title}</h2>
                  {album.description && <p className="text-stone-400 text-sm mb-4">{album.description}</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {files.map((f) => (
                      <div key={f.id} className="aspect-square bg-stone-100 rounded-xl overflow-hidden">
                        {f.file_type === 'image' ? (
                          <img src={mediaUrl(f.storage_path)} alt={f.file_name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <video src={mediaUrl(f.storage_path)} className="w-full h-full object-cover" controls />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}

            {/* Bu cihazdan yüklenen fotoğraflar */}
            {myFiles.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-stone-200" />
                  <span className="text-xs text-stone-400 font-medium">Yüklediğiniz Fotoğraflar</span>
                  <div className="h-px flex-1 bg-stone-200" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {myFiles.map((f) => (
                    <div key={f.id} className="aspect-square bg-stone-100 rounded-xl overflow-hidden">
                      {f.file_type === 'image' ? (
                        <img src={mediaUrl(f.storage_path)} alt={f.file_name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <video src={mediaUrl(f.storage_path)} className="w-full h-full object-cover" controls />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
