import { useApplyThemeMode } from "./components/ThemeToggle"
import { Page } from "./page/Page"

const App = () => {
  useApplyThemeMode()
  return <Page />
}

export default App
