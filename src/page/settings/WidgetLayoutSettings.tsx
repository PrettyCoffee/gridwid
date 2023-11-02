import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const WidgetLayoutSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => settingsView.set(null)}
      title="Widget Layout Settings"
      description="Create workspaces, add widgets and arrange them."
    >
      TBD
    </Dialog>
  )
}
