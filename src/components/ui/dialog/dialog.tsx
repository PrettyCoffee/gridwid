import { useState } from "react"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"
import { zIndex } from "utils/z-index"

import { DialogState, dialogState } from "./dialog-data"
import { Button } from "../button"
import { IconButton } from "../icon-button"

const transitionStyles = {
  show: {
    overlayClassName:
      "duration-200 transition-all bg-background-page/50 backdrop-blur-sm",
    contentClassName: "duration-200 transition-all scale-100 opacity-100",
    duration: 200,
  },
  hide: {
    overlayClassName:
      "duration-100 transition-all bg-transparent backdrop-blur-0",
    contentClassName: "duration-100 transition-all scale-50 opacity-0",
    duration: 100,
  },
}

export const Dialog = ({
  title,
  description,
  confirm,
  cancel,
}: DialogState) => {
  const [status, setStatus] = useState<"init" | "show" | "closing">("init")

  const transition = transitionStyles[status === "show" ? "show" : "hide"]

  if (status === "init") {
    setTimeout(() => setStatus("show"), 0)
  } else if (status === "closing") {
    setTimeout(() => dialogState.set(null), transition.duration)
  }

  const close = () => setStatus("closing")

  return (
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 size-full bg-background-page/50",
            zIndex.dialog,
            transition.overlayClassName
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            "fixed inset-1/2 h-max w-96 -translate-1/2 rounded-lg border border-stroke-gentle bg-background-page",
            zIndex.dialog,
            transition.contentClassName
          )}
        >
          <DialogPrimitive.Title
            className={cn(
              hstack({ align: "center" }),
              "h-12 truncate pr-12 pl-4 text-xl text-text-priority"
            )}
          >
            <span className="truncate">{title}</span>
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="px-4 text-sm text-text-gentle">
            {description}
          </DialogPrimitive.Description>

          <div className={cn(hstack({ gap: 2, wrap: true }), "p-4")}>
            <Button
              look={confirm.look}
              onClick={() => {
                close()
                confirm.onClick()
              }}
            >
              {confirm.caption}
            </Button>
            <Button
              look={cancel.look}
              onClick={() => {
                close()
                cancel.onClick()
              }}
            >
              {cancel.caption}
            </Button>
          </div>

          <DialogPrimitive.Close asChild className="absolute top-1 right-1">
            <IconButton
              title="Close"
              hideTitle
              icon={X}
              onClick={() => {
                close()
                cancel.onClick()
              }}
            />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
