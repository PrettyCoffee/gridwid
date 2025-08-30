import { JSX } from "react"

import { createAtom } from "lib/yaasl"

import { ButtonProps } from "../button"

interface DialogAction {
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

interface DialogProps {
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
      onClick: () => dialog.confirm.onClick(),
    },
    cancel: {
      look: "flat",
      caption: "Cancel",
      ...dialog.cancel,
      onClick: () => dialog.cancel?.onClick?.(),
    },
  })
}
