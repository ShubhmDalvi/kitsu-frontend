import React, { useEffect, useState } from 'react'
import Logo from './components/Logo'
import ShortenerForm from './components/ShortenerForm'
import HistoryList from './components/HistoryList'
import Blobs from './components/Blobs'
import { palette } from './styles/palette'

export default function App(){
  const [highlighted, setHighlighted] = useState(null)
  const [history, setHistory] = useState(() => {
    try{
      return JSON.parse(localStorage.getItem('shortHistory')||'[]')
    }catch(e){ return [] }
  })

  useEffect(()=>{
    localStorage.setItem('shortHistory', JSON.stringify(history))
  },[history])

  function addToHistory(item){
    setHistory(prev => {
      const next = [item, ...prev.filter(i=>i.shortCode !== item.shortCode)]
      return next
    })
    setHighlighted(item)
  }

  function removeFromHistory(shortCode){
    setHistory(prev => prev.filter(i=>i.shortCode !== shortCode))
    if(highlighted?.shortCode === shortCode) setHighlighted(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Blobs />
      {/* added z-10 so main content sits above the fixed background */}
      <main className="relative z-10 w-full max-w-lg p-6 md:p-10 rounded-lg border-motif grain" style={{background: palette.sand}} aria-live="polite">
        <header className="mb-6 text-center">
          <Logo />
          <p className="mt-3 text-sm text-[var(--ink)]/80">Kitsu - elegant, minimal link shortener</p>
        </header>

        <ShortenerForm onCreate={addToHistory} highlighted={highlighted} setHighlighted={setHighlighted} />

        <section aria-label="History" className="mt-8">
          <h2 className="text-lg font-semibold mb-3">History</h2>
          <HistoryList items={history} onDelete={removeFromHistory} onUpdate={setHistory} />
        </section>

        <footer className="mt-6 text-xs text-[var(--ink)]/70 text-center">Built with ❤️ - <a href="https://github.com/ShubhmDalvi">Shubham</a> - <a href="https://github.com/ShubhmDalvi/kitsu">github.com/ShubhmDalvi/kitsu</a></footer>
      </main>
    </div>
  )
}
