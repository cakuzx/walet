"use client"

import * as React from "react"
import {
  Wallet,
  ReceiptText,
  PiggyBank,
  TrendingUp,
  Droplets,
  LayoutDashboard,
  PlusCircle,
  Settings,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
  user: {
    name: "Usuario",
    email: "finanzas@walet.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Registrar",
      url: "/registrar",
      icon: PlusCircle,
    },
    {
      title: "Registro de Gastos",
      url: "/gastos",
      icon: ReceiptText,
    },
    {
      title: "Ahorros",
      url: "/ahorros",
      icon: PiggyBank,
    },
    {
      title: "Inversiones",
      url: "/inversiones",
      icon: TrendingUp,
    },
    {
      title: "Hidratación",
      url: "/hidratacion",
      icon: Droplets,
    },
  ],
}

import { ModeToggle } from "@/components/mode-toggle"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/40 bg-sidebar/50 backdrop-blur-md">
      <SidebarHeader className="h-20 flex items-center px-6 border-b border-border/40 mb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />} className="hover:bg-transparent">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Wallet className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                <span className="truncate font-black text-xl tracking-tight text-foreground">Walet</span>
                <span className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Finanzas & Hábitos</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="gap-1">
              {data.navMain.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      tooltip={item.title}
                      isActive={isActive}
                      size="lg"
                      className={`
                        flex items-center gap-4 px-4 h-14 rounded-2xl transition-all duration-300 group
                        ${isActive 
                          ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}
                      `}
                    >
                      <item.icon className={`size-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary" : "opacity-50"}`} />
                      <span className={`text-[15px] tracking-tight ${isActive ? "font-bold" : "font-semibold"}`}>
                        {item.title}
                      </span>
                      {isActive && <div className="ml-auto size-1.5 rounded-full bg-primary animate-pulse" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4 space-y-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-14 hover:bg-muted/50 rounded-2xl px-4 transition-all duration-300">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted/50">
                <Settings className="size-4 text-muted-foreground" />
              </div>
              <div className="grid flex-1 text-left text-[15px] leading-tight ml-3">
                <span className="truncate font-semibold text-muted-foreground">Configuración</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
