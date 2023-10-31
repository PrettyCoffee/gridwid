import { PropsWithChildren } from "react"

import { ClassNameProp } from "./base/BaseProps"
import { VStack } from "./base/Stack"
import { Text } from "./Text"

interface InputLabelProps extends ClassNameProp {
  htmlFor: string
  label: string
}
const InputLabel = ({
  htmlFor,
  label,
  children,
  className,
}: PropsWithChildren<InputLabelProps>) => (
  <VStack gap="2" className={className}>
    <Text color="muted" style="small" asChild>
      <label htmlFor={htmlFor} className="w-max">
        {label}
      </label>
    </Text>
    {children}
  </VStack>
)

export { InputLabel }
