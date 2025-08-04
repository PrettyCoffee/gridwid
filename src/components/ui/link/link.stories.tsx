import { argType, Meta, StoryObj } from "lib/storybook"

import { Link } from "./link"

const meta: Meta<typeof Link> = {
  title: "UI/Primitives/Link",
  component: Link,
  argTypes: {
    to: argType.string(),
    href: argType.string(),
    target: argType.string(),
    disabled: argType.boolean(),
  },
  args: {
    href: "",
    to: "",
    target: "_self",
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof Link>

export const Default: Story = {
  name: "Link",
  args: { children: "link", to: "" },
  render: args => (
    <>
      Some text and a <Link {...args} /> that brings you somewhere.
      <br />
      Can also be{" "}
      <Link {...args} disabled>
        disabled
      </Link>
      .
    </>
  ),
}
