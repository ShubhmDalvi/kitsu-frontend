import React from 'react'
import { motion } from 'framer-motion'
import { logoDuration } from '../config/animations'

/**
 * Bold modern Poppins wordmark with a composed reveal + micro-spring bounce.
 * Plays on every full page load.
 */
export default function Logo(){
  const letters = ['K','I','T','S','U']
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, when: 'beforeChildren' } }
  }
  const letter = {
    hidden: { y: 10, opacity: 0, skewY: 6 },
    show: (i) => ({
      y: 0,
      opacity: 1,
      skewY: 0,
      transition: { duration: logoDuration * 0.28, ease: [0.2,0.8,0.2,1], delay: i * 0.02 }
    })
  }

  return (
    <motion.h1 initial="hidden" animate="show" variants={container} className="flex items-end justify-center">
      <motion.span aria-hidden="true" className="sr-only">Kitsu</motion.span>
      <div className="flex items-end gap-1 select-none" style={{fontFamily: 'Poppins, system-ui, sans-serif'}}>
        {letters.map((L,i)=>(
          <motion.span
            key={i}
            custom={i}
            variants={letter}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            aria-hidden="true"
            style={{lineHeight:1}}
          >
            {L}
          </motion.span>
        ))}
      </div>

      {/* small spring bounce for premium feel */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ delay: logoDuration - 0.14, duration: 0.45, type: 'spring', stiffness: 280, damping: 20 }}
        aria-hidden="true"
        style={{ width: 0, height: 0 }}
      />
    </motion.h1>
  )
}
