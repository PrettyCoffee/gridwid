import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const GeneralSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => settingsView.set(null)}
      title="General Settings"
      description="???"
    >
      TBD
    </Dialog>
  )
}
