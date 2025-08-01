import { faker } from "@faker-js/faker"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { Dialog } from "./dialog"
import { showDialog } from "./dialog-data"
import { Button } from "../button"

const meta: Meta<typeof Dialog> = {
  title: "UI/Overlay/Dialog",
  component: Dialog,
  argTypes: {
    title: argType.string(),
    description: argType.string(),
    confirm: argType.disabled(),
    cancel: argType.disabled(),
  },
  args: {
    title: "Dialog title",
    description: "Dialog description",
    confirm: {
      look: "key",
      caption: "Confirm",
      onClick: action("confirm.onClick"),
    },
    cancel: {
      look: "flat",
      caption: "Cancel",
      onClick: action("cancel.onClick"),
    },
  },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: args => (
    <Button
      onClick={() =>
        showDialog({
          ...args,
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
        })
      }
    >
      Call showDialog
    </Button>
  ),
}
