import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-stone-900">WeddingLens</Link>
          <p className="text-stone-400 text-sm mt-2">Hesabınıza giriş yapın</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
          <LoginForm />
        </div>
        <p className="text-center text-sm text-stone-400 mt-5">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="text-stone-700 font-medium hover:text-stone-900 transition-colors">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
