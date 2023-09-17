import { Icon, IconProp } from "./Icon"
import { Text } from "./Text"

interface NoDataProps extends IconProp {
  message?: string
}
export const NoData = ({ icon, message }: NoDataProps) => (
  <div className="h-full w-full p-2 flex flex-col gap-2 items-center justify-center">
    <Icon
      icon={icon}
      color="muted"
      className="aspect-square h-auto max-h-full w-20 max-w-[calc(100%-theme(width.4))]"
    />
    {message && <Text color="muted">{message}</Text>}
  </div>
)
