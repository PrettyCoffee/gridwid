import { useApplyThemeMode } from "./components/ThemeToggle"
import { TooltipProvider } from "./components/ui/tooltip"
import { Page } from "./page/Page"

const App = () => {
  useApplyThemeMode()
  return (
    <TooltipProvider>
      <Page />
    </TooltipProvider>
  )
}

export default App
