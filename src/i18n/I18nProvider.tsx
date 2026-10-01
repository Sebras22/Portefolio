import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dictionaries } from './dictionaries'
import { I18nContext } from './context'
import type { Lang } from './types'

function langFromPath(): Lang | null {
  const first = window.location.pathname.split('/')[1]
  return first === 'fr' || first === 'en' ? first : null
}

function langFromBrowser(): Lang {
  const preferred = navigator.languages?.[0] ?? navigator.language ?? 'fr'
  return preferred.toLowerCase().startsWith('en') ? 'en' : 'fr'
}

export function I18nProvider({ children, initialLang = 'fr' }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(() =>
    typeof window === 'undefined' ? initialLang : (langFromPath() ?? langFromBrowser()),
  )

  useEffect(() => {
    const expected = `/${lang}`
    if (!window.location.pathname.startsWith(expected)) {
      window.history.replaceState(null, '', `${expected}/${window.location.search}${window.location.hash}`)
    }
    document.documentElement.lang = lang
    document.title = dictionaries[lang].meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', dictionaries[lang].meta.description)
  }, [lang])

  useEffect(() => {
    const onPop = () => setLang(langFromPath() ?? langFromBrowser())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const switchLang = useCallback(() => {
    setLang((current) => {
      const next: Lang = current === 'fr' ? 'en' : 'fr'
      window.history.pushState(null, '', `/${next}/${window.location.search}${window.location.hash}`)
      return next
    })
  }, [])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], switchLang }), [lang, switchLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
