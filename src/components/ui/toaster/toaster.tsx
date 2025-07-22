import { Portal } from "components/utility/portal"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { zIndex } from "utils/z-index"

import { Toast } from "./toast"
import { toastList } from "./toaster-data"

export const Toaster = () => {
  const toasts = useAtomValue(toastList)

  return (
    <Portal>
      <div
        className={cn(
          "absolute right-0 bottom-10 flex flex-col p-2",
          zIndex.toast
        )}
      >
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={toastList.actions.close} />
        ))}
      </div>
    </Portal>
  )
}
