import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-white/5 text-stone-500 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10 pb-10 border-b border-white/5">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center">
                <span className="text-xs text-stone-950">✦</span>
              </div>
              <span className="font-serif text-lg text-white">WeddingLens</span>
            </Link>
            <p className="text-sm text-stone-600 max-w-xs">
              Misafirlerinizin çektiği anları tek platformda toplayın.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="text-white text-sm font-medium mb-4">Ürün</p>
              <ul className="space-y-3">
                <li><Link href="#how-it-works" className="text-sm hover:text-white transition-colors">Nasıl Çalışır?</Link></li>
                <li><Link href="#features" className="text-sm hover:text-white transition-colors">Özellikler</Link></li>
                <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Fiyatlar</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-4">Hesap</p>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-sm hover:text-white transition-colors">Giriş Yap</Link></li>
                <li><Link href="/register" className="text-sm hover:text-white transition-colors">Kayıt Ol</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-700">
          <p>© 2025 WeddingLens. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-stone-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-stone-400 transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
