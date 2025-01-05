import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useState } from "react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

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
            "bg-background-page/50 fixed inset-0 z-50 size-full",
            transition.overlayClassName
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            "bg-background-page border-stroke-gentle fixed inset-1/2 z-50 h-max w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg border",
            transition.contentClassName
          )}
        >
          <DialogPrimitive.Title
            className={cn(
              hstack({ align: "center" }),
              "text-text-priority h-12 truncate pl-4 pr-12 text-xl"
            )}
          >
            <span className="truncate">{title}</span>
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-text-gentle px-4 text-sm">
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

          <DialogPrimitive.Close asChild className="absolute right-1 top-1">
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
