'use client'

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
    <header className="sticky top-0 z-40 bg-white border-b border-stone-100">
      <div className="flex items-center justify-between px-5 py-4 max-w-4xl mx-auto">
        <span className="font-serif text-stone-900 text-lg tracking-tight">{coupleName}</span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </form>
      </div>
    </header>
  )
}
