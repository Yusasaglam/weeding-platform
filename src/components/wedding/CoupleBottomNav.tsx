'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Images, Heart } from 'lucide-react'

interface Props { weddingId: string }

export default function CoupleBottomNav({ weddingId }: Props) {
  const pathname = usePathname()
  const isGallery = pathname === `/wedding/${weddingId}`
  const isFavorites = pathname.includes('/favorites')

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 safe-area-pb">
      <div className="grid grid-cols-2 max-w-sm mx-auto">
        <Link
          href={`/wedding/${weddingId}`}
          className={`flex flex-col items-center gap-1 py-3 transition-colors ${
            isGallery ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'
          }`}
        >
          <Images size={22} strokeWidth={isGallery ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">Galeri</span>
        </Link>
        <Link
          href={`/wedding/${weddingId}/favorites`}
          className={`flex flex-col items-center gap-1 py-3 transition-colors ${
            isFavorites ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'
          }`}
        >
          <Heart size={22} strokeWidth={isFavorites ? 2 : 1.5} fill={isFavorites ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-medium tracking-wide">Favoriler</span>
        </Link>
      </div>
    </nav>
  )
}
