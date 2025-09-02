import { useState } from "react"

import { faker } from "@faker-js/faker"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { Checklist } from "./checklist"

faker.seed(1337)

const meta: Meta<typeof Checklist> = {
  title: "UI/Inputs/Checklist (Dbl Click)",
  component: Checklist,
  argTypes: {
    items: argType.disabled(),
    title: argType.string(),
    onChange: argType.callback(),
  },
  args: {
    title: "Checklist Title (Dbl Click)",
    onChange: action("onChange"),
    items: [
      { id: "1", label: "Dogs are friendly", checked: true },
      { id: "2", label: "Cats are cute", checked: false },
      { id: "3", label: "Ducks do quack", checked: false },
    ],
  },
}

export default meta

type Story = StoryObj<typeof Checklist>

export const Default: Story = {
  args: {},
  render: args => {
    const [items, setItems] = useState(args.items)
    return (
      <div className="max-w-80">
        <Checklist {...args} items={items} onChange={setItems} />
      </div>
    )
  },
}
