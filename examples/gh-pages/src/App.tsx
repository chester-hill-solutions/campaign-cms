import { DemoEditor } from './DemoEditor'
import { PreviewPage } from './PreviewPage'

export function App() {
  const view = new URLSearchParams(window.location.search).get('view')
  if (view === 'preview') return <PreviewPage />
  return <DemoEditor />
}
