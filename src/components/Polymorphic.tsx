import { ComponentProps, ElementType, ReactNode, Ref, forwardRef } from "react"

export interface PolymorphicOwnProps<E extends ElementType = ElementType> {
  as?: E
}

export type PolymorphicProps<E extends ElementType> = PolymorphicOwnProps<E> &
  Omit<ComponentProps<E>, keyof PolymorphicOwnProps>

const defaultElement = "div"

export const Polymorphic: <E extends ElementType = typeof defaultElement>(
  props: PolymorphicProps<E>
) => ReactNode = forwardRef(
  ({ as, ...props }: PolymorphicOwnProps, ref: Ref<Element>) => {
    const Element = as ?? defaultElement
    return <Element ref={ref} {...props} />
  }
)

// @ts-expect-error ts(2339)
Polymorphic.displayName = "Polymorphic"
