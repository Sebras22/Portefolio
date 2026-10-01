import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'theme'
const listeners = new Set<() => void>()

function readStored(): Theme | null {
  try {
    const value = window.localStorage.getItem(KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function remember(theme: Theme) {
  try {
    window.localStorage.setItem(KEY, theme)
    return true
  } catch {
    return false
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

function current(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const onSystemChange = () => {
    if (readStored()) return
    document.documentElement.dataset.theme = query.matches ? 'dark' : 'light'
    emit()
  }
  query.addEventListener('change', onSystemChange)
  return () => {
    listeners.delete(listener)
    query.removeEventListener('change', onSystemChange)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, current, () => 'light')

  const toggle = useCallback(() => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    remember(next)
    document.documentElement.dataset.theme = next
    emit()
  }, [])

  return { theme, toggle }
}
