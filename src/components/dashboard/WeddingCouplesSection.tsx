'use client'

import { useState } from 'react'
import { assignCoupleToWedding, removeCoupleFromWedding } from '@/lib/actions/users'
import { UserPlus, X } from 'lucide-react'

interface User {
  id: string
  full_name: string
  email: string
}

interface Props {
  weddingId: string
  assignedCouples: User[]
  availableCouples: User[]
}

export default function WeddingCouplesSection({
  weddingId,
  assignedCouples,
  availableCouples,
}: Props) {
  const [selected, setSelected]         = useState('')
  const [loading, setLoading]           = useState(false)
  const [removingId, setRemovingId]     = useState<string | null>(null)
  const [localAssigned, setLocalAssigned] = useState(assignedCouples)
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
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="text-sm font-semibold text-stone-700">Çift Hesapları</h2>
        <p className="text-xs text-stone-400 mt-0.5">
          Bu düğüne atanmış kullanıcılar giriş yaptıklarında buraya yönlendirilir.
        </p>
      </div>

      {/* Assigned list */}
      {localAssigned.length === 0 ? (
        <div className="px-6 py-6 text-sm text-stone-400">
          Henüz atanmış çift hesabı yok.
        </div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {localAssigned.map((u) => (
            <li key={u.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-stone-800">{u.full_name || '—'}</p>
                <p className="text-xs text-stone-400">{u.email}</p>
              </div>
              <button
                onClick={() => handleRemove(u.id)}
                disabled={removingId === u.id}
                className="p-1.5 text-stone-300 hover:text-red-500 transition-colors disabled:opacity-40"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Assign new */}
      {localAvailable.length > 0 && (
        <div className="px-6 py-4 border-t border-stone-100 flex items-center gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
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
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            <UserPlus size={14} />
            {loading ? 'Atanıyor…' : 'Ata'}
          </button>
        </div>
      )}

      {localAvailable.length === 0 && localAssigned.length > 0 && (
        <div className="px-6 py-3 border-t border-stone-100 text-xs text-stone-400">
          Tüm çift hesapları bu düğüne atanmış.
        </div>
      )}

      {localAvailable.length === 0 && localAssigned.length === 0 && (
        <div className="px-6 py-3 border-t border-stone-100 text-xs text-stone-400">
          Sistemde henüz çift (couple) rolünde kullanıcı yok.{' '}
          <a href="/dashboard/users" className="underline hover:text-stone-600">
            Kullanıcılar sayfasından rol atayın.
          </a>
        </div>
      )}
    </div>
  )
}
