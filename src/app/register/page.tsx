import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-stone-900">WeddingLens</Link>
          <p className="text-stone-400 text-sm mt-2">Düğün galerinize erişin</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
          <RegisterForm />
        </div>
        <p className="text-center text-sm text-stone-400 mt-5">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-stone-700 font-medium hover:text-stone-900 transition-colors">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
