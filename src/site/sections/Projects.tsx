import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUpRight, IconBrandGithub } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { useCapabilities } from '../../hooks/useCapabilities'
import { projectsMeta } from '../../content/profile'
import type { ProjectMeta } from '../../content/profile'
import type { ProjectText } from '../../i18n/types'
import { Reveal } from '../components/Reveal'

function Panel({ meta, text }: { meta: ProjectMeta; text: ProjectText }) {
  const { t } = useI18n()
  return (
    <article className={`project project--${meta.id}`}>
      <div className="project__body">
        <h3 className="project__name">{text.name}</h3>
        <p className="project__subtitle">{text.subtitle}</p>
        <p className="project__text">{text.text}</p>
        <ul className="chips" aria-label="Technologies">
          {meta.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project__links">
          {meta.siteUrl && (
            <Button
              component="a"
              href={meta.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary"
              rightSection={<IconArrowUpRight size={20} stroke={2} aria-hidden="true" />}
            >
              {t.projects.site}
            </Button>
          )}
          {meta.codeUrl && (
            <Button
              component="a"
              href={meta.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn--glass"
              leftSection={<IconBrandGithub size={20} stroke={1.75} aria-hidden="true" />}
            >
              {t.projects.code}
            </Button>
          )}
        </div>
      </div>

      <div
        className="project__mockup"
        role={meta.image ? undefined : 'img'}
        aria-label={meta.image ? undefined : `${text.name}: ${t.projects.mockup}`}
      >
        <div className="mockup__bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="mockup__screen">
          {meta.image ? (
            <img
              className="mockup__image"
              src={meta.image.src}
              width={meta.image.width}
              height={meta.image.height}
              alt={`${t.projects.shot} ${text.name}`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <>
              <span className="mockup__initial" aria-hidden="true">
                {text.name.charAt(0)}
              </span>
              <span className="mockup__caption">{t.projects.mockup}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const { t } = useI18n()
  const { reducedMotion } = useCapabilities()
  const wide = useMediaQuery('(min-width: 900px)', true)
  const pan = wide && !reducedMotion

  const wrap = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    if (!pan || !track.current) return
    const el = track.current
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [pan])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -distance])

  const panels = projectsMeta.map((meta, i) => <Panel key={meta.id} meta={meta} text={t.projects.items[i]} />)

  if (!pan) {
    return (
      <section id="projects" className="section projects projects--stack">
        <div className="container">
          <Reveal>
            <h2 className="display">{t.projects.title}</h2>
            <p className="lead">{t.projects.intro}</p>
          </Reveal>
          <div className="projects__list">{panels}</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="projects projects--pan" ref={wrap} style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="projects__stage">
        <div className="projects__head container">
          <h2 className="display">{t.projects.title}</h2>
          <p className="lead">{t.projects.intro}</p>
        </div>
        <motion.div className="projects__track" ref={track} style={{ x }}>
          {panels}
        </motion.div>
      </div>
    </section>
  )
}
