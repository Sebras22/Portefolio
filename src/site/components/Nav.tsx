import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ActionIcon, Burger, Tooltip } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { LogoBadge } from './Logo'
import { useActiveSection } from '../../hooks/useActiveSection'
import type { Theme } from '../../hooks/useTheme'

const LINKS = ['journey', 'projects', 'skills', 'contact'] as const
const SECTION_IDS = ['home', 'about', ...LINKS, 'hobbies'] as const

export function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const { t, lang, switchLang } = useI18n()
  const [open, setOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const current = LINKS.includes(active as (typeof LINKS)[number]) ? active : null

  return (
    <header className="nav-wrap">
      <nav className="nav glass" aria-label="Principal">
        <a className="nav__logo" href="#home" aria-label={t.nav.home}>
          <LogoBadge />
        </a>

        <LayoutGroup>
          <ul className="nav__links">
            {LINKS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={current === id ? 'true' : undefined}>
                  {current === id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav__pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="nav__label">{t.nav[id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </LayoutGroup>

        <div className="nav__tools">
          <Tooltip label={t.nav.langSwitch} openDelay={350} withArrow>
            <ActionIcon
              variant="transparent"
              size={40}
              className="icon-btn nav__lang"
              onClick={switchLang}
              aria-label={t.nav.langSwitch}
              lang={lang === 'fr' ? 'en' : 'fr'}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </ActionIcon>
          </Tooltip>
          <Tooltip label={theme === 'dark' ? t.nav.themeToLight : t.nav.themeToDark} openDelay={350} withArrow>
            <ActionIcon
              variant="transparent"
              size={40}
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? t.nav.themeToLight : t.nav.themeToDark}
            >
              {theme === 'dark' ? <IconSun size={20} stroke={1.75} /> : <IconMoon size={20} stroke={1.75} />}
            </ActionIcon>
          </Tooltip>
          <Burger
            size="sm"
            className="nav__burger"
            opened={open}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
          />
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            className="mobile-menu glass"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {LINKS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setOpen(false)}>
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
