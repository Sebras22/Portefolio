import { renderToString } from 'react-dom/server'
import App from './App'
import { dictionaries } from './i18n/dictionaries'
import { I18nProvider } from './i18n/I18nProvider'
import type { Lang } from './i18n/types'

export function render(lang: Lang) {
  const html = renderToString(
    <I18nProvider initialLang={lang}>
      <App />
    </I18nProvider>,
  )
  return { html, meta: dictionaries[lang].meta }
}
