import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { DialogState, dialogState } from "./dialog-data"
import { Button } from "../button"
import { IconButton } from "../icon-button"

export const Dialog = ({
  title,
  description,
  confirm,
  cancel,
}: DialogState) => (
  <DialogPrimitive.Root open>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="bg-background-page/50 fixed inset-0 size-full backdrop-blur-sm" />

      <DialogPrimitive.Content className="bg-background-page border-stroke-gentle fixed inset-1/2 h-max w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg border">
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
          <Button look={confirm.look} onClick={confirm.onClick}>
            {confirm.caption}
          </Button>
          <Button look={cancel.look} onClick={cancel.onClick}>
            {cancel.caption}
          </Button>
        </div>

        <DialogPrimitive.Close asChild className="absolute right-1 top-1">
          <IconButton
            title="Close"
            hideTitle
            icon={X}
            onClick={() => dialogState.set(null)}
          />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
)
