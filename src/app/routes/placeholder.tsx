import { useHashRouter } from "components/utility/hash-router"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

export const Placeholder = () => {
  const { route, params } = useHashRouter()
  return (
    <div className={cn(surface({ look: "card", size: "lg" }), "font-semibold")}>
      <h1># {route?.path}</h1>
      <h2>Work in progress</h2>
      <p>This page is still under construction.</p>
      <pre className="pt-3">url params = {JSON.stringify(params, null, 2)}</pre>
    </div>
  )
}

export default Placeholder
