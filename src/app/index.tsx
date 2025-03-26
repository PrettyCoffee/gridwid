import { MainErrorFallback } from "components/errors/main"
import { ErrorBoundary } from "components/utility/error-boundary"

import { AppProviders } from "./providers"
import { AppRouter } from "./router"

export const App = () => (
  <ErrorBoundary Fallback={MainErrorFallback}>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </ErrorBoundary>
)
