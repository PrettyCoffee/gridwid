import {
  Children,
  Dispatch,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { IconProp } from "types/base-props"
import { clamp } from "utils/clamp"
import { createContext } from "utils/create-context"

import { KeyEventDispatcher } from "../../../utils/key-event-dispatcher"
import { IconButton } from "../icon-button"

interface ContextState {
  current: string
  onChange: Dispatch<string>
  setCurrentOptionRef: Dispatch<HTMLElement>
}
const { Provider, useRequiredValue } =
  createContext<ContextState>("StateSwitch")

export interface StateSwitchOptionProps extends Required<IconProp> {
  /** Label that is describing the state */
  label: string
  /** Value representing the state */
  value: string
}

export const Option = ({ value, label, icon }: StateSwitchOptionProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { current, onChange, setCurrentOptionRef } = useRequiredValue()

  useEffect(() => {
    if (!ref.current || current !== value) return
    setCurrentOptionRef(ref.current)
  }, [current, setCurrentOptionRef, value])

  return (
    <IconButton
      ref={ref}
      icon={icon}
      title={label}
      active={current === value}
      onClick={() => onChange(value)}
    />
  )
}

const isStateOption = (
  child: ReactNode
): child is ReactElement<StateSwitchOptionProps> =>
  isValidElement(child) && "props" in child && "value" in child.props

const getValues = (children: ReactNode) =>
  Children.toArray(children).flatMap(child =>
    isStateOption(child) ? child.props.value : []
  )

export interface StateSwitchGroupProps {
  /** Current state */
  current: string
  /** Handler to be called when clicking a state */
  onChange: Dispatch<string>
}

const Group = ({
  current,
  onChange,
  children,
}: PropsWithChildren<StateSwitchGroupProps>) => {
  const groupRef = useRef<HTMLDivElement | null>(null)
  const [currentOptionRef, setCurrentOptionRef] = useState<HTMLElement>()

  const keyHandler = useMemo(() => {
    const changeIndex = (change: number) => {
      const values = getValues(children)
      const newIndex = clamp(
        values.indexOf(current) + change,
        0,
        values.length - 1
      )
      const newValue = values[newIndex]
      if (newValue && newValue !== current) {
        onChange(newValue)

        const newRef =
          change > 0
            ? currentOptionRef?.nextSibling
            : currentOptionRef?.previousSibling
        if (newRef instanceof HTMLElement) newRef.focus()
      }
    }

    return new KeyEventDispatcher({})
      .listen({
        key: ["ArrowRight", "ArrowUp"],
        handler: () => changeIndex(1),
      })
      .listen({
        key: ["ArrowLeft", "ArrowDown"],
        handler: () => changeIndex(-1),
      })
  }, [children, current, currentOptionRef, onChange])

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- children are interactive and the event bubbles up
    <div
      ref={groupRef}
      className="relative"
      onKeyDown={event => keyHandler.emit(event)}
    >
      <div
        className={
          "border-highlight absolute size-10 rounded-md border transition-[translate] duration-150 ease-out"
        }
        style={{ translate: currentOptionRef?.offsetLeft ?? 0 }}
      />
      <Provider value={{ current, onChange, setCurrentOptionRef }}>
        {children}
      </Provider>
    </div>
  )
}

export const StateSwitch = {
  Group,
  Option,
}
