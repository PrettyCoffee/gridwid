import { Dialog } from "~/components/ui/dialog"

import { settingsView } from "./Settings"

export const ThemeSettings = ({ open }: { open: boolean }) => {
  return (
    <Dialog.Root open={open} onOpenChange={() => settingsView.set(null)}>
      <Dialog.Content>
        <Dialog.Title>Theme Settings</Dialog.Title>
        <Dialog.Description>Adapt gridwid to your style.</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  )
}
