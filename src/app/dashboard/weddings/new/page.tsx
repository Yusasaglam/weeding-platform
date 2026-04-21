import { createWedding } from '@/lib/actions/weddings'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewWeddingPage() {
  return (
    <div>
      <Link
        href="/dashboard/weddings"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8"
      >
        <ChevronLeft size={14} /> Düğünler
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-4xl text-stone-900 mb-2">Yeni Düğün</h1>
        <p className="text-stone-400 text-sm">Düğün bilgilerini doldurun, galeri otomatik oluşturulacak.</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
          <form action={createWedding} className="space-y-6">
            <Field id="title" label="Başlık" placeholder="Örn: Ayşe & Mehmet Düğünü" required />
            <div className="grid grid-cols-2 gap-4">
              <Field id="bride_name" label="Gelin" placeholder="Gelin adı" />
              <Field id="groom_name" label="Damat" placeholder="Damat adı" />
            </div>
            <Field id="event_date" label="Düğün Tarihi" type="date" />
            <Field id="venue" label="Mekan" placeholder="Düğün salonu, şehir…" />
            <div className="pt-2 flex items-center gap-4">
              <button
                type="submit"
                className="px-7 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm shadow-rose-100"
              >
                Düğünü Oluştur
              </button>
              <Link href="/dashboard/weddings" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({
  id, label, placeholder, type = 'text', required,
}: {
  id: string; label: string; placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-2">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <input
        id={id} name={id} type={type} placeholder={placeholder} required={required}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
      />
    </div>
  )
}
