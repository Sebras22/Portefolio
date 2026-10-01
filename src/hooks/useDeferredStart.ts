import { useEffect, useState } from 'react'

const EVENTS = ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const

export function useDeferredStart(enabled: boolean, delayMs: number) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!enabled || started) return

    let timer = 0
    const start = () => {
      cleanup()
      setStarted(true)
    }
    const arm = () => {
      timer = window.setTimeout(start, delayMs)
    }
    const cleanup = () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', arm)
      for (const type of EVENTS) window.removeEventListener(type, start)
    }

    for (const type of EVENTS) window.addEventListener(type, start, { passive: true, once: true })
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
    return cleanup
  }, [enabled, started, delayMs])

  return started
}
