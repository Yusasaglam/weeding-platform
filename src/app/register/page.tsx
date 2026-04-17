import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">💍</span>
          <h1 className="font-serif text-3xl text-stone-800 mt-3">Hesap Oluştur</h1>
          <p className="text-stone-400 text-sm mt-1">Düğün galerinize erişin</p>
        </div>
        <RegisterForm />
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
