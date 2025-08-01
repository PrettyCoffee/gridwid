import { argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { TitleTooltip } from "./title-tooltip"
import { Button } from "../button"

const meta: Meta<typeof TitleTooltip> = {
  title: "UI/Feedback/TitleTooltip",
  component: TitleTooltip,
  argTypes: {
    side: argType.enum(),
    title: argType.string(),
    force: argType.boolean(),
  },
  args: {
    side: "top",
    title: "Some title",
  },
}

export default meta

type Story = StoryObj<typeof TitleTooltip>

const sides = ["top", "right", "left", "bottom"] as const

export const Default: Story = {
  render: args => (
    <div
      className={cn(
        vstack({ align: "center", justify: "between", gap: 4 }),
        "m-8"
      )}
    >
      {sides.map(side => (
        <TitleTooltip key={side} {...args} side={side} force>
          <Button>{side}</Button>
        </TitleTooltip>
      ))}
    </div>
  ),
}
