import * as React from "react"
import { PropsWithChildren } from "react"

import { cn } from "~/lib/utils"

import { VStack } from "../base/Stack"
import { Text } from "../Text"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

interface InputLabelProps {
  label: string
}
const InputLabel = ({
  label,
  children,
}: PropsWithChildren<InputLabelProps>) => (
  <VStack asChild gap="2">
    <label>
      <Text color="muted" noOverflow style="small">
        {label}
      </Text>
      {children}
    </label>
  </VStack>
)

export { Input, InputLabel }
