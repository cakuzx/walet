"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarMenuButton 
      size="lg" 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hover:bg-muted/50 rounded-xl px-4 transition-all duration-300"
      tooltip="Cambiar Tema"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight ml-2">
        <span className="truncate font-medium">Tema {theme === "dark" ? "Claro" : "Oscuro"}</span>
      </div>
    </SidebarMenuButton>
  )
}
