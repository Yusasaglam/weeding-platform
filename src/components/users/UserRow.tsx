'use client'

import { useState } from 'react'
import { updateUserRole } from '@/lib/actions/users'
import Link from 'next/link'

interface Props {
  user: { id: string; full_name: string; email: string; role: string; created_at: string }
  weddings: { id: string; title: string }[]
  userAssignments: { wedding_id: string; title: string }[]
  currentUserId: string
}

const ROLE_STYLE: Record<string, string> = {
  admin:  'bg-violet-50 text-violet-700',
  couple: 'bg-rose-50 text-rose-600',
}
const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin', couple: 'Çift',
}

export default function UserRow({ user, weddings, userAssignments, currentUserId }: Props) {
  const [loading, setLoading] = useState(false)
  const isSelf = user.id === currentUserId

  async function handleRoleChange(role: string) {
    if (isSelf) return
    setLoading(true)
    await updateUserRole(user.id, role as 'admin' | 'couple')
    setLoading(false)
  }

  return (
    <tr className="hover:bg-stone-50 transition-colors align-middle">
      {/* Name / email */}
      <td className="px-6 py-4">
        <p className="font-medium text-stone-800">
          {user.full_name || '—'}
          {isSelf && <span className="ml-1.5 text-xs text-stone-400">(sen)</span>}
        </p>
        <p className="text-xs text-stone-400">{user.email}</p>
      </td>

      {/* Role badge */}
      <td className="px-6 py-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_STYLE[user.role] ?? 'bg-stone-100 text-stone-500'}`}>
          {ROLE_LABEL[user.role] ?? user.role}
        </span>
      </td>

      {/* Assigned weddings (read-only here — managed from wedding page) */}
      <td className="px-6 py-4">
        {userAssignments.length === 0 ? (
          <span className="text-xs text-stone-400">—</span>
        ) : (
          <div className="space-y-1">
            {userAssignments.map((a) => (
              <Link
                key={a.wedding_id}
                href={`/dashboard/weddings/${a.wedding_id}`}
                className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2 block"
              >
                {a.title}
              </Link>
            ))}
          </div>
        )}
      </td>

      {/* Change role dropdown */}
      <td className="px-6 py-4">
        {isSelf ? (
          <span className="text-xs text-stone-400">—</span>
        ) : (
          <select
            defaultValue={user.role}
            disabled={loading}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400 disabled:opacity-50"
          >
            <option value="couple">Çift</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </td>
    </tr>
  )
}
