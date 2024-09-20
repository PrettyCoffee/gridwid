import { Portal } from "components/utility/portal"
import { useAtomValue } from "lib/yaasl"

import { Toast } from "./toast"
import { toastList } from "./toaster-data"

export const Toaster = () => {
  const toasts = useAtomValue(toastList)

  return (
    <Portal>
      <div className="absolute bottom-10 right-0 z-50 flex flex-col p-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={toastList.actions.close} />
        ))}
      </div>
    </Portal>
  )
}
