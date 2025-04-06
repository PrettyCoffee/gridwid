import { useAtomValue } from "lib/yaasl"

import { Dialog } from "./dialog"
import { dialogState } from "./dialog-data"

export const DialogProvider = () => {
  const dialog = useAtomValue(dialogState)
  return !dialog ? null : <Dialog {...dialog} />
}
