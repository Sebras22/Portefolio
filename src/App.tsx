import { MantineProvider } from '@mantine/core'
import './mantine'
import { Site } from './site/Site'
import { theme } from './theme'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme: mode, toggle } = useTheme()
  return (
    <MantineProvider theme={theme} forceColorScheme={mode}>
      <Site theme={mode} onToggleTheme={toggle} />
    </MantineProvider>
  )
}
