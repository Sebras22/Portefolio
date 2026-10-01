import { ActionIcon, Button, CopyButton, Tooltip, VisuallyHidden } from '@mantine/core'
import { IconBrandGithub, IconBrandLinkedin, IconCheck, IconCopy } from '@tabler/icons-react'
import { useI18n } from '../../i18n/context'
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../content/profile'
import { Reveal } from '../components/Reveal'
import { Footer } from '../components/Footer'

export function Contact() {
  const { t } = useI18n()

  return (
    <>
      <section id="contact" className="section-b contact-b">
        <div className="container contact-b__inner">
          <Reveal>
            <h2 className="display-b display-b--xl">{t.contact.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">{t.contact.text}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <a className="mail-b" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </Reveal>
          <Reveal delay={0.26} className="contact-b__actions">
            <CopyButton value={EMAIL} timeout={2200}>
              {({ copied, copy }) => (
                <>
                  <Button
                    className="btn btn--primary"
                    onClick={copy}
                    leftSection={
                      copied ? (
                        <IconCheck size={20} stroke={2} aria-hidden="true" />
                      ) : (
                        <IconCopy size={20} stroke={2} aria-hidden="true" />
                      )
                    }
                  >
                    {copied ? t.contact.copied : t.contact.copy}
                  </Button>
                  <VisuallyHidden role="status">{copied ? t.contact.copied : ''}</VisuallyHidden>
                </>
              )}
            </CopyButton>
            <Tooltip label={t.contact.github} withArrow>
              <ActionIcon
                component="a"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                variant="default"
                size={56}
                className="round-btn"
                aria-label={t.contact.github}
              >
                <IconBrandGithub size={26} stroke={1.5} aria-hidden="true" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t.contact.linkedin} withArrow>
              <ActionIcon
                component="a"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                variant="default"
                size={56}
                className="round-btn"
                aria-label={t.contact.linkedin}
              >
                <IconBrandLinkedin size={26} stroke={1.5} aria-hidden="true" />
              </ActionIcon>
            </Tooltip>
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  )
}
