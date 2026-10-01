import { createTheme, Modal, Tooltip, type MantineColorsTuple } from '@mantine/core'

const terracotta: MantineColorsTuple = [
  '#fff4ea',
  '#fbe3d2',
  '#f6c9ab',
  '#efa87e',
  '#e68b5c',
  '#d4693b',
  '#b04a30',
  '#933b25',
  '#762f1e',
  '#582216',
]

export const theme = createTheme({
  primaryColor: 'terracotta',
  primaryShade: { light: 6, dark: 5 },
  colors: { terracotta },
  black: '#2a1a16',
  white: '#fff5ea',
  defaultRadius: 'xl',
  fontFamily: "'DM Sans Variable', 'DM Sans', system-ui, sans-serif",
  components: {
    Modal: Modal.extend({ defaultProps: { portalProps: { target: '.site' } } }),
    Tooltip: Tooltip.extend({ defaultProps: { portalProps: { target: '.site' } } }),
  },
  headings: { fontFamily: "'Fredoka Variable', 'Fredoka', ui-rounded, system-ui, sans-serif", fontWeight: '500' },
})
