import { keyframes, css } from "goober"
import { Ghost } from "lucide-react"

import { Icon } from "components/ui/icon"
import { cn } from "utils/cn"

const rotate = keyframes`
  0%, 100% {
    translate: 1rem;
    rotate: -10deg;
    top: 0;
  }
  25%, 75% {
    top: -1rem;
  }
  50% {
    translate: -1rem;
    rotate: 10deg;
    top: 0;
  }
`

const shadowSlide = keyframes`
  0%, 100% {
    transform: translateX(1.5rem);
    width: 3.25rem;
    height: 0.5rem;
    opacity: 0.5;
  }
  25%, 75% {
    width: 3.1rem;
    opacity: 0.4;
  }
  50% {
    transform: translateX(-1.5rem);
    width: 3.25rem;
    height: 0.5rem;
    opacity: 0.5;
  }
`

const shadow = css`
  animation: ${shadowSlide} 2.5s infinite ease-in-out;
`

const animate = css`
  animation: ${rotate} 2.5s infinite ease-in-out;
`

export const NoData = ({ label }: { label: string | JSX.Element }) => (
  <div className="flex flex-col items-center gap-8 py-4">
    <div className="relative flex size-20 items-center justify-center">
      <Icon
        icon={Ghost}
        color="gentle"
        className={cn("absolute size-[4.5rem]", animate)}
      />
      <div
        className={cn("absolute -bottom-4 rounded-[50%] bg-black", shadow)}
      />
    </div>
    <span className="text-md text-muted-foreground block max-w-80 text-center font-bold">
      {label}
    </span>
  </div>
)
