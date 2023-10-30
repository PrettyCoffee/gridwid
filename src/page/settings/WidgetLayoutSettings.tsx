import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const WidgetLayoutSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog.Root open={open} onOpenChange={() => settingsView.set(null)}>
      <Dialog.Content>
        <Dialog.Title>Widget Layout Settings</Dialog.Title>
        <Dialog.Description>
          Create workspaces, add widgets and arrange them.
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  )
}
