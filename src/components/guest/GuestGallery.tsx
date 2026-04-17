'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Lightbox from '@/components/ui/Lightbox'

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
  const [lightbox, setLightbox] = useState<{ files: MediaFile[]; index: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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
      setUploadProgress(`Yükleniyor ${i + 1}/${files.length}…`)
      const fd = new FormData()
      fd.append('token', token)
      fd.append('file', file)
      const res = await fetch('/api/guest-upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { file: uploaded } = await res.json()
        if (uploaded?.id) newIds.push(uploaded.id)
      }
    }
    setMyUploadIds((prev) => {
      const updated = [...prev, ...newIds]
      try { localStorage.setItem(getStorageKey(token, guestName), JSON.stringify(updated)) } catch {}
      return updated
    })
    setUploading(false)
    setUploadProgress(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    router.refresh()
  }, [token, guestName, router])

  if (!nameConfirmed) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          {/* Ring icon */}
          <div className="mb-6">
            <span className="text-5xl">💍</span>
          </div>

          {/* Wedding names */}
          <h1 className="font-serif text-3xl text-stone-800 mb-1">
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p className="text-stone-400 text-sm mb-2">{wedding.title}</p>
          {wedding.event_date && (
            <p className="text-stone-400 text-xs mb-8">
              {new Date(wedding.event_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
            <p className="text-stone-600 text-sm mb-5">Galeriye girmek için adınızı yazın</p>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setNameConfirmed(true)}
              placeholder="Adınız Soyadınız"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition mb-4 text-center"
            />
            <button
              onClick={() => setNameConfirmed(true)}
              className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-xl transition"
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
  const allGuestFiles = guestUploadAlbum ? (mediaByAlbum[guestUploadAlbum.id] ?? []) : []
  const myFiles = allGuestFiles.filter((f) => myUploadIds.includes(f.id))
  const allRegularFiles = regularAlbums.flatMap((a) => mediaByAlbum[a.id] ?? [])

  return (
    <>
      <div className="min-h-screen bg-[#faf9f7]">
        {/* Header */}
        <header className="bg-white border-b border-stone-100 px-4 py-4 text-center">
          <p className="font-serif text-xl text-stone-800">
            {wedding.bride_name} & {wedding.groom_name}
          </p>
          <p className="text-stone-400 text-xs mt-0.5">{wedding.title}</p>
          {guestName && (
            <p className="text-stone-500 text-xs mt-1">Hoş geldiniz, {guestName} 👋</p>
          )}
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Upload butonu */}
          <div className="mb-10">
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
            {uploading ? (
              <div className="w-full py-5 rounded-2xl border border-stone-200 bg-white text-center shadow-sm">
                <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-stone-500">{uploadProgress}</p>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-5 rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-700 text-sm font-medium transition-all flex flex-col items-center gap-1.5 shadow-sm"
              >
                <span className="text-2xl">📷</span>
                <span>Fotoğraf veya Video Yükle</span>
                <span className="text-xs text-stone-400 font-normal">Birden fazla dosya seçebilirsiniz</span>
              </button>
            )}
          </div>

          {allRegularFiles.length === 0 && myFiles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-300 text-4xl mb-3">🌸</p>
              <p className="text-stone-400 text-sm">Fotoğraflar yakında yüklenecek.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Düğün albümleri */}
              {regularAlbums.map((album) => {
                const files = mediaByAlbum[album.id] ?? []
                if (files.length === 0) return null
                const offset = allRegularFiles.indexOf(files[0])
                return (
                  <section key={album.id}>
                    <div className="mb-4">
                      <h2 className="font-serif text-xl text-stone-800">{album.title}</h2>
                      {album.description && <p className="text-stone-400 text-xs mt-0.5">{album.description}</p>}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                      {files.map((f, i) => (
                        <div
                          key={f.id}
                          className="aspect-square bg-stone-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => setLightbox({ files: allRegularFiles, index: offset + i })}
                        >
                          {f.file_type === 'image' ? (
                            <img src={mediaUrl(f.storage_path)} alt={f.file_name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-stone-200">
                              <span className="text-3xl">🎬</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}

              {/* Kendi yükledikleri */}
              {myFiles.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-stone-200" />
                    <p className="text-xs text-stone-400 tracking-wider uppercase">Yüklediğiniz Fotoğraflar</p>
                    <div className="h-px flex-1 bg-stone-200" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                    {myFiles.map((f, i) => (
                      <div
                        key={f.id}
                        className="aspect-square bg-stone-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setLightbox({ files: myFiles, index: i })}
                      >
                        {f.file_type === 'image' ? (
                          <img src={mediaUrl(f.storage_path)} alt={f.file_name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-200">
                            <span className="text-3xl">🎬</span>
                          </div>
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

      {lightbox && (
        <Lightbox
          files={lightbox.files}
          index={lightbox.index}
          supabaseUrl={supabaseUrl}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox((prev) => prev ? { ...prev, index: i } : null)}
        />
      )}
    </>
  )
}
