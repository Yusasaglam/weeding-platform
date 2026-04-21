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
      <div className="py-20 text-center border border-stone-100 rounded-2xl">
        <ImageOff size={28} className="text-stone-200 mx-auto mb-4" />
        <p className="font-serif text-xl text-stone-400">Henüz fotoğraf yok</p>
        <p className="text-stone-300 text-sm mt-1">Fotoğrafçınız yakında ekleyecek.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-10">
        {albums.map((album) => {
          if (album.media_files.length === 0) return null
          return (
            <div key={album.id}>
              {/* Album header */}
              <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-xl text-stone-900">{album.title}</h3>
                  {album.description && (
                    <p className="text-xs text-stone-400 mt-0.5">{album.description}</p>
                  )}
                </div>
                <span className="text-xs text-stone-300 shrink-0 ml-4">{album.media_files.length} fotoğraf</span>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5">
                {album.media_files.map((f, i) => {
                  const isFav = favorites.has(f.id)
                  return (
                    <div
                      key={f.id}
                      className="relative aspect-square bg-stone-50 overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setLightboxFiles(album.media_files)
                        setLightboxIndex(i)
                      }}
                    >
                      {f.file_type === 'image' ? (
                        <img
                          src={`${supabaseUrl}/storage/v1/object/public/wedding-media/${f.storage_path}`}
                          alt={f.file_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                          <span className="text-3xl">🎬</span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFav(f.id) }}
                        className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${
                          isFav
                            ? 'bg-white text-stone-900 opacity-100 shadow-sm'
                            : 'bg-white/90 text-stone-400 opacity-0 group-hover:opacity-100 shadow-sm'
                        }`}
                      >
                        <Heart size={11} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

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
