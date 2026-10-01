import { useCallback, useEffect, useRef, useState } from 'react'
import { ActionIcon, Slider } from '@mantine/core'
import { IconLoader2, IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { useCapabilities } from '../../hooks/useCapabilities'
import type { LofiEngine } from './lofi'

type Status = 'idle' | 'loading' | 'playing' | 'paused'

const BARS = 14
const BAR_WIDTH = 4
const GAP = 3
const WIDTH = BARS * BAR_WIDTH + (BARS - 1) * GAP
const HEIGHT = 32
const IDLE = [0.3, 0.5, 0.35, 0.65, 0.45, 0.8, 0.5, 0.7, 0.4, 0.6, 0.3, 0.5, 0.35, 0.25]

function drawBars(canvas: HTMLCanvasElement, levels: ArrayLike<number>) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const ratio = window.devicePixelRatio || 1
  if (canvas.width !== WIDTH * ratio) {
    canvas.width = WIDTH * ratio
    canvas.height = HEIGHT * ratio
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = getComputedStyle(canvas).color
  for (let i = 0; i < BARS; i++) {
    const h = Math.max(4, levels[i] * HEIGHT)
    const x = i * (BAR_WIDTH + GAP)
    ctx.beginPath()
    ctx.roundRect(x, (HEIGHT - h) / 2, BAR_WIDTH, h, BAR_WIDTH / 2)
    ctx.fill()
  }
}

export function MusicPlayer() {
  const { t } = useI18n()
  const { reducedMotion } = useCapabilities()
  const [status, setStatus] = useState<Status>('idle')
  const [volume, setVolume] = useState(0.6)
  const engine = useRef<LofiEngine | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  const toggle = useCallback(async () => {
    if (status === 'loading') return
    if (status === 'playing') {
      engine.current?.pause()
      setStatus('paused')
      return
    }
    if (!engine.current) {
      setStatus('loading')
      const { LofiEngine: Engine } = await import('./lofi')
      engine.current = new Engine()
    }
    engine.current.setVolume(volume)
    await engine.current.play()
    setStatus('playing')
  }, [status, volume])

  const changeVolume = (value: number) => {
    setVolume(value)
    engine.current?.setVolume(value)
  }

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const analyser = engine.current?.analyser
    if (status !== 'playing' || !analyser) {
      drawBars(el, IDLE)
      return
    }
    const bins = new Uint8Array(analyser.frequencyBinCount)
    const levels = new Array<number>(BARS).fill(0)
    let frame = 0
    let last = 0
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (reducedMotion && now - last < 90) return
      last = now
      analyser.getByteFrequencyData(bins)
      for (let i = 0; i < BARS; i++) {
        const bin = Math.min(bins.length - 1, Math.round(1.5 * 1.3 ** i))
        const target = Math.min(1, (bins[bin] / 255) ** 1.2 * (0.9 + i * 0.09))
        levels[i] += (target - levels[i]) * 0.45
      }
      drawBars(el, levels)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [status, reducedMotion])

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) engine.current?.hold()
      else engine.current?.release()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(
    () => () => {
      engine.current?.destroy()
      engine.current = null
    },
    [],
  )

  const playing = status === 'playing'

  return (
    <div className={`music glass${playing ? ' is-playing' : ''}`} role="group" aria-label={t.music.label}>
      <ActionIcon
        size={44}
        radius="xl"
        className="music__btn"
        onClick={() => void toggle()}
        aria-pressed={playing}
        aria-label={playing ? t.music.pause : t.music.play}
      >
        {status === 'loading' ? (
          <IconLoader2 className="music__spin" size={20} stroke={2} aria-hidden="true" />
        ) : playing ? (
          <IconPlayerPauseFilled size={20} aria-hidden="true" />
        ) : (
          <IconPlayerPlayFilled size={20} aria-hidden="true" />
        )}
      </ActionIcon>
      <canvas ref={canvas} className="music__viz" style={{ width: WIDTH, height: HEIGHT }} aria-hidden="true" />
      <span className="music__label">{t.music.label}</span>
      <Slider
        className="music__volume"
        value={volume}
        onChange={changeVolume}
        min={0}
        max={1}
        step={0.05}
        size="sm"
        label={null}
        thumbLabel={t.music.volume}
        w={92}
      />
    </div>
  )
}
