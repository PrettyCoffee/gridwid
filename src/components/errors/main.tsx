import { Button } from "../ui/button"

export const MainErrorFallback = () => (
  <div
    className="flex size-full flex-col items-center justify-center text-alert-error"
    role="alert"
  >
    <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
    <Button
      className="mt-4"
      onClick={() => window.location.assign(window.location.origin)}
    >
      Refresh
    </Button>
  </div>
)
