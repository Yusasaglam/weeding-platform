import { createWedding } from '@/lib/actions/weddings'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewWeddingPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/weddings" className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft size={14} /> Düğünler
      </Link>

      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Yeni Düğün</h1>

      <div className="bg-white rounded-2xl border border-stone-200 p-8">
        <form action={createWedding} className="space-y-5">
          <Field id="title" label="Başlık *" placeholder="Örn: Ayşe & Mehmet Düğünü" required />
          <div className="grid grid-cols-2 gap-4">
            <Field id="bride_name" label="Gelin" placeholder="Gelin adı" />
            <Field id="groom_name" label="Damat" placeholder="Damat adı" />
          </div>
          <Field id="event_date" label="Tarih" type="date" />
          <Field id="venue" label="Mekan" placeholder="Düğün salonu, şehir…" />
          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Düğünü Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ id, label, placeholder, type = 'text', required }: {
  id: string; label: string; placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      <input
        id={id} name={id} type={type} placeholder={placeholder} required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
      />
    </div>
  )
}
