import { useMemo } from 'react'
import { useReducedMotion } from 'motion/react'

export function useCapabilities() {
  const reducedMotion = useReducedMotion() ?? false
  const enable3d = useMemo(() => {
    if (typeof window === 'undefined' || reducedMotion) return false
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4
    if (coarse && weak) return false
    return true
  }, [reducedMotion])
  return { reducedMotion, enable3d }
}
