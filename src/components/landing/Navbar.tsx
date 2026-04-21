'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-stone-950/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center">
            <span className="text-sm">✦</span>
          </div>
          <span className="font-serif text-xl text-white">WeddingLens</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm text-stone-400 hover:text-white transition-colors">Nasıl Çalışır?</Link>
          <Link href="#features" className="text-sm text-stone-400 hover:text-white transition-colors">Özellikler</Link>
          <Link href="/pricing" className="text-sm text-stone-400 hover:text-white transition-colors">Fiyatlar</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-stone-400 hover:text-white transition-colors px-4 py-2"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="text-sm bg-amber-400 hover:bg-amber-300 text-stone-950 px-5 py-2.5 rounded-full font-semibold transition-colors"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </div>
    </nav>
  )
}
