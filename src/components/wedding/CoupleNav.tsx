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
    <header className="bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-800">{wedding?.title ?? 'Düğünüm'}</p>
          {wedding?.bride_name && wedding?.groom_name && (
            <p className="text-xs text-stone-400">{wedding.bride_name} & {wedding.groom_name}</p>
          )}
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href={`/wedding/${weddingId}`}
            className={`text-sm transition-colors ${pathname === `/wedding/${weddingId}` ? 'text-stone-900 font-medium' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Galeri
          </Link>
          <Link
            href={`/wedding/${weddingId}/favorites`}
            className={`flex items-center gap-1 text-sm transition-colors ${pathname.includes('/favorites') ? 'text-rose-600 font-medium' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <Heart size={13} /> Favoriler
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
              Çıkış
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
