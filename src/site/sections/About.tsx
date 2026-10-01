import { IconCompass, IconLanguage, IconMapPin, IconPalette, IconRocket } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { Reveal } from '../components/Reveal'

const ICONS = [IconCompass, IconPalette, IconRocket]

export function About() {
  const { t } = useI18n()
  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <div className="about__lead">
          <Reveal>
            <h2 className="display">{t.about.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">{t.about.text}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="facts">
              <li>
                <IconMapPin size={20} stroke={1.75} aria-hidden="true" />
                {t.about.location}
              </li>
              <li>
                <IconLanguage size={20} stroke={1.75} aria-hidden="true" />
                {t.about.langs}
              </li>
            </ul>
          </Reveal>
        </div>

        <ul className="about__values">
          {t.about.values.map((value, i) => {
            const Icon = ICONS[i]
            return (
              <li key={value.title} className={`value value--${i}`}>
                <Reveal delay={i * 0.12} y={40}>
                  <div className="glass panel">
                    <span className="badge" aria-hidden="true">
                      <Icon size={24} stroke={1.75} />
                    </span>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
