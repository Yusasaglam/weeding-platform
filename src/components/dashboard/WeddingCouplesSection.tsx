'use client'

import { useState } from 'react'
import { assignCoupleToWedding, removeCoupleFromWedding } from '@/lib/actions/users'
import { UserPlus, X, Users } from 'lucide-react'

interface User { id: string; full_name: string; email: string }

interface Props {
  weddingId: string
  assignedCouples: User[]
  availableCouples: User[]
}

export default function WeddingCouplesSection({ weddingId, assignedCouples, availableCouples }: Props) {
  const [selected, setSelected]             = useState('')
  const [loading, setLoading]               = useState(false)
  const [removingId, setRemovingId]         = useState<string | null>(null)
  const [localAssigned, setLocalAssigned]   = useState(assignedCouples)
  const [localAvailable, setLocalAvailable] = useState(availableCouples)

  async function handleAssign() {
    if (!selected || loading) return
    const user = localAvailable.find((u) => u.id === selected)
    if (!user) return
    setLoading(true)
    const result = await assignCoupleToWedding(weddingId, selected)
    if (!result?.error) {
      setLocalAssigned((prev) => [...prev, user])
      setLocalAvailable((prev) => prev.filter((u) => u.id !== selected))
      setSelected('')
    }
    setLoading(false)
  }

  async function handleRemove(userId: string) {
    setRemovingId(userId)
    await removeCoupleFromWedding(weddingId, userId)
    const user = localAssigned.find((u) => u.id === userId)
    if (user) {
      setLocalAssigned((prev) => prev.filter((u) => u.id !== userId))
      setLocalAvailable((prev) => [...prev, user])
    }
    setRemovingId(null)
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
      <div className="px-7 py-5 border-b border-stone-100">
        <h2 className="font-serif text-lg text-stone-900">Çift Hesapları</h2>
        <p className="text-xs text-stone-400 mt-0.5">
          Atanan çiftler giriş yaptığında bu düğünün galerisine yönlendirilir.
        </p>
      </div>

      {localAssigned.length === 0 ? (
        <div className="px-7 py-10 flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
            <Users size={16} className="text-rose-300" />
          </div>
          <div>
            <p className="text-sm text-stone-500">Henüz atanmış çift hesabı yok.</p>
            <p className="text-xs text-stone-400 mt-0.5">Aşağıdan bir kullanıcı seçerek atayın.</p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-stone-50">
          {localAssigned.map((u) => (
            <li key={u.id} className="flex items-center justify-between px-7 py-4 hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-rose-500">
                    {(u.full_name || u.email)[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{u.full_name || '—'}</p>
                  <p className="text-xs text-stone-400">{u.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(u.id)}
                disabled={removingId === u.id}
                className="p-2 text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40 rounded-lg"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {localAvailable.length > 0 && (
        <div className="px-7 py-5 border-t border-stone-100 bg-stone-50/40 flex items-center gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
          >
            <option value="">Kullanıcı seç…</option>
            {localAvailable.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email} ({u.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={!selected || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            <UserPlus size={14} />
            {loading ? 'Atanıyor…' : 'Ata'}
          </button>
        </div>
      )}

      {localAvailable.length === 0 && localAssigned.length > 0 && (
        <div className="px-7 py-4 border-t border-stone-100 text-xs text-stone-400">
          Tüm çift hesapları bu düğüne atanmış.
        </div>
      )}

      {localAvailable.length === 0 && localAssigned.length === 0 && (
        <div className="px-7 py-4 border-t border-stone-100 text-xs text-stone-400">
          Sistemde henüz çift rolünde kullanıcı yok.{' '}
          <a href="/dashboard/users" className="text-rose-500 hover:text-rose-700 font-medium">
            Kullanıcılar sayfasına gidin →
          </a>
        </div>
      )}
    </div>
  )
}
