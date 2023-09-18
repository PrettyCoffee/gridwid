import { IconProp } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

interface IframePopupProps extends IconProp {
  src: string
  title: string
}

export const IframePopup = ({ src, title, icon }: IframePopupProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <IconButton icon={icon} title={title} />
    </PopoverTrigger>
    <PopoverContent className="mb-1 p-0 border-0 h-[calc(theme(height.48)*3)] w-[calc(theme(height.48)*2)] overflow-hidden">
      <iframe src={src} title={title} className="h-full w-full" />
    </PopoverContent>
  </Popover>
)
