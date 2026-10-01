import { useSyncExternalStore } from 'react'

function subscribe(listener: () => void) {
  window.addEventListener('splash:done', listener)
  return () => window.removeEventListener('splash:done', listener)
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => {
      const state = document.documentElement.dataset.splash
      return state === 'skip' || state === 'landed' || state === 'done'
    },
    () => false,
  )
}
