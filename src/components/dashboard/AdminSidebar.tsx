'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { LayoutDashboard, Heart, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

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
  const [open, setOpen] = useState(false)

  const initial = (user?.full_name || user?.email || 'A')[0].toUpperCase()

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-stone-100 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-sm">💍</span>
          </div>
          <span className="font-serif text-lg text-stone-900">WeddingLens</span>
        </Link>
        <button className="md:hidden text-stone-400 hover:text-stone-700" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
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
              onClick={() => setOpen(false)}
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
              <span className="text-white text-xs font-semibold">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-800 truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors w-full">
              <LogOut size={11} /> Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-stone-100 bg-white shrink-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-100 flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xs">💍</span>
          </div>
          <span className="font-serif text-base text-stone-900">WeddingLens</span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
