'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { LayoutDashboard, Heart, Users, LogOut } from 'lucide-react'

interface Props {
  user: { full_name: string; email: string; role: string } | null
}

const NAV = [
  { href: '/dashboard',          label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/dashboard/weddings', label: 'Düğünler',    icon: Heart },
  { href: '/dashboard/users',    label: 'Kullanıcılar', icon: Users },
]

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex flex-col border-r border-stone-200 bg-white shrink-0">
      <div className="px-5 py-5 border-b border-stone-100">
        <p className="text-sm font-semibold text-stone-800">Wedding Platform</p>
        <p className="text-xs text-stone-400 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-stone-100 text-stone-900 font-medium'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-stone-100">
        <p className="text-xs font-medium text-stone-700 truncate">{user?.full_name || 'Admin'}</p>
        <p className="text-xs text-stone-400 truncate">{user?.email}</p>
        <form action={logout} className="mt-3">
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            <LogOut size={12} />
            Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  )
}
