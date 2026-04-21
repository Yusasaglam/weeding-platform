'use client'

import { useState, useTransition } from 'react'
import { toggleFavorite } from '@/lib/actions/favorites'
import { Heart, ImageOff } from 'lucide-react'
import Lightbox from '@/components/ui/Lightbox'

interface MediaFile {
  id: string
  storage_path: string
  file_name: string
  file_type: string
  album_id: string
}

interface Album {
  id: string
  title: string
  description: string | null
  media_files: MediaFile[]
}

interface Props {
  albums: Album[]
  favSet: string[]
  weddingId: string
}

export default function CoupleGallerySection({ albums, favSet, weddingId }: Props) {
  const [favorites, setFavorites] = useState(new Set(favSet))
  const [lightboxFiles, setLightboxFiles] = useState<MediaFile[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [, startTransition] = useTransition()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const allMedia = albums.flatMap((a) => a.media_files)

  function handleFav(fileId: string) {
    const isFav = favorites.has(fileId)
    setFavorites((prev) => {
      const next = new Set(prev)
      isFav ? next.delete(fileId) : next.add(fileId)
      return next
    })
    startTransition(() => toggleFavorite(fileId, weddingId, isFav))
  }

  if (allMedia.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-14 h-14 bg-stone-800 border border-white/6 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageOff size={22} className="text-stone-600" />
        </div>
        <p className="font-serif text-lg text-stone-400 mb-1">Henüz fotoğraf yok</p>
        <p className="text-stone-600 text-sm">Fotoğrafçınız yakında ekleyecek.</p>
      </div>
    )
  }

  return (
    <>
      {albums.map((album) => {
        if (album.media_files.length === 0) return null
        return (
          <div key={album.id}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-base text-white">{album.title}</h3>
                {album.description && (
                  <p className="text-xs text-stone-600 mt-0.5">{album.description}</p>
                )}
              </div>
              <span className="text-xs text-stone-600 bg-stone-800 border border-white/5 px-2.5 py-1 rounded-full">
                {album.media_files.length} fotoğraf
              </span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-1 rounded-2xl overflow-hidden">
              {album.media_files.map((f, i) => {
                const isFav = favorites.has(f.id)
                return (
                  <div
                    key={f.id}
                    className="relative aspect-square bg-stone-800 overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setLightboxFiles(album.media_files)
                      setLightboxIndex(i)
                    }}
                  >
                    {f.file_type === 'image' ? (
                      <img
                        src={`${supabaseUrl}/storage/v1/object/public/wedding-media/${f.storage_path}`}
                        alt={f.file_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                        <span className="text-3xl">🎬</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleFav(f.id) }}
                      className={`absolute bottom-1.5 right-1.5 p-1.5 rounded-full transition-all shadow ${
                        isFav
                          ? 'bg-amber-400 text-stone-950 opacity-100'
                          : 'bg-stone-900/80 text-stone-400 opacity-100 md:opacity-0 md:group-hover:opacity-100'
                      }`}
                    >
                      <Heart size={12} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {lightboxIndex !== null && lightboxFiles.length > 0 && (
        <Lightbox
          files={lightboxFiles}
          index={lightboxIndex}
          supabaseUrl={supabaseUrl}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </>
  )
}
