'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { LayoutDashboard, Heart, Users, LogOut } from 'lucide-react'

interface Props {
  user: { full_name: string; email: string; role: string } | null
}

const NAV = [
  { href: '/dashboard',          label: 'Genel Bakış',  icon: LayoutDashboard },
  { href: '/dashboard/weddings', label: 'Düğünler',     icon: Heart },
  { href: '/dashboard/users',    label: 'Kullanıcılar', icon: Users },
]

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-60 flex flex-col border-r border-stone-100 bg-white shrink-0">

      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-stone-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-sm">💍</span>
          </div>
          <span className="font-serif text-lg text-stone-900">WeddingLens</span>
        </Link>
        <p className="text-[11px] text-stone-400 mt-2 ml-0.5">Admin Paneli</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-[10px] font-semibold text-stone-300 uppercase tracking-widest px-3 mb-3">Menü</p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-stone-100">
        <div className="bg-stone-50 rounded-2xl px-4 py-3.5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-linear-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">
                {(user?.full_name || user?.email || 'A')[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-800 truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors w-full"
            >
              <LogOut size={11} />
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>

    </aside>
  )
}
