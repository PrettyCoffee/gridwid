import { useEffect, useId } from "react"

import { atom, reduxDevtools, useAtomValue } from "yaasl/react"

import { isProdEnv } from "~/lib/isDevEnv"

import { AlertBanner, AlertKind } from "./AlertBanner"
import { Icon, IconProp } from "./Icon"
import { Button, ButtonProps } from "./ui/button"

interface ToastAction {
  label: string
  variant: ButtonProps["variant"]
  onClick: ButtonProps["onClick"]
}

interface ToastProps extends IconProp {
  id: string
  title: string
  description?: string
  kind?: AlertKind
  actions?: [ToastAction] | [ToastAction, ToastAction]
}

const toastListAtom = atom<ToastProps[]>({
  name: "toastList",
  defaultValue: [],
  middleware: [reduxDevtools({ disable: isProdEnv })],
})

const add = (toast: ToastProps) =>
  toastListAtom.set(toasts => [...toasts, toast])

const update = (toast: ToastProps) =>
  toastListAtom.set(toasts =>
    toasts.map(item => (item.id === toast.id ? toast : item))
  )

const remove = (id: string) =>
  toastListAtom.set(toasts => toasts.filter(toast => toast.id !== id))

const clear = () => toastListAtom.set([])

export const toastList = {
  atom: toastListAtom,
  add,
  update,
  remove,
  clear,
}

export const Toast = (toast: Omit<ToastProps, "id">) => {
  const id = useId()
  const toasts = useAtomValue(toastList.atom)

  useEffect(() => {
    const existing = toasts.find(item => item.id === id)
    if (!existing) {
      toastList.add({ id, ...toast })
    }
  }, [id, toast, toasts])

  useEffect(() => {
    return () => toastList.remove(id)
  }, [id])

  return null
}

export const RenderedToast = ({
  kind = "neutral",
  icon,
  title,
  description,
  actions,
}: Omit<ToastProps, "id">) => (
  <AlertBanner.Root variant={kind} className="bg-card shadow-sm">
    <Icon icon={icon} />
    <AlertBanner.Title>{title}</AlertBanner.Title>

    {description && (
      <AlertBanner.Description>{description}</AlertBanner.Description>
    )}

    {actions && actions.length > 1 && (
      <div className="flex justify-end gap-2 pt-2 text-foreground">
        {actions.map(({ label, ...props }) => (
          <Button key={label} {...props}>
            {label}
          </Button>
        ))}
      </div>
    )}
  </AlertBanner.Root>
)
