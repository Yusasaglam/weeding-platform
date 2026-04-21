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
      scrolled ? 'bg-white border-b border-stone-100 shadow-sm' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-stone-900 tracking-tight">
          WeddingLens
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm text-stone-400 hover:text-stone-800 transition-colors">Nasıl Çalışır?</Link>
          <Link href="#features" className="text-sm text-stone-400 hover:text-stone-800 transition-colors">Özellikler</Link>
          <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-800 transition-colors">Fiyatlar</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition-colors px-4 py-2">
            Giriş Yap
          </Link>
          <Link href="/register" className="text-sm bg-stone-900 hover:bg-stone-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors">
            Ücretsiz Başla
          </Link>
        </div>
      </div>
    </nav>
  )
}
