import { VStack } from "./base/Stack"
import { Icon, IconProp } from "./Icon"
import { Text } from "./Text"

interface NoDataProps extends IconProp {
  message?: string
}
export const NoData = ({ icon, message }: NoDataProps) => (
  <VStack
    items="center"
    justify="center"
    gap="2"
    className="h-full w-full p-4 text-center"
  >
    <Icon
      icon={icon}
      color="muted"
      className="aspect-square h-auto max-h-full w-20 max-w-[calc(100%-theme(width.4))]"
    />
    {message && <Text color="muted">{message}</Text>}
  </VStack>
)
