import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const serverDir = resolve(root, 'dist-server')

const SITE = 'https://sebastienbranly.fr'
const LANGS = ['fr', 'en']

const { render } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const alternates = [
  ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/" />`),
  `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
].join('\n    ')

function page(lang) {
  const { html, meta } = render(lang)
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(meta.description)}" />`,
    )
    .replace(
      '</head>',
      `  <link rel="canonical" href="${SITE}/${lang}/" />\n    ${alternates}\n    <meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : 'en_GB'}" />\n  </head>`,
    )
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}

for (const lang of LANGS) {
  mkdirSync(resolve(dist, lang), { recursive: true })
  writeFileSync(resolve(dist, lang, 'index.html'), page(lang))
  console.log(`prerendered /${lang}/`)
}

const fr = render('fr').meta
writeFileSync(
  resolve(dist, 'index.html'),
  `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escape(fr.title)}</title>
    <meta name="description" content="${escape(fr.description)}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href="${SITE}/" />
    ${alternates}
    <script>
      var l = (navigator.languages && navigator.languages[0]) || navigator.language || 'fr'
      location.replace((l.toLowerCase().indexOf('en') === 0 ? '/en/' : '/fr/') + location.search + location.hash)
    </script>
  </head>
  <body>
    <noscript>
      <p><a href="/fr/">Français</a> | <a href="/en/">English</a></p>
    </noscript>
  </body>
</html>
`,
)
console.log('wrote / (language redirect)')

rmSync(serverDir, { recursive: true, force: true })
