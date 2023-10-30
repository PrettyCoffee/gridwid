import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const TaskbarSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog.Root open={open} onOpenChange={() => settingsView.set(null)}>
      <Dialog.Content>
        <Dialog.Title>Taskbar Settings</Dialog.Title>
        <Dialog.Description>
          Adapt the taskbar to match your needs.
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  )
}
