'use client'

import { useTransition, useState } from 'react'
import { toggleFavorite } from '@/lib/actions/favorites'
import { Heart } from 'lucide-react'
import Lightbox from '@/components/ui/Lightbox'

interface MediaFile {
  id: string; storage_path: string; file_name: string; file_type: string
}

interface Props {
  files: MediaFile[]
  favSet: string[]
  weddingId: string
}

export default function CoupleMediaGrid({ files, favSet, weddingId }: Props) {
  const [favorites, setFavorites] = useState(new Set(favSet))
  const [pending, startTransition] = useTransition()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  function mediaUrl(path: string) {
    return `${supabaseUrl}/storage/v1/object/public/wedding-media/${path}`
  }

  function handleFav(fileId: string) {
    const isFav = favorites.has(fileId)
    setFavorites((prev) => {
      const next = new Set(prev)
      if (isFav) next.delete(fileId)
      else next.add(fileId)
      return next
    })
    startTransition(() => toggleFavorite(fileId, weddingId, isFav))
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {files.map((f, i) => {
          const isFav = favorites.has(f.id)
          return (
            <div
              key={f.id}
              className="relative group aspect-square bg-stone-100 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              {f.file_type === 'image' ? (
                <img
                  src={mediaUrl(f.storage_path)}
                  alt={f.file_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl">🎬</span>
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleFav(f.id) }}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                  isFav
                    ? 'bg-rose-500 text-white opacity-100'
                    : 'bg-white/80 text-stone-500 opacity-0 group-hover:opacity-100'
                }`}
              >
                <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>
          )
        })}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          files={files}
          index={lightboxIndex}
          supabaseUrl={supabaseUrl}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </>
  )
}
