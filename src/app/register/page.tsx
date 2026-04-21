import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-xl text-amber-400">✦</span>
          </div>
          <h1 className="font-serif text-3xl text-white mt-3">Hesap Oluştur</h1>
          <p className="text-stone-500 text-sm mt-1">Düğün galerinize erişin</p>
        </div>
        <div className="bg-stone-900 border border-white/8 rounded-3xl p-6">
          <RegisterForm />
        </div>
        <p className="text-center text-sm text-stone-600 mt-5">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-amber-400 font-medium hover:text-amber-300 transition-colors">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
