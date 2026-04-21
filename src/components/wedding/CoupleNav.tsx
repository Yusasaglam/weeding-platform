'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'

interface Props {
  wedding: { title: string; bride_name: string; groom_name: string } | null
  weddingId: string
  logoutAction: () => Promise<void>
}

export default function CoupleNav({ wedding, weddingId, logoutAction }: Props) {
  const coupleName = wedding?.bride_name && wedding?.groom_name
    ? `${wedding.bride_name} & ${wedding.groom_name}`
    : 'Düğünüm'

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-base">💍</span>
          <span className="font-serif text-base text-stone-900">{coupleName}</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </form>
      </div>
    </header>
  )
}
