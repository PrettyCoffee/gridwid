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

export const argType = createArgTypes({
  string: () => prop({ control: "text", table: { category: "Props" } }),
  boolean: () => prop({ control: "boolean" }),
  enum: (
    type: "radio" | "select" = "radio",
    options?: Record<string, unknown>
  ) =>
    prop({
      control: { type, labels: options },
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
