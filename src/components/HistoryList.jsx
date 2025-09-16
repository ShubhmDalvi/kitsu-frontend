import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HistoryList({ items = [], onDelete, onUpdate }) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  function copy(url) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => showToast('Copied!'))
    } else {
      showToast('Copy failed')
    }
  }

  async function delItem(shortCode) {
    try {
      const res = await fetch(`${base}/shorten/${shortCode}`, { method: 'DELETE' })
      if (res.status === 204) {
        onDelete(shortCode)
        showToast('Deleted')
      } else throw new Error('Delete failed')
    } catch {
      showToast('Error deleting')
    }
  }

async function updateItem(shortCode, newUrl, setIsEditing, setLocalUrl, setUpdatedAt) {
  // assume showToast(...) and `base` variable exist in outer scope
  const value = (newUrl || '').trim()

  // Empty / whitespace check
  if (!value) {
    showToast('Please enter a URL')
    return
  }
  if (/\s/.test(value)) {
    showToast('Please enter a valid URL')
    return
  }

  // URL constructor validation & protocol check
  try {
    const parsed = new URL(value)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      showToast('Please enter a valid URL (http:// or https://)')
      return
    }
  } catch (err) {
    showToast('Please enter a valid URL')
    return
  }

  // Send PUT to update URL
  try {
    const res = await fetch(`${base}/shorten/${shortCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: value })
    })
    if (!res.ok) throw new Error('Update failed')

    const data = await res.json()
    // update local UI state
    setLocalUrl(data.url)
    if (setUpdatedAt) setUpdatedAt(data.updatedAt || new Date().toISOString())
    setIsEditing(false)

    // persist into localStorage.shortHistory (best-effort)
    try {
      const cur = JSON.parse(localStorage.getItem('shortHistory') || '[]')
      const next = cur.map(it => it.shortCode === shortCode ? { ...it, url: data.url, updatedAt: data.updatedAt || new Date().toISOString() } : it)
      localStorage.setItem('shortHistory', JSON.stringify(next))
    } catch (e) {
      // ignore localStorage errors
    }

    showToast('Updated')
  } catch (err) {
    console.error('Update failed', err)
    showToast('Error updating')
  }
}



  async function fetchStats(shortCode, setAccessCount) {
    try {
      const res = await fetch(`${base}/shorten/${shortCode}/stats`)
      if (!res.ok) throw new Error('Stats failed')
      const data = await res.json()
      setAccessCount(data.accessCount)

      showToast('Stats updated')
    } catch {
      showToast('Error fetching stats')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && <div className="text-sm text-[var(--ink)]/70">No history yet</div>}

      {items.map(it => (
        <ShortUrlCard
          key={it.shortCode}
          item={it}
          base={base}
          copy={copy}
          delItem={delItem}
          updateItem={updateItem}
          fetchStats={fetchStats}
        />
      ))}

      <AnimatePresence>
        {toast && (
          <motion.div
  key="toast"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.25 }}
  className="fixed bottom-6 inset-x-0 mx-auto w-max bg-[var(--sand)] border-motif px-4 py-2 rounded-md shadow text-center"
  role="status"
>
  {toast}
</motion.div>

        )}
      </AnimatePresence>
    </div>
  )
}

/** --- Individual Card Component --- */
function ShortUrlCard({ item, base, copy, delItem, updateItem, fetchStats }) {
  const [isEditing, setIsEditing] = useState(false)
  const [localUrl, setLocalUrl] = useState(item.url)
  const [tempUrl, setTempUrl] = useState(item.url)
  const [updatedAt, setUpdatedAt] = useState(item.updatedAt || null)
  const [accessCount, setAccessCount] = useState(item.accessCount || null)

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-md border-motif card flex flex-col gap-3"
    >
      <div className="flex-1 min-w-0">
        {!isEditing ? (
          <>
            {/* Long URL (editable view) */}
            <div className="text-sm font-medium break-all whitespace-normal">{localUrl}</div>
            <div className="text-xs text-[var(--ink)]/70 break-all whitespace-normal mt-1">
              {base}/shorten/r/{item.shortCode}
            </div>
            {updatedAt && (
              <div className="text-xs text-[var(--ink)]/60 mt-1">
                Updated at: {new Date(updatedAt).toLocaleString()}
              </div>
            )}
            {accessCount !== null && (
              <motion.div
                key={accessCount}
                initial={{ scale: 0.9, color: '#000' }}
                animate={{ scale: 1, color: 'var(--ink)' }}
                transition={{ duration: 0.3 }}
                className="text-xs text-[var(--ink)]/80 mt-1"
              >
                Accessed {accessCount} times
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            <input
              className="w-full p-2 rounded-md border-motif text-sm"
              value={tempUrl}
              onChange={e => setTempUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') updateItem(item.shortCode, tempUrl, setIsEditing, setLocalUrl, setUpdatedAt) }}
            />
          </motion.div>
        )}
      </div>

      <div className="card-row flex flex-wrap gap-2">
        {!isEditing ? (
          <>
            <button className="btn btn-ghost" onClick={() => copy(`${base}/shorten/r/${item.shortCode}`)}>Copy</button>
            <button className="btn btn-ghost" onClick={() => delItem(item.shortCode)}>Delete</button>
            <button className="btn btn-ghost" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn btn-ghost" onClick={() => fetchStats(item.shortCode, setAccessCount)}>Stats</button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => updateItem(item.shortCode, tempUrl, setIsEditing, setLocalUrl, setUpdatedAt)}>Save</button>
            <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setTempUrl(localUrl) }}>Cancel</button>
          </>
        )}
      </div>
    </motion.article>
  )
}
