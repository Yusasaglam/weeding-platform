'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Images, Heart, LogOut } from 'lucide-react'

interface Props {
  wedding: { title: string; bride_name: string; groom_name: string } | null
  weddingId: string
  logoutAction: () => Promise<void>
}

export default function CoupleNav({ wedding, weddingId, logoutAction }: Props) {
  const pathname = usePathname()
  const coupleName = wedding?.bride_name && wedding?.groom_name
    ? `${wedding.bride_name} & ${wedding.groom_name}`
    : 'Düğünüm'

  const navItems = [
    { href: `/wedding/${weddingId}`, label: 'Galeri', icon: Images },
    { href: `/wedding/${weddingId}/favorites`, label: 'Favoriler', icon: Heart },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="flex items-center justify-between px-5 md:px-8 h-14 max-w-4xl mx-auto">
        <span className="font-serif text-stone-900 text-base md:text-lg tracking-tight">{coupleName}</span>

        {/* Desktop nav tabs */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-stone-100 text-stone-900'
                    : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon size={14} strokeWidth={active ? 2 : 1.5} />
                {label}
              </Link>
            )
          })}
        </nav>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors px-2 py-1.5"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </form>
      </div>
    </header>
  )
}
