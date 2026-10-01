import { lazy, Suspense, useRef, useState } from 'react'
import { useCapabilities } from '../hooks/useCapabilities'
import { useDeferredStart } from '../hooks/useDeferredStart'
import { useIdle } from '../hooks/useIdle'
import type { Theme } from '../hooks/useTheme'
import { Nav } from './components/Nav'
import { Splash } from './components/Splash'
import { MusicPlayer } from './music/MusicPlayer'
import { SleepOverlay } from './SleepOverlay'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Journey } from './sections/Journey'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Hobbies } from './sections/Hobbies'
import { Contact } from './sections/Contact'
import './site.css'

const Scene = lazy(() => import('./Scene'))

export function Site({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const { enable3d } = useCapabilities()
  const load3d = useDeferredStart(enable3d, 5000)
  const [sceneReady, setSceneReady] = useState(false)
  const { idle, wakes } = useIdle(30_000)
  const zRef = useRef<HTMLDivElement>(null)

  return (
    <div className="site">
      <Splash />
      {load3d && (
        <Suspense fallback={null}>
          <Scene theme={theme} onReady={() => setSceneReady(true)} asleep={idle} zRef={zRef} />
        </Suspense>
      )}
      <Nav theme={theme} onToggleTheme={onToggleTheme} />
      <MusicPlayer />
      <SleepOverlay asleep={idle} wakes={wakes} zRef={zRef} />
      <main>
        <Hero sceneReady={sceneReady} />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Hobbies />
        <Contact />
      </main>
    </div>
  )
}
