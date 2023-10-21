import * as React from "react"

import * as SliderPrimitive from "@radix-ui/react-slider"

import { focusRing } from "~/lib/styles"
import { cn } from "~/lib/utils"

const SliderRoot = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  />
))
SliderRoot.displayName = SliderPrimitive.Root.displayName

const SliderTrack = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Track
    ref={ref}
    className={cn(
      "relative h-1 my-2 mx-2.5 w-full grow overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
SliderTrack.displayName = SliderPrimitive.Track.displayName

const SliderRange = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Range>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Range
    ref={ref}
    className={cn("absolute h-full", className)}
    {...props}
  />
))
SliderRange.displayName = SliderPrimitive.Range.displayName

const SliderThumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(
      "block h-5 w-5 rounded-full border-2 disabled:pointer-events-none disabled:opacity-50",
      "relative after:block after:w-10 after:h-10 after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
      focusRing,
      className
    )}
    {...props}
  />
))
SliderThumb.displayName = SliderPrimitive.Thumb.displayName

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderRoot ref={ref} className={className} {...props}>
    <SliderTrack className="bg-muted">
      <SliderRange className="bg-accent" />
    </SliderTrack>
    <SliderThumb className="border-accent bg-button" />
  </SliderRoot>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider, SliderRoot, SliderTrack, SliderRange, SliderThumb }
