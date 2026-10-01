import type { RefObject } from 'react'
import { useI18n } from '../i18n/context'

export function SleepOverlay({
  asleep,
  wakes,
  zRef,
}: {
  asleep: boolean
  wakes: number
  zRef: RefObject<HTMLDivElement | null>
}) {
  const { t } = useI18n()
  return (
    <div className={`sleep${asleep ? ' is-asleep' : ''}`}>
      <div className="sleep__dim" aria-hidden="true" />
      <div ref={zRef} className="sleep__zzz" aria-hidden="true">
        <span>z</span>
        <span>z</span>
        <span>Z</span>
      </div>
      {wakes > 0 && (
        <p key={wakes} className="sleep__wake" role="status">
          {t.easter.wake}
        </p>
      )}
    </div>
  )
}
