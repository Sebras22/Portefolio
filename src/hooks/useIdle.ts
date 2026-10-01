import { useEffect, useState } from 'react'

const EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const

export function useIdle(ms: number) {
  const [state, setState] = useState({ idle: false, wakes: 0 })

  useEffect(() => {
    let idle = false
    let timer = 0

    const fallAsleep = () => {
      idle = true
      setState((s) => ({ ...s, idle: true }))
    }
    const arm = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(fallAsleep, ms)
    }
    const onActivity = () => {
      if (idle) {
        idle = false
        setState((s) => ({ idle: false, wakes: s.wakes + 1 }))
      }
      arm()
    }

    arm()
    for (const type of EVENTS) window.addEventListener(type, onActivity, { passive: true })
    return () => {
      window.clearTimeout(timer)
      for (const type of EVENTS) window.removeEventListener(type, onActivity)
    }
  }, [ms])

  return state
}
