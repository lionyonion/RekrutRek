import { useState, useCallback } from 'react'

/**
 * Hook untuk menandai notifikasi yang sudah dibaca (disimpan di localStorage).
 * Badge hanya menghitung notifikasi yang BELUM dibaca.
 *
 * @param {string} storageKey - kunci unik per role, mis. "notif_read_jobseeker"
 */
export function useReadNotifs(storageKey) {
  const [readIds, setReadIds] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return new Set(raw ? JSON.parse(raw) : [])
    } catch {
      return new Set()
    }
  })

  // Hitung berapa notif yang belum dibaca dari daftar id saat ini
  const unreadCount = useCallback(
    (ids) => ids.filter((id) => !readIds.has(String(id))).length,
    [readIds]
  )

  // Tandai semua id sebagai sudah dibaca
  const markAllRead = useCallback(
    (ids) => {
      setReadIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.add(String(id)))
        try {
          localStorage.setItem(storageKey, JSON.stringify([...next]))
        } catch { /* ignore */ }
        return next
      })
    },
    [storageKey]
  )

  return { unreadCount, markAllRead }
}
