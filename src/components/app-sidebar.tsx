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
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Wallet className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold text-lg tracking-tight">Walet</span>
                  <span className="truncate text-xs text-muted-foreground">Finanzas & Hábitos</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${pathname === item.url 
                        ? "bg-primary/10 text-primary font-medium shadow-sm" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}
                    `}
                  >
                    <Link href={item.url}>
                      <item.icon className={`size-5 ${pathname === item.url ? "text-primary" : ""}`} />
                      <span className="text-sm">{item.title}</span>
                      {pathname === item.url && <ChevronRight className="ml-auto size-4 opacity-50" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-muted/50 rounded-xl px-4">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted">
                <Settings className="size-4 text-muted-foreground" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium">Configuración</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
