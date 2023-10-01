import { useApplyThemeMode } from "./components/ThemeToggle"
import { TooltipProvider } from "./components/ui/tooltip"
import { Changelog } from "./page/Changelog"
import { Page } from "./page/Page"

const App = () => {
  useApplyThemeMode()
  return (
    <TooltipProvider>
      <Page />
      <Changelog />
    </TooltipProvider>
  )
}

export default App
