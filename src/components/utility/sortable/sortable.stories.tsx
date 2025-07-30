import { faker } from "@faker-js/faker"
import { GripHorizontal } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { action, argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { createRange } from "utils/create-range"
import { hstack } from "utils/styles"

// eslint-disable-next-line import/no-useless-path-segments
import { Sortable } from "./index"

faker.seed(1337)

interface DemoItem {
  id: string
  text: string
}

const createItems = (amount: number): DemoItem[] =>
  createRange(0, amount).map(index => ({
    id: index.toString(),
    text: faker.lorem.words({ min: 1, max: 5 }),
  }))

const items: DemoItem[] = createItems(10)

const Item = ({
  index,
  item,
  isOverlayItem,
}: {
  index: number
  item: DemoItem
  isOverlayItem?: boolean
}) => (
  <Sortable.Item index={index} item={item} asChild>
    {({ isDragging, isDropping }) => (
      <li
        className={cn(
          hstack({ align: "center", gap: 2 }),
          "list-none pr-3",
          isOverlayItem && "bg-background shade-medium w-max",
          !isOverlayItem &&
            (isDragging || isDropping) &&
            "pointer-events-none **:opacity-0"
        )}
      >
        <Sortable.Handle asChild>
          <IconButton
            icon={GripHorizontal}
            title="Re-order item"
            hideTitle
            className="cursor-grab active:cursor-grabbing"
          />
        </Sortable.Handle>
        <span>
          {item.id} - {item.text}
        </span>
      </li>
    )}
  </Sortable.Item>
)

const meta: Meta<typeof Sortable.Context> = {
  title: "Utility/Sortable",
  component: Sortable.Context,
  argTypes: {
    items: argType.disabled(),
    onSort: argType.callback(),
    OverlayItem: argType.disabled(),
  },
  args: {
    items,
    onSort: action("onSort"),
    OverlayItem: ({ source }) => (
      <Item
        index={items.findIndex(item => item.id === source.id)}
        item={source.data as DemoItem}
        isOverlayItem
      />
    ),
  },
}

export default meta

type Story = StoryObj<typeof Sortable.Context<DemoItem>>

export const Default: Story = {
  render: args => (
    <Sortable.Context {...args}>
      <ul>
        {items.map((item, index) => (
          <Item key={item.id} index={index} item={item} />
        ))}
      </ul>
    </Sortable.Context>
  ),
}
