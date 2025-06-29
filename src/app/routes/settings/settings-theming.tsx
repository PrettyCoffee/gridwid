import { Layout } from "components/layouts"
import { BorderRadiusSlider } from "features/theming/border-radius-slider"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

const SettingsDataRoute = () => (
  <Layout.Main>
    <div className={cn(vstack({ gap: 4 }), "mx-auto w-full max-w-2xl")}>
      <BorderRadiusSlider />
    </div>
  </Layout.Main>
)

export default SettingsDataRoute
