import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toastDuration } from '../config/animations'
import { palette } from '../styles/palette'

function useApi() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  async function shorten(url) {
    const res = await fetch(base + '/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    if (!res.ok) throw new Error('Network response was not ok')
    return await res.json()
  }
  async function del(shortCode) {
    const res = await fetch(base + '/shorten/' + shortCode, { method: 'DELETE' })
    if (res.status === 204) return true
    if (!res.ok) throw new Error('Delete failed')
    return true
  }
  return { shorten, del, base }
}

export default function ShortenerForm({ onCreate, highlighted, setHighlighted }) {
  const inputRef = useRef(null)
  const { shorten, base } = useApi()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function handleSubmit(e) {
  e?.preventDefault()
  setError(null)

  const value = (url || '').trim()

  // Empty check (same message as before)
  if (!value) {
    setError('Please enter a URL')
    return
  }

  // Reject any string that contains whitespace (broken URLs)
  if (/\s/.test(value)) {
    setError('Please enter a valid URL')
    return
  }

  // Validate with URL constructor and allow only http/https
  try {
    const parsed = new URL(value)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      setError('Please enter a valid URL (must start with http:// or https://)')
      return
    }
  } catch (err) {
    setError('Please enter a valid URL')
    return
  }

  setLoading(true)
  try {
    const data = await shorten(value)
    onCreate(data)
    setUrl('')
  } catch (err) {
    setError(err?.message || 'Network error')
  } finally {
    setLoading(false)
  }
}



  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setToast('Copied!')
        setTimeout(() => setToast(null), toastDuration)
      }).catch(() => fallbackCopy(text))
    } else fallbackCopy(text)
  }
  function fallbackCopy(text) {
    setToast('Copy: select and press Ctrl/Cmd+C')
    setTimeout(() => setToast(null), toastDuration)
  }

  const redirectUrl = highlighted ? `${base}/shorten/r/${highlighted.shortCode}` : ''

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="url">Long URL</label>
        <input
          id="url"
          ref={inputRef}
          aria-label="Enter a URL to shorten"
          placeholder="https://en.wikipedia.org/wiki/Anime"
          className="w-full p-3 rounded-md border-motif focus:shadow-md"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <div className="flex gap-3 flex-wrap">
          <button
            type="submit"
            className="btn btn-primary"
            aria-disabled={loading}
          >
            {loading ? 'Creating…' : 'Create short link'}
          </button>
          <button type="button" onClick={() => { setUrl('') }} className="btn btn-secondary" aria-label="Clear input">Clear</button>
        </div>
        {error && <div role="alert" className="mt-2 text-sm text-red-600">{error}</div>}
      </form>

      {/* Highlighted short-link result box */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={highlighted ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.28 }}
        className={`mt-4 p-3 rounded-md border-motif`}
        style={{
          background: `${palette.mint}`,
          display: highlighted ? 'block' : 'none'
        }}
        role="region"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3 flex-col sm:flex-row">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--ink)]/80">Your short link</div>

            {/* allow the short URL to break anywhere */}
            <div className="break-all whitespace-normal text-sm font-medium" title={redirectUrl}>
              {redirectUrl}
            </div>
          </div>

          <div className="card-row flex flex-wrap gap-2 mt-3 sm:mt-0">
            <button
              onClick={() => copyToClipboard(redirectUrl)}
              className="btn btn-ghost"
              aria-label="Copy short link"
            >
              Copy
            </button>
            <button onClick={() => setHighlighted(null)} className="btn btn-ghost" aria-label="Dismiss highlighted link">Dismiss</button>
          </div>
        </div>
        {toast && <div role="status" className="mt-2 text-sm animate-[slideFade_180ms_ease]">{toast}</div>}
      </motion.div>
    </div>
  )
}
