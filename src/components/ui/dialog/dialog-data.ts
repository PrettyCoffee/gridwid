import { createAtom } from "@yaasl/react"
import { JSX } from "react"

import { ButtonProps } from "../button"

export interface DialogAction {
  look?: ButtonProps["look"]
  caption?: string
  onClick: () => void
}

export interface DialogState {
  title: string
  description: string | JSX.Element
  confirm: Required<DialogAction>
  cancel: Required<DialogAction>
}

export const dialogState = createAtom<DialogState | null>({
  name: "dialog-state",
  defaultValue: null,
})

export interface DialogProps {
  title: string
  description: string | JSX.Element
  confirm: DialogAction
  cancel?: Partial<DialogAction>
}

export const showDialog = (dialog: DialogProps) => {
  dialogState.set({
    ...dialog,
    confirm: {
      look: "key",
      caption: "Confirm",
      ...dialog.confirm,
      onClick: () => {
        dialog.confirm.onClick()
        dialogState.set(null)
      },
    },
    cancel: {
      look: "flat",
      caption: "Cancel",
      ...dialog.cancel,
      onClick: () => {
        dialog.cancel?.onClick?.()
        dialogState.set(null)
      },
    },
  })
}
