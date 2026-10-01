import { Button } from '@mantine/core'
import { motion, useReducedMotion } from 'motion/react'
import { IconArrowRight, IconBriefcase } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { useIntroDone } from '../../hooks/useIntroDone'

const rise = (reduce: boolean | null, delay: number, ready: boolean) =>
  reduce
    ? {}
    : {
        initial: { y: '110%' },
        animate: { y: ready ? '0%' : '110%' },
        transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
      }

export function Hero({ sceneReady }: { sceneReady: boolean }) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const ready = useIntroDone()

  return (
    <section id="home" className="hero">
      <div className="container hero__inner">
        <motion.p
          className="status glass"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <IconBriefcase size={18} stroke={1.75} aria-hidden="true" />
          {t.hero.status}
        </motion.p>

        <h1 className="hero__name">
          <span className="mask">
            <motion.span {...rise(reduce, 0.1, ready)}>Sébastien</motion.span>
          </span>
          <span className="mask">
            <motion.span {...rise(reduce, 0.22, ready)}>Branly</motion.span>
          </span>
        </h1>

        <motion.p
          className="hero__role"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.hero.role}
        </motion.p>

        <div className="stripes" aria-hidden="true" />

        <motion.div
          className="hero__cta"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            component="a"
            href="#projects"
            className="btn btn--primary"
            rightSection={<IconArrowRight size={20} stroke={2} aria-hidden="true" />}
          >
            {t.hero.seeProjects}
          </Button>
          <Button component="a" href="#contact" className="btn btn--glass">
            {t.hero.reach}
          </Button>
        </motion.div>
      </div>

      <div className={`pebble-poster${sceneReady ? ' is-hidden' : ''}`} aria-hidden="true">
        <span className="pebble-poster__ring" />
        <span className="pebble-poster__box" />
        <span className="pebble-poster__sphere" />
        <span className="pebble-poster__capsule" />
        <span className="pebble-poster__small" />
        <span className="pebble-poster__tiny" />
      </div>
    </section>
  )
}
