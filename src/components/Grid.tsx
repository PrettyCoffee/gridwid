import { PropsWithChildren } from "react"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"

export interface GridSize {
  columns?: number
  rows?: number
  position?: { x: number; y: number }
}

export interface GridItemProps extends ClassNameProp, GridSize {}

const Item = ({
  children,
  className,
  columns = 2,
  rows = 2,
  position,
}: PropsWithChildren<GridItemProps>) => (
  <div
    style={{
      gridRow: `span ${rows}`,
      gridColumn: `span ${columns}`,
      ...(position && {
        gridRowStart: position.y,
        gridColumnStart: position.x,
        gridRowEnd: position.y + rows,
        gridColumnEnd: position.x + columns,
      }),
    }}
    className={cn(className, "p-1")}
  >
    {children}
  </div>
)

export type GridRootProps = ClassNameProp

const Root = ({ children, className }: PropsWithChildren<GridRootProps>) => (
  <div
    className={cn(
      className,
      "grid grid-flow-dense grid-cols-[repeat(auto-fill,theme(width.20))] auto-rows-[theme(width.20)]"
    )}
  >
    {children}
  </div>
)

Root.displayName = "Grid.Root"
Item.displayName = "Grid.Item"
export const Grid = {
  Root,
  Item,
}
