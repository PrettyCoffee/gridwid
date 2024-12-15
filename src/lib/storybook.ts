/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-explicit-any */
import type { ReactRenderer } from "@storybook/react"
import { ComponentType } from "react"
import {
  ComponentAnnotations,
  ArgTypes,
  InputType,
} from "storybook/internal/types"

type CompOrProps = ComponentType<any> | Record<string, any>

type GetProps<T extends CompOrProps> = T extends ComponentType<infer TProps>
  ? TProps
  : T extends Record<string, any>
  ? T
  : never

type SbMeta<T extends CompOrProps> = ComponentAnnotations<
  ReactRenderer,
  GetProps<T>
>

type IgnoredProps = "ref" | "key" | "children" | "asChild"
type DefaultOmittedProps = "className"

export interface Meta<
  T extends CompOrProps,
  OmittedProps extends keyof GetProps<T> = DefaultOmittedProps
> extends Omit<SbMeta<T>, "argTypes" | "args"> {
  /**
   * Make argtypes required to ensure that the meta is always up to date
   */
  argTypes: Required<Omit<ArgTypes<GetProps<T>>, OmittedProps | IgnoredProps>>
  /**
   * Enforce passing args to the story
   */
  args: Omit<GetProps<T>, IgnoredProps>
}

const createArgTypes = <T extends Record<string, (args: any) => InputType>>(
  argTypes: T
) => argTypes

interface ControlRange {
  max?: number
  min?: number
  step?: number
}

const prop = (input: InputType) => ({
  ...input,
  table: { ...input.table, category: "Props" },
})

const callback = (input: InputType) => ({
  ...input,
  table: { ...input.table, category: "Callbacks" },
})

const optionsToArgTypes = (options?: Record<string, unknown> | unknown[]) => {
  if (!options) return undefined
  if (Array.isArray(options)) return { options }

  const keys = Object.keys(options)
  return { options: keys, mapping: options }
}

export const argType = createArgTypes({
  string: () => prop({ control: "text", table: { category: "Props" } }),
  boolean: () => prop({ control: "boolean" }),
  enum: (
    type: "radio" | "select" | "check" | "multi-select" = "radio",
    options?: Record<string, unknown> | unknown[]
  ) =>
    prop({
      control: type,
      ...optionsToArgTypes(options),
    }),
  number: (range: ControlRange = {}) =>
    prop({
      control: { type: "number", ...range },
    }),
  range: (range: ControlRange) =>
    prop({
      control: { type: "range", ...range },
    }),

  callback: () => callback({ control: false }),

  disabled: () => prop({ control: false }),
  hidden: () => ({ table: { disable: true } }),
})

export type { StoryObj } from "@storybook/react"
export { action } from "@storybook/addon-actions"
