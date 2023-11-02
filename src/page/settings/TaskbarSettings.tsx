import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const TaskbarSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => settingsView.set(null)}
      title="Taskbar Settings"
      description="Adapt the taskbar to match your needs."
    >
      TBD
    </Dialog>
  )
}
