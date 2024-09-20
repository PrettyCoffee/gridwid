import { PropsWithChildren, Suspense } from "react"

import { MainErrorFallback } from "components/errors/main"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { Taskbar } from "./taskbar"

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={cn(vstack(), "bg-background-page size-full")}>
      <div
        className={cn(
          hstack({ gap: 4, align: "center", justify: "center" }),
          "w-full flex-grow p-4"
        )}
      >
        <Suspense fallback={<Spinner size="xl" />}>
          <ErrorBoundary Fallback={MainErrorFallback}>{children}</ErrorBoundary>
        </Suspense>
      </div>
      <Taskbar />
    </div>
  )
}
