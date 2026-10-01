import { IconBulb, IconCode, IconPalette, IconServer, IconTestPipe } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { skillTags } from '../../content/profile'
import { Reveal } from '../components/Reveal'

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="chips">
      {items.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}

export function Skills() {
  const { t } = useI18n()
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <Reveal>
          <h2 className="display">{t.skills.title}</h2>
        </Reveal>

        <div className="bento">
          <Reveal className="bento__cell bento__design">
            <IconPalette size={40} stroke={1.5} aria-hidden="true" />
            <h3>{t.skills.design.title}</h3>
            <p>{t.skills.design.text}</p>
            <Tags items={skillTags.design} />
          </Reveal>

          <Reveal className="bento__cell bento__autonomy" delay={0.08}>
            <IconBulb size={32} stroke={1.5} aria-hidden="true" />
            <h3>{t.skills.autonomy.title}</h3>
            <p>{t.skills.autonomy.text}</p>
          </Reveal>

          <Reveal className="bento__cell bento__front glass" delay={0.12}>
            <IconCode size={28} stroke={1.5} aria-hidden="true" />
            <h3>{t.skills.front}</h3>
            <Tags items={skillTags.front} />
          </Reveal>

          <Reveal className="bento__cell bento__back" delay={0.08}>
            <IconServer size={28} stroke={1.5} aria-hidden="true" />
            <h3>{t.skills.back}</h3>
            <Tags items={skillTags.back} />
          </Reveal>

          <Reveal className="bento__cell bento__tools glass" delay={0.14}>
            <IconTestPipe size={28} stroke={1.5} aria-hidden="true" />
            <h3>{t.skills.tools}</h3>
            <Tags items={skillTags.tools} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
