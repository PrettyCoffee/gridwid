import { action, argType, Meta, StoryObj } from "lib/storybook"
import { AlertKind } from "types/base-props"
import { vstack } from "utils/styles"

import { Toast } from "./toast"
import { Button } from "../button"
import { showToast } from "./toaster-data"

const meta: Meta<typeof Toast> = {
  title: "Feedback/Toaster",
  component: Toast,
  argTypes: {
    id: argType.string(),
    kind: argType.enum(),
    title: argType.string(),
    message: argType.string(),
    duration: argType.disabled(),
    onClose: argType.callback(),
  },
  args: {
    id: "1",
    kind: "info",
    title: "Hello there!",
    message: "This is a message",
    onClose: action("onClose"),
  },
}

export default meta

type Story = StoryObj<typeof Toast>

const kinds: AlertKind[] = ["success", "info", "warn", "error"]
export const Toasts: Story = {
  args: { kind: "info" },
  render: args => (
    <div className={vstack({ gap: 4 })}>
      {kinds.map(kind => (
        <Toast {...args} key={kind} id={kind} kind={kind} />
      ))}
    </div>
  ),
}

export const Toaster: Story = {
  args: { kind: "error" },
  render: () => (
    <>
      <Button
        onClick={() => showToast({ kind: "success", title: "Oh yes! :)" })}
      >
        Success
      </Button>
      <Button
        onClick={() => showToast({ kind: "info", title: "Uh, hello! c:" })}
      >
        Info
      </Button>
      <Button
        onClick={() =>
          showToast({ kind: "warn", title: "Better look out! :0" })
        }
      >
        Warn
      </Button>
      <Button onClick={() => showToast({ kind: "error", title: "Oh no! :(" })}>
        Error
      </Button>
    </>
  ),
}
