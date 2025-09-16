import React, { useEffect } from 'react'

/**
 * Sakura Paper Drift Background (tuned colors)
 * - Layered flowing wave bands (now slightly more visible but still subtle)
 * - Pulsing halftone dots overlay
 * - Occasional sparkles fading in/out
 * - Runs in infinite loop via anime.js
 * - Covers full screen (position: fixed)
 *
 * Minimal changes from the provided version:
 * - container is position: fixed so it always covers viewport
 * - band opacity increased slightly so colors read better against the page
 * - sparkles use a lighter tone to be visible without overpowering
 */

export default function Blobs(){
  useEffect(() => {
    const TAG = 'data-kitsu-bg'
    document.querySelectorAll(`[${TAG}]`).forEach(n => n.remove())

    const container = document.createElement('div')
    container.setAttribute(TAG, 'true')
    Object.assign(container.style, {
      position: 'fixed',            // full-viewport and non-clipping
      inset: '0',
      pointerEvents: 'none',
      zIndex: '-9999',
      overflow: 'hidden',
      background: 'var(--sand)' // fallback solid
    })

    // Create layered wave bands
    const waveCount = 3
    const waves = []
    for(let i=0;i<waveCount;i++){
      const band = document.createElement('div')
      Object.assign(band.style, {
        position: 'absolute',
        top: `${i*30}%`,
        left: '0',
        width: '200%',
        height: '40%',
        background: i % 2 === 0 ? 'var(--rose)' : 'var(--mint)',
        opacity: 0.28,              // increased slightly so bands are more viewable
        borderRadius: '50%',
        transform: `translateX(-50%) scale(1.2)`,
        willChange: 'transform, opacity'
      })
      container.appendChild(band)
      waves.push(band)
    }

    // Halftone dots overlay
    const dots = document.createElement('div')
    Object.assign(dots.style, {
      position: 'absolute',
      inset: '0',
      backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
      backgroundSize: '12px 12px',
      opacity: 0.12,              // slightly lowered so texture is subtle
      willChange: 'opacity'
    })
    container.appendChild(dots)

    // Sparkles
    const sparkleCount = 8
    const sparkles = []
    for(let i=0;i<sparkleCount;i++){
      const sp = document.createElement('div')
      Object.assign(sp.style, {
        position: 'absolute',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)', // lighter sparkle for visibility
        opacity: '0',
        left: `${Math.random()*100}%`,
        top: `${Math.random()*100}%`,
        willChange: 'opacity, transform'
      })
      container.appendChild(sp)
      sparkles.push(sp)
    }

    document.body.appendChild(container)

    // --- ANIMATIONS ---
    if(typeof window.anime === 'function'){
      console.log('Starting Sakura Paper Drift background (tuned colors)')

      // waves gently oscillate horizontally
      window.anime({
        targets: waves,
        translateX: [
          { value: '-10%', duration: 8000 },
          { value: '10%', duration: 8000 }
        ],
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
        delay: window.anime.stagger(2000)
      })

      // dots pulsing opacity
      window.anime({
        targets: dots,
        opacity: [
          { value: 0.06, duration: 6000 }, // slightly more subtle low value
          { value: 0.16, duration: 6000 }
        ],
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
      })

      // sparkles fade in/out occasionally
      sparkles.forEach((sp, i) => {
        window.anime({
          targets: sp,
          opacity: [
            { value: 0, duration: 0 },
            { value: 0.9, duration: 1200 },
            { value: 0, duration: 1600 }
          ],
          easing: 'easeInOutSine',
          loop: true,
          delay: 2000 * i,
          duration: 6000
        })
      })
    } else {
      console.error('anime.js not loaded — background static.')
    }

    // cleanup
    return () => {
      const el = document.querySelector(`[${TAG}]`)
      if(el) el.remove()
    }
  }, [])

  return null
}
