import { useEffect, useRef } from 'react'
import { animate, stagger, useAnimate } from 'motion/react'
import { LogoBadge } from './Logo'

const SCALE = 5
const NAME = 'Sébastien Branly'
const EASE_FLIGHT = [0.65, 0, 0.35, 1] as const
const markSeen = () => {
  try {
    window.sessionStorage.setItem('splash-seen', '1')
    return true
  } catch {
    return false
  }
}
const wait = (seconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, seconds * 1000))

export function Splash() {
  const [scope] = useAnimate<HTMLDivElement>()
  const bg = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const root = scope.current
    if (!root || html.dataset.splash === 'skip' || html.dataset.splash === 'done') return

    let cancelled = false
    const controls: { stop: () => void }[] = []
    const play = <T extends { stop: () => void }>(control: T) => {
      controls.push(control)
      return control
    }

    const run = async () => {
      await play(
        animate([
          ['.splash__ring', { scale: [0.3, 1.7], opacity: [0, 0.9, 0] }, { duration: 1.4, delay: stagger(0.13), ease: 'easeOut', at: 0 }],
          ['.splash .logo__s', { opacity: [0, 1], y: [-16, 0], scale: [0.5, 1] }, { duration: 0.65, ease: 'backOut', at: 0.3 }],
          ['.splash .logo__b', { opacity: [0, 1], y: [16, 0], scale: [0.5, 1] }, { duration: 0.65, ease: 'backOut', at: 0.5 }],
          ['.splash .logo__dot', { opacity: [0, 1], scale: [0, 1] }, { duration: 0.55, ease: 'backOut', at: 0.9 }],
          ['.splash__stripes', { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.55, ease: 'easeOut', at: 1.15 }],
          ['.splash__letter', { y: ['110%', '0%'], opacity: [0, 1] }, { duration: 0.6, delay: stagger(0.03), ease: [0.16, 1, 0.3, 1], at: 1.2 }],
        ]),
      )
      if (cancelled) return
      await wait(0.45)
      if (cancelled) return

      const target = document.querySelector('.nav__logo')
      const move = root.querySelector<HTMLElement>('.splash__move')
      if (!target || !move) return finish()
      const to = target.getBoundingClientRect()
      const from = move.getBoundingClientRect()
      const tx = to.left + to.width / 2
      const ty = to.top + to.height / 2
      const dx = tx - (from.left + from.width / 2)
      const dy = ty - (from.top + from.height / 2)

      const hole = bg.current
      if (hole) {
        hole.style.setProperty('--hx', `${tx}px`)
        hole.style.setProperty('--hy', `${ty}px`)
        const reach = Math.hypot(Math.max(tx, window.innerWidth - tx), Math.max(ty, window.innerHeight - ty)) + 140
        play(
          animate(-90, reach, {
            duration: 1.05,
            delay: 0.9,
            ease: [0.4, 0, 0.2, 1],
            onUpdate: (value) => hole.style.setProperty('--r', `${value}px`),
          }),
        )
      }

      await play(
        animate([
          ['.splash__letter', { opacity: [1, 0], y: ['0%', '-70%'] }, { duration: 0.3, delay: stagger(0.015), at: 0 }],
          ['.splash__stripes', { opacity: [1, 0], scaleX: [1, 0.3] }, { duration: 0.3, at: 0 }],
          ['.splash__move', { x: [0, dx], y: [0, dy] }, { duration: 1.05, ease: EASE_FLIGHT, at: 0.2 }],
          ['.splash__arc', { y: [0, -80, 0], rotate: [0, -9, 0] }, { duration: 1.05, ease: 'easeInOut', at: 0.2 }],
          ['.splash__pop', { scale: [SCALE, 1] }, { duration: 1.05, ease: EASE_FLIGHT, at: 0.2 }],
        ]),
      )
      if (cancelled) return

      move.style.visibility = 'hidden'
      html.dataset.splash = 'landed'
      window.dispatchEvent(new Event('splash:done'))
      play(animate(target, { scale: [1, 1.22, 1], rotate: [0, -6, 0] }, { duration: 0.6, ease: 'backOut' }))
      await wait(0.9)
      if (!cancelled) finish()
    }

    const finish = () => {
      html.dataset.splash = 'done'
      markSeen()
      window.dispatchEvent(new Event('splash:done'))
    }

    void run()
    return () => {
      cancelled = true
      controls.forEach((control) => control.stop())
    }
  }, [scope])

  return (
    <div ref={scope} className="splash" aria-hidden="true">
      <div ref={bg} className="splash__bg" />
      <div className="splash__rings">
        <span className="splash__ring" />
        <span className="splash__ring" />
        <span className="splash__ring" />
      </div>
      <div className="splash__stage">
        <div className="splash__move">
          <div className="splash__arc">
            <div className="splash__pop">
              <LogoBadge />
            </div>
          </div>
        </div>
        <p className="splash__name">
          {NAME.split('').map((char, index) => (
            <span key={index} className="splash__letter">
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </p>
        <div className="splash__stripes" />
      </div>
    </div>
  )
}
