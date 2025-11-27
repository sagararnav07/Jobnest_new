import AppRouter from './router/AppRouter'
import { ErrorBoundary } from './components/ui'

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  )
}

export default App
