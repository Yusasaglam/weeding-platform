'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'Nasıl Çalışır?' },
  { href: '#features', label: 'Özellikler' },
  { href: '/pricing', label: 'Fiyatlar' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-stone-100 shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-6xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-stone-900 tracking-tight shrink-0">
            WeddingLens
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="text-sm text-stone-400 hover:text-stone-800 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Link href="/login" className="hidden sm:inline text-sm text-stone-500 hover:text-stone-900 transition-colors px-4 py-2">
              Giriş Yap
            </Link>
            <Link href="/register" className="hidden sm:inline-flex items-center text-sm bg-stone-900 hover:bg-stone-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors">
              Başla
            </Link>
            <button
              className="md:hidden p-2 -mr-1 text-stone-500 hover:text-stone-900 transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white shadow-2xl rounded-b-3xl overflow-hidden">
            <div className="flex items-center justify-between px-5 h-16 border-b border-stone-100">
              <span className="font-serif text-xl text-stone-900">WeddingLens</span>
              <button onClick={() => setOpen(false)} className="p-2 -mr-1 text-stone-400 hover:text-stone-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="px-3 py-3">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3.5 text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-xl font-medium text-base transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="px-5 pb-8 pt-2 space-y-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-3.5 border border-stone-200 text-stone-700 font-medium rounded-full hover:bg-stone-50 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-3.5 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-700 transition-colors"
              >
                Başla
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
