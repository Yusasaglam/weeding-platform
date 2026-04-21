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
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-amber-400/15 border border-amber-400/30 rounded-lg flex items-center justify-center">
            <span className="text-xs text-amber-400">✦</span>
          </div>
          <span className="font-serif text-base text-white">{coupleName}</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </form>
      </div>
    </header>
  )
}
