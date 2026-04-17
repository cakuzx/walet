"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-card/10 backdrop-blur-xl rounded-[2rem]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-2 relative items-center mb-4",
        caption_label: "text-sm font-black tracking-widest uppercase text-foreground/80",
        nav: "flex items-center justify-between absolute w-full px-2 left-0 z-10",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-muted/20 p-0 rounded-xl hover:bg-indigo-500/20 text-indigo-400 border-none transition-all"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-muted/20 p-0 rounded-xl hover:bg-indigo-500/20 text-indigo-400 border-none transition-all"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex justify-between mb-2",
        weekday: "text-muted-foreground w-9 font-bold text-[10px] uppercase tracking-tighter text-center opacity-40",
        week: "flex w-full mt-1 justify-between",
        day: "h-9 w-9 text-center text-sm p-0 flex items-center justify-center relative rounded-xl transition-all hover:bg-muted/30 focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-bold rounded-xl aria-selected:opacity-100"
        ),
        selected: "bg-indigo-600 !text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 rounded-xl",
        today: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        outside: "text-muted-foreground/20 opacity-30",
        disabled: "text-muted-foreground opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) => {
          if (props.orientation === 'left') return <ChevronLeft className="h-4 w-4" />
          return <ChevronRight className="h-4 w-4" />
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
