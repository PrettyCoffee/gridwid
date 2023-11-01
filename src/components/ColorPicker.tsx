import { Dispatch, useId, useMemo } from "react"

import { Palette } from "lucide-react"

import { createRange } from "~/lib/createRange"
import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { HStack, VStack } from "./base/Stack"
import { IconButton } from "./IconButton"
import { InputLabel } from "./InputLabel"
import { Input } from "./ui/input"
import { Popover } from "./ui/popover"
import { SliderFragments } from "./ui/slider"

const ColorSwatch = ({
  color,
  className,
}: { color: string } & ClassNameProp) => (
  <div
    className={cn("h-5 w-5 rounded-sm border border-input", className)}
    style={{ backgroundColor: `hsl(${color})` }}
  />
)

const splitColor = (color: string) => {
  const [hue = 0, saturation = 0, lightness = 0] = color
    .replace(/%/g, "")
    .split(" ")
    .map(Number)

  return { hue, saturation, lightness }
}

const toColorString = ({ hue, saturation, lightness }: HslColor) =>
  `${hue} ${saturation}% ${lightness}%`

interface HslColor {
  hue: number
  saturation: number
  lightness: number
}

const maxValue: Record<keyof HslColor, number> = {
  hue: 360,
  saturation: 100,
  lightness: 100,
}

const createGradient = (color: HslColor, attribute: keyof HslColor) => {
  const amount = 20
  const step = maxValue[attribute] / amount
  const stops = createRange(amount).map(i => ({
    ...color,
    [attribute]: i * step,
  }))
  const colors = stops.map(color => `hsl(${toColorString(color)})`)
  return `linear-gradient(to right, ${colors.join(",")})`
}

interface ColorSliderProps {
  id: string
  value: string
  onChange: Dispatch<string>
  attribute: keyof HslColor
}

const ColorSlider = ({ id, value, onChange, attribute }: ColorSliderProps) => {
  const color = useMemo(() => splitColor(value), [value])
  const gradient = useMemo(
    () => createGradient(color, attribute),
    [color, attribute]
  )

  return (
    <SliderFragments.Root
      min={0}
      max={maxValue[attribute]}
      value={[color[attribute]]}
      onValueChange={([value]) =>
        value && onChange(toColorString({ ...color, [attribute]: value }))
      }
    >
      <SliderFragments.Track style={{ background: gradient }}>
        <SliderFragments.Range />
      </SliderFragments.Track>
      <SliderFragments.Thumb
        id={id}
        aria-label={attribute}
        style={{ background: `hsl(${toColorString(color)})` }}
        className="bg-input border-foreground"
      />
    </SliderFragments.Root>
  )
}

interface ColorPickerProps {
  id?: string
  value: string
  onChange: Dispatch<string>
}

export const ColorPicker = ({
  id: externalId,
  value,
  onChange,
}: ColorPickerProps) => {
  const internalId = useId()
  const id = externalId ?? internalId

  const getId = (attribute: string) => `color-picker-${attribute}-${id}`

  return (
    <Popover.Root>
      <HStack asChild items="center" className="relative">
        <Popover.Anchor>
          <ColorSwatch color={value} className="absolute left-3" />
          <Input
            id={id}
            value={value}
            onChange={({ target }) => onChange(target.value)}
            className="pl-10 pr-11"
          />
          <Popover.Trigger asChild>
            <IconButton
              title="Pick a color"
              icon={Palette}
              className="absolute right-0"
            />
          </Popover.Trigger>
        </Popover.Anchor>
      </HStack>
      <Popover.Content className="w-[var(--radix-popover-trigger-width)]">
        <VStack gap="2">
          {["hue", "saturation", "lightness"].map(attribute => (
            <HStack key={attribute} items="center">
              <InputLabel
                htmlFor={getId(attribute)}
                label={attribute}
                className="w-full"
              >
                <ColorSlider
                  id={getId(attribute)}
                  value={value}
                  onChange={onChange}
                  attribute={attribute as keyof HslColor}
                />
              </InputLabel>
            </HStack>
          ))}
        </VStack>
      </Popover.Content>
    </Popover.Root>
  )
}
