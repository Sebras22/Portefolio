import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { Theme } from '../hooks/useTheme'

type Poses = Record<string, { x: number; y: number; s: number }>

const POSES: Poses = {
  home: { x: 0.44, y: 0, s: 1 },
  about: { x: 0.7, y: 0.05, s: 0.5 },
  journey: { x: 0.9, y: 0.3, s: 0.001 },
  projects: { x: 0.86, y: 0.72, s: 0.26 },
  skills: { x: 0.88, y: 0.82, s: 0.28 },
  hobbies: { x: 0.72, y: 0, s: 0.7 },
  contact: { x: 0.74, y: -0.05, s: 0.85 },
}
type Kind = 'sphere' | 'torus' | 'capsule' | 'box'
interface Piece {
  kind: Kind
  color: string
  position: [number, number, number]
  size: number
  speed: number
  phase: number
}

const PIECES: Piece[] = [
  { kind: 'sphere', color: '#c4573a', position: [0, 0, 0], size: 0.64, speed: 0.6, phase: 0 },
  { kind: 'torus', color: '#f0c9a3', position: [-0.78, 0.55, 0.25], size: 0.36, speed: 0.8, phase: 1.3 },
  { kind: 'capsule', color: '#5a3326', position: [0.8, -0.5, 0.15], size: 0.3, speed: 0.7, phase: 2.1 },
  { kind: 'box', color: '#fff0de', position: [0.58, 0.78, -0.1], size: 0.4, speed: 0.9, phase: 0.7 },
  { kind: 'sphere', color: '#e9967a', position: [-0.66, -0.66, 0.3], size: 0.24, speed: 1.0, phase: 3.2 },
  { kind: 'sphere', color: '#f0c9a3', position: [0.05, -0.98, 0.1], size: 0.15, speed: 1.1, phase: 4.4 },
]

function samplePose(anchors: number[], scrollMid: number) {
  if (scrollMid <= anchors[0]) return POSES[ORDER[0]]
  for (let i = 0; i < anchors.length - 1; i++) {
    if (scrollMid <= anchors[i + 1]) {
      const k = (scrollMid - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i])
      const e = k * k * (3 - 2 * k)
      const a = POSES[ORDER[i]]
      const b = POSES[ORDER[i + 1]]
      return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, s: a.s + (b.s - a.s) * e }
    }
  }
  return POSES[ORDER[ORDER.length - 1]]
}

function Shape({
  piece,
  geometries,
  dark,
  sleep,
}: {
  piece: Piece
  geometries: Record<Kind, THREE.BufferGeometry>
  dark: boolean
  sleep: MutableRefObject<number>
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const color = useMemo(() => {
    const c = new THREE.Color(piece.color)
    return dark ? c.multiplyScalar(piece.color === '#fff0de' || piece.color === '#f0c9a3' ? 0.82 : 1) : c
  }, [piece.color, dark])

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime * piece.speed + piece.phase
    const drowsy = sleep.current
    const calm = 1 - 0.9 * drowsy
    m.position.set(piece.position[0], piece.position[1] + Math.sin(t) * 0.06 * calm - 0.1 * drowsy, piece.position[2])
    m.rotation.x += delta * 0.25 * piece.speed * calm
    m.rotation.y += delta * 0.35 * piece.speed * calm
  })

  return (
    <mesh ref={mesh} geometry={geometries[piece.kind]} scale={piece.size}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.5}
        metalness={0}
        clearcoat={0.35}
        clearcoatRoughness={0.35}
        sheen={0.7}
        sheenColor="#ffe3c8"
        sheenRoughness={0.5}
        iridescence={0.3}
        iridescenceIOR={1.5}
        envMapIntensity={1.1}
      />
    </mesh>
  )
}

const ORDER = Object.keys(POSES)

