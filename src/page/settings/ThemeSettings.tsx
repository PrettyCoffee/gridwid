import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const ThemeSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => settingsView.set(null)}
      title="Theme Settings"
      description="Adapt gridwid to your style."
    >
      TBD
    </Dialog>
  )
}
