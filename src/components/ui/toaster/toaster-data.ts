import { createSlice } from "lib/yaasl"
import { AlertKind } from "types/base-props"
import { createId } from "utils/create-id"

const defaultDurations: Record<AlertKind, number> = {
  info: 5000,
  success: 5000,
  warn: 0,
  error: 0,
}

interface ToastProps {
  id: string
  kind: AlertKind
  title: string
  message?: string
  duration?: number
}

export const toastList = createSlice({
  name: "toast-list",
  defaultValue: [] as ToastProps[],
  reducers: {
    add: (state, toast: ToastProps) => [toast, ...state],
    close: (state, id: string) => state.filter(toast => toast.id !== id),
  },
})

export const showToast = ({
  kind,
  duration = defaultDurations[kind],
  ...props
}: Omit<ToastProps, "id">) => {
  const id = createId()
  toastList.actions.add({ ...props, kind, duration, id })
}
