import { useApplyThemeMode } from "./components/ThemeToggle"
import { Tooltip } from "./components/ui/tooltip"
import { Changelog } from "./page/Changelog"
import { Page } from "./page/Page"

const App = () => {
  useApplyThemeMode()
  return (
    <Tooltip.Provider>
      <Page />
      <Changelog />
    </Tooltip.Provider>
  )
}

export default App
