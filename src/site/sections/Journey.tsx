import { IconBriefcase, IconSchool } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { Reveal } from '../components/Reveal'

const TONES = ['clay', 'sand', 'cocoa'] as const

export function Journey() {
  const { t } = useI18n()
  return (
    <section id="journey" className="section-b">
      <div className="container">
        <Reveal>
          <h2 className="display-b">{t.journey.title}</h2>
          <p className="lead">{t.journey.intro}</p>
        </Reveal>

        <ol className="stack">
          {t.journey.items.map((item, i) => {
            const Icon = item.kind === 'work' ? IconBriefcase : IconSchool
            return (
              <li
                key={`${item.org}-${item.period}-${item.title}`}
                className={`stack__card block--${TONES[i % TONES.length]}`}
                style={{ '--i': i } as React.CSSProperties}
              >
                <div className="stack__period">
                  <Icon size={32} stroke={1.5} aria-hidden="true" />
                  <p>{item.period}</p>
                </div>
                <div className="stack__body">
                  <h3>{item.title}</h3>
                  <p className="stack__org">
                    {item.org}
                    {item.place ? `, ${item.place}` : ''}
                  </p>
                  {item.points && (
                    <ul className="stack__points">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                  {item.stack && (
                    <ul className="chips" aria-label="Technologies">
                      {item.stack.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
