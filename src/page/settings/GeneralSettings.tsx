import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const GeneralSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog.Root open={open} onOpenChange={() => settingsView.set(null)}>
      <Dialog.Content>
        <Dialog.Title>General Settings</Dialog.Title>
        <Dialog.Description>???</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  )
}
