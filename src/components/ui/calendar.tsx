import * as React from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const Calendar = ({ className, classNames, ...props }: CalendarProps) => {
  return (
    <DayPicker
      fixedWeeks
      showOutsideDays
      className={className}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption:
          "flex justify-center pl-3 relative items-center justify-between",
        caption_label: "text-sm font-medium",
        nav: "flex gap-1 items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline", size: "compactIcon" })
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex space-x-1",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full space-x-1 [&:not(:last-of-type)]:mb-1",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "flex items-center rounded justify-center h-8 w-8 p-0 font-normal aria-selected:opacity-100",
        day_selected: "text-accent",
        day_today: "bg-accent/10 text-accent",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-button aria-selected:text-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
