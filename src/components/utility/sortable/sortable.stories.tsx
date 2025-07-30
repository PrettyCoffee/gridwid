import { useState } from "react"

import { faker } from "@faker-js/faker"
import { GripHorizontal } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { action, argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { createRange } from "utils/create-range"
import { hstack, vstack } from "utils/styles"

// eslint-disable-next-line import/no-useless-path-segments
import { Sortable, SortableContextProps } from "./index"
import { Sortable as SortableData } from "./types"

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
          isOverlayItem && "bg-background shade-medium w-max rounded-md",
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

const ItemList = ({
  items: initialItems,
  onSort,
}: Omit<SortableContextProps<DemoItem>, "OverlayItem">) => {
  const [items, setItems] = useState(initialItems)
  return (
    <Sortable.Context
      items={items}
      onSort={sort => {
        setItems(prev => sort(prev))
        onSort(sort)
      }}
      OverlayItem={({ source }) => (
        <Item
          index={items.findIndex(item => item.id === source.id)}
          item={source.data as DemoItem}
          isOverlayItem
        />
      )}
    >
      <ul>
        {items.map((item, index) => (
          <Item key={item.id} index={index} item={item} />
        ))}
      </ul>
    </Sortable.Context>
  )
}

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
    OverlayItem: (() => null) as SortableContextProps<DemoItem>["OverlayItem"],
  },
}

export default meta

type Story<TData extends SortableData = DemoItem> = StoryObj<
  typeof Sortable.Context<TData>
>

export const Default: Story = {
  render: ItemList,
}

interface NestedDemoItem extends DemoItem {
  items: DemoItem[]
}

const nestedItems: NestedDemoItem[] = createRange(0, 3).map(index => ({
  id: index.toString(),
  text: faker.lorem.words({ min: 1, max: 2 }),
  items: createItems(4),
}))

const NestedItem = ({
  index,
  item,
  isOverlayItem,
}: {
  index: number
  item: NestedDemoItem
  isOverlayItem?: boolean
}) => (
  <Sortable.Item index={index} item={item} asChild>
    {({ isDragging, isDropping }) => (
      <li
        className={cn(
          vstack(),
          "list-none p-2 pr-3",
          isOverlayItem && "bg-background shade-medium w-max rounded-md",
          !isOverlayItem &&
            (isDragging || isDropping) &&
            "pointer-events-none **:opacity-0"
        )}
      >
        <div className={cn(hstack({ align: "center", gap: 2 }))}>
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
        </div>

        <div className="pl-8">
          <ItemList items={item.items} onSort={action("Inner onSort")} />
        </div>
      </li>
    )}
  </Sortable.Item>
)

const NestedList = ({
  items: initialItems,
  onSort,
}: SortableContextProps<NestedDemoItem>) => {
  const [items, setItems] = useState(initialItems)
  return (
    <Sortable.Context
      items={items}
      onSort={sort => {
        setItems(prev => sort(prev))
        onSort(sort)
      }}
      OverlayItem={({ source }) => (
        <NestedItem
          index={items.findIndex(item => item.id === source.id)}
          item={source.data as NestedDemoItem}
          isOverlayItem
        />
      )}
    >
      <ul>
        {items.map((item, index) => (
          <NestedItem key={item.id} index={index} item={item} />
        ))}
      </ul>
    </Sortable.Context>
  )
}

export const Nested: Story<NestedDemoItem> = {
  args: {
    items: nestedItems,
    onSort: action("Outer onSort"),
  },
  render: NestedList,
}
