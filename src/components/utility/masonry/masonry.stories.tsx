import { faker } from "@faker-js/faker"

import { argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { createRange } from "utils/create-range"
import { surface } from "utils/styles"

import { Masonry } from "./masonry"

const meta: Meta<typeof Masonry.Grid> = {
  title: "Utility/Masonry",
  component: Masonry.Grid,
  argTypes: {
    minItemWidth: argType.number(),
  },
  args: {
    minItemWidth: 15,
  },
}

export default meta

type Story = StoryObj<typeof Masonry.Grid>

faker.seed(1337)

const items = createRange(0, 20).map(key => ({
  key,
  text: faker.lorem.paragraphs({ min: 1, max: 5 }),
}))

export const Default: Story = {
  name: "Masonry",
  render: args => (
    <Masonry.Grid {...args}>
      {items.map(({ key, text }) => (
        <Masonry.Item key={key} maxHeight={25} className="p-2">
          <div
            className={cn(surface({ look: "card", size: "lg" }), "min-h-full")}
          >
            {text}
          </div>
        </Masonry.Item>
      ))}
    </Masonry.Grid>
  ),
}
