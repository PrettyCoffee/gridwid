import { PropsWithChildren, ReactNode } from "react"

import { keyframes, css } from "goober"
import { Ghost } from "lucide-react"

import { Icon } from "components/ui/icon"
import { cn } from "utils/cn"

import { hstack, vstack } from "../../../utils/styles"

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

interface NoDataProps {
  label: string | ReactNode
}
export const NoData = ({ label, children }: PropsWithChildren<NoDataProps>) => (
  <div className={cn(vstack({ align: "center", gap: 4 }), "py-4")}>
    <div
      className={cn(
        hstack({ align: "center", justify: "center" }),
        "relative mb-4 size-20"
      )}
    >
      <Icon
        icon={Ghost}
        color="gentle"
        className={cn("absolute size-18", animate)}
      />
      <div
        className={cn("absolute -bottom-4 rounded-[50%] bg-black", shadow)}
      />
    </div>
    <span className="block max-w-80 text-center font-bold text-text">
      {label}
    </span>
    {children && <div className={hstack({ gap: 2 })}>{children}</div>}
  </div>
)
