import {
  IconBallTennis,
  IconBook2,
  IconBuildingMonument,
  IconDeviceGamepad2,
  IconKarate,
  IconMountain,
} from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { Reveal } from '../components/Reveal'

const ICONS = [IconKarate, IconBallTennis, IconBuildingMonument, IconBook2, IconMountain, IconDeviceGamepad2]
const TONES = ['clay', 'sand', 'cocoa', 'cream', 'clay', 'sand'] as const

export function Hobbies() {
  const { t } = useI18n()
  return (
    <section id="hobbies" className="section-b hobbies-b">
      <div className="container hobbies-b__grid">
        <div>
          <Reveal>
            <h2 className="display-b">{t.hobbies.title}</h2>
            <p className="lead">{t.hobbies.text}</p>
          </Reveal>
          <ul className="badges">
            {t.hobbies.items.map((label, i) => {
              const Icon = ICONS[i]
              const detail = t.hobbies.details[i]
              const noteId = `hobby-note-${i}`
              return (
                <li key={label} className="badge-item" style={{ '--tilt': `${i % 2 ? 5 : -5}deg` } as React.CSSProperties}>
                  <button type="button" className={`badge-b block--${TONES[i]}`} aria-describedby={noteId}>
                    <Icon className="badge-b__icon" size={34} stroke={1.5} aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                  <span id={noteId} role="note" className="badge-note">
                    {detail.stat && <strong className="badge-note__stat">{detail.stat}</strong>}
                    <span className="badge-note__text">{detail.text}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
