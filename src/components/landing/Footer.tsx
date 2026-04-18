import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-10 border-b border-stone-800">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <span className="text-xl">💍</span>
              <span className="font-serif text-xl text-white">WeddingLens</span>
            </Link>
            <p className="text-sm text-stone-500 max-w-xs">
              Misafirlerinizin çektiği anları tek platformda toplayın.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-white text-sm font-medium mb-3">Ürün</p>
              <ul className="space-y-2">
                <li><Link href="#how-it-works" className="text-sm hover:text-white transition-colors">Nasıl Çalışır?</Link></li>
                <li><Link href="#features" className="text-sm hover:text-white transition-colors">Özellikler</Link></li>
                <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Fiyatlar</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-3">Hesap</p>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-sm hover:text-white transition-colors">Giriş Yap</Link></li>
                <li><Link href="/register" className="text-sm hover:text-white transition-colors">Kayıt Ol</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-600">
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
