import { Dispatch, useMemo } from "react"

import { PopoverAnchor } from "@radix-ui/react-popover"
import { Palette } from "lucide-react"

import { createRange } from "~/lib/createRange"
import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { HStack, VStack } from "./base/Stack"
import { IconButton } from "./IconButton"
import { Input, InputLabel } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "./ui/slider"

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
  value: string
  onChange: Dispatch<string>
  attribute: keyof HslColor
}

const ColorSlider = ({ value, onChange, attribute }: ColorSliderProps) => {
  const color = useMemo(() => splitColor(value), [value])
  const gradient = useMemo(
    () => createGradient(color, attribute),
    [color, attribute]
  )

  return (
    <SliderRoot
      min={0}
      max={maxValue[attribute]}
      value={[color[attribute]]}
      onValueChange={([value]) =>
        value && onChange(toColorString({ ...color, [attribute]: value }))
      }
    >
      <SliderTrack style={{ background: gradient }}>
        <SliderRange />
      </SliderTrack>
      <SliderThumb
        className="bg-input border-foreground"
        aria-label={attribute}
        style={{ background: `hsl(${toColorString(color)})` }}
      />
    </SliderRoot>
  )
}

interface ColorPickerProps {
  value: string
  onChange: Dispatch<string>
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <Popover>
      <HStack asChild items="center" className="relative">
        <PopoverAnchor>
          <ColorSwatch color={value} className="absolute left-3" />
          <Input
            value={value}
            onChange={({ target }) => onChange(target.value)}
            className="pl-10 pr-12"
          />
          <PopoverTrigger asChild>
            <IconButton
              title="Pick a color"
              icon={Palette}
              className="absolute right-0"
            />
          </PopoverTrigger>
        </PopoverAnchor>
      </HStack>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
        <VStack gap="2">
          {["hue", "saturation", "lightness"].map(attribute => (
            <HStack key={attribute} items="center">
              <InputLabel label={attribute} className="w-full">
                <ColorSlider
                  value={value}
                  onChange={onChange}
                  attribute={attribute as keyof HslColor}
                />
              </InputLabel>
            </HStack>
          ))}
        </VStack>
      </PopoverContent>
    </Popover>
  )
}
