import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useI18n } from '../../i18n/context'
import { EMAIL } from '../../content/profile'

export function Footer() {
  const { t } = useI18n()
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <footer className="footer">
        <div className="container footer__inner">
          <p>{t.footer.rights}</p>
          <button type="button" className="link-btn" onClick={open}>
            {t.footer.legal}
          </button>
        </div>
      </footer>

      <Modal
        opened={opened}
        onClose={close}
        title={t.legal.title}
        centered
        radius={28}
        overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
        closeButtonProps={{ 'aria-label': t.legal.close }}
        classNames={{ content: 'legal glass', header: 'legal__header', title: 'legal__title', body: 'legal__body', close: 'legal__close' }}
      >
        <p>{t.legal.publisher}</p>
        <p>
          {t.legal.contact} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <p>{t.legal.host}</p>
        <Button className="btn btn--primary" onClick={close}>
          {t.legal.close}
        </Button>
      </Modal>
    </>
  )
}
