import { useHashRouter } from "components/utility/hash-router"

export const Placeholder = () => {
  const { route, params } = useHashRouter()
  return (
    <div className="font-semibold">
      <h1># {route?.path}</h1>
      <h2>Work in progress</h2>
      <p>This page is still under construction.</p>
      <pre className="pt-3">url params = {JSON.stringify(params, null, 2)}</pre>
    </div>
  )
}

export default Placeholder
