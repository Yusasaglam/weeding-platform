'use client'

import { useState } from 'react'

interface Album { id: string; title: string; description: string }
interface MediaFile { id: string; storage_path: string; file_name: string; file_type: string }
interface Wedding { id: string; title: string; bride_name: string; groom_name: string; event_date: string | null; venue: string }

interface Props {
  wedding: Wedding
  albums: Album[]
  mediaByAlbum: Record<string, MediaFile[]>
  supabaseUrl: string
}

export default function GuestGallery({ wedding, albums, mediaByAlbum, supabaseUrl }: Props) {
  const [guestName, setGuestName] = useState('')
  const [nameConfirmed, setNameConfirmed] = useState(false)

  function mediaUrl(path: string) {
    return `${supabaseUrl}/storage/v1/object/public/wedding-media/${path}`
  }

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
              onKeyDown={(e) => e.key === 'Enter' && guestName.trim() && setNameConfirmed(true)}
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

  const totalPhotos = Object.values(mediaByAlbum).reduce((s, f) => s + f.length, 0)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-5 text-center">
        <h1 className="text-lg font-semibold text-stone-800">{wedding.title}</h1>
        <p className="text-stone-400 text-sm">{wedding.bride_name} & {wedding.groom_name}</p>
        {guestName && (
          <p className="text-stone-500 text-sm mt-1">Hoş geldiniz, {guestName} 👋</p>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {totalPhotos === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm">Henüz fotoğraf yok.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {albums.map((album) => {
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
                          <img
                            src={mediaUrl(f.storage_path)}
                            alt={f.file_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl">🎬</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
