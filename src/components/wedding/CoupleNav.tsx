'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'

interface Props {
  wedding: { title: string; bride_name: string; groom_name: string } | null
  weddingId: string
  logoutAction: () => Promise<void>
}

export default function CoupleNav({ wedding, weddingId, logoutAction }: Props) {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          {wedding?.bride_name && wedding?.groom_name ? (
            <p className="font-serif text-lg text-stone-800 leading-tight">
              {wedding.bride_name} & {wedding.groom_name}
            </p>
          ) : (
            <p className="font-serif text-lg text-stone-800">Düğünüm</p>
          )}
          {wedding?.title && (
            <p className="text-xs text-stone-400 mt-0.5">{wedding.title}</p>
          )}
        </div>

        <nav className="flex items-center gap-5">
          <Link
            href={`/wedding/${weddingId}`}
            className={`text-sm transition-colors ${
              pathname === `/wedding/${weddingId}`
                ? 'text-stone-900 font-medium'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Galeri
          </Link>
          <Link
            href={`/wedding/${weddingId}/favorites`}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              pathname.includes('/favorites')
                ? 'text-rose-500 font-medium'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Heart size={13} fill={pathname.includes('/favorites') ? 'currentColor' : 'none'} />
            Favoriler
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-stone-300 hover:text-stone-600 transition-colors">
              Çıkış
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