function Cluster({
  theme,
  detail,
  asleep,
  zRef,
}: {
  theme: Theme
  detail: number
  asleep: boolean
  zRef: RefObject<HTMLDivElement | null>
}) {
  const group = useRef<THREE.Group>(null)
  const sleep = useRef(0)
  const baseScale = useRef(0.001)
  const wakeAt = useRef(-1)
  const wasAsleep = useRef(false)
  const placed = useRef(false)
  const anchor = useMemo(() => new THREE.Vector3(), [])
  const pointer = useRef({ x: 0, y: 0 })
  const anchors = useRef<number[]>([])
  const gl = useThree((s) => s.gl)

  const geometries = useMemo<Record<Kind, THREE.BufferGeometry>>(
    () => ({
      sphere: new THREE.SphereGeometry(1, detail * 2, detail),
      torus: new THREE.TorusGeometry(1, 0.38, detail, detail * 2),
      capsule: new THREE.CapsuleGeometry(0.6, 1.1, 8, detail * 2),
      box: new RoundedBoxGeometry(1.2, 1.2, 1.2, 6, 0.32),
    }),
    [detail],
  )
  useEffect(() => () => Object.values(geometries).forEach((g) => g.dispose()), [geometries])

  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const result = pmrem.fromScene(new RoomEnvironment(), 0.04)
    pmrem.dispose()
    return result
  }, [gl])
  useEffect(() => () => env.dispose(), [env])

  useEffect(() => {
    if (wasAsleep.current && !asleep) wakeAt.current = performance.now()
    wasAsleep.current = asleep
  }, [asleep])

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    const measure = () => {
      anchors.current = ORDER.map((id) => {
        const el = document.getElementById(id)
        if (!el) return 0
        const rect = el.getBoundingClientRect()
        return rect.top + window.scrollY + rect.height / 2
      })
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(document.body)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      resize.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const { viewport } = state
    const raw = samplePose(anchors.current, window.scrollY + window.innerHeight * 0.5)
    const portrait = viewport.width < viewport.height
    let pose = raw
    if (portrait) {
      const [top, next] = anchors.current
      const away = Math.min(1, Math.max(0, (window.scrollY + window.innerHeight * 0.5 - top) / Math.max(1, next - top)))
      const k2 = away * away * (3 - 2 * away)
      pose = { x: 0.62 + 0.18 * k2, y: 0.66 - 1.44 * k2, s: 0.52 - 0.3 * k2 }
    }
    const radius = Math.min(viewport.height, viewport.width) * 0.3
    const k = 1 - Math.exp(-4 * delta)
    if (!placed.current) {
      placed.current = true
      g.position.set(pose.x * (viewport.width / 2), pose.y * (viewport.height / 2), 0)
      baseScale.current = Math.max(0.001, pose.s * radius)
    }
    g.position.x += (pose.x * (viewport.width / 2) - g.position.x) * k
    g.position.y += (pose.y * (viewport.height / 2) - g.position.y) * k
    baseScale.current = Math.max(0.001, baseScale.current + (pose.s * radius - baseScale.current) * k)

    sleep.current += ((asleep ? 1 : 0) - sleep.current) * (1 - Math.exp(-(asleep ? 1.1 : 6) * delta))
    const breathing = Math.sin(state.clock.elapsedTime * 1.6) * 0.03 * sleep.current
    const elapsed = wakeAt.current < 0 ? 99 : (performance.now() - wakeAt.current) / 1000
    const bounce = elapsed < 1.6 ? Math.sin(elapsed * 16) * Math.exp(-elapsed * 4.5) * 0.14 : 0
    g.scale.setScalar(baseScale.current * (1 + breathing + bounce))

    const zzz = zRef.current
    if (zzz) {
      const visible = sleep.current > 0.02 && baseScale.current > radius * 0.18
      zzz.style.visibility = visible ? 'visible' : 'hidden'
      if (visible) {
        anchor.copy(g.position).project(state.camera)
        const unit = state.size.height / viewport.height
        const reach = 0.64 * baseScale.current * unit
        zzz.style.setProperty('--zx', `${(anchor.x * 0.5 + 0.5) * state.size.width + reach * 0.6}px`)
        zzz.style.setProperty('--zy', `${(-anchor.y * 0.5 + 0.5) * state.size.height - reach * 0.7}px`)
      }
    }
    g.rotation.y += (window.scrollY * 0.0008 + pointer.current.x * 0.5 - g.rotation.y) * k
    g.rotation.x += (pointer.current.y * 0.3 - g.rotation.x) * k
  })

  return (
    <group ref={group} scale={0.001}>
      <primitive object={env.texture} attach="environment" />
      {PIECES.map((piece, i) => (
        <Shape key={i} piece={piece} geometries={geometries} dark={theme === 'dark'} sleep={sleep} />
      ))}
    </group>
  )
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Scene({
  theme,
  onReady,
  asleep,
  zRef,
}: {
  theme: Theme
  onReady: () => void
  asleep: boolean
  zRef: RefObject<HTMLDivElement | null>
}) {
  const coarse = useMemo(() => window.matchMedia('(pointer: coarse)').matches, [])
  const supported = useMemo(() => hasWebGL(), [])
  if (!supported) return null
  return (
    <div className="blob-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, coarse ? 1.25 : 1.6]}
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={onReady}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.7} color="#ffe2c4" />
        <directionalLight position={[-4, -2, 2]} intensity={0.8} color="#ff9d73" />
        <Cluster theme={theme} detail={coarse ? 16 : 28} asleep={asleep} zRef={zRef} />
      </Canvas>
    </div>
  )
}
