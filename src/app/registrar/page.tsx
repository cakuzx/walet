"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ChevronsUpDown, Search, Calendar as CalendarIcon, Notebook as NotebookEmoji, Book as BookEmoji } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

type Category = {
  id: string
  name: string
  type: string
  parent_id: string | null
}

export default function Registrar() {
  const isMobile = useIsMobile()
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [detail, setDetail] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedParent, setSelectedParent] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [openCat, setOpenCat] = useState(false)
  const [openSub, setOpenSub] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name")
    
    if (error) {
      toast.error("Error al cargar categorías")
    } else {
      setCategories(data || [])
    }
  }

  const parentCategories = categories.filter(c => !c.parent_id && (c.type === type || (type === "expense" && c.type === "expense" && c.name !== 'Sueldo FDM')))
  const subCategories = categories.filter(c => c.parent_id === selectedParent)

  const selectedParentName = categories.find(c => c.id === selectedParent)?.name
  const selectedSubName = categories.find(c => c.id === selectedSub)?.name

  const handleSubmit = async () => {
    if (!amount || !selectedParent) {
      toast.error("Por favor completa los campos obligatorios")
      return
    }

    setLoading(true)
    const { error } = await supabase.from("transactions").insert({
      type,
      amount: parseFloat(amount),
      detail,
      category_id: selectedSub || selectedParent,
      date: format(selectedDate, 'yyyy-MM-dd')
    })

    setLoading(false)

    if (error) {
      toast.error("Error al guardar: " + error.message)
    } else {
      toast.success("¡Registro guardado correctamente! 🎉")
      setAmount("")
      setDetail("")
      setSelectedParent(null)
      setSelectedSub(null)
      setSelectedDate(new Date())
    }
  }

  const CategorySelector = () => (
    <Command className="border-none">
      <CommandInput placeholder="Buscar categoría..." className="h-12" />
      <CommandList className="max-h-[300px]">
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup>
          {parentCategories.map((cat) => (
            <CommandItem
              key={cat.id}
              value={cat.name}
              onSelect={() => {
                setSelectedParent(cat.id)
                setSelectedSub(null)
                setOpenCat(false)
              }}
              className="h-12 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <NotebookEmoji className="size-4 text-indigo-400" />
                {cat.name}
              </div>
              <Check
                className={cn(
                  "size-4 text-indigo-500",
                  selectedParent === cat.id ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  const SubcategorySelector = () => (
    <Command className="border-none">
      <CommandInput placeholder="Buscar subcategoría..." className="h-12" />
      <CommandList className="max-h-[300px]">
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup>
          {subCategories.map((sub) => (
            <CommandItem
              key={sub.id}
              value={sub.name}
              onSelect={() => {
                setSelectedSub(sub.id)
                setOpenSub(false)
              }}
              className="h-12 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <BookEmoji className="size-4 text-violet-400" />
                {sub.name}
              </div>
              <Check
                className={cn(
                  "size-4 text-violet-500",
                  selectedSub === sub.id ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 md:pb-8">
      <div className="flex flex-col gap-1 px-4">
        <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2 text-foreground">
          {type === 'expense' ? 'Gasto' : 'Ingreso'}
          <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full uppercase tracking-widest text-muted-foreground align-middle">Nuevo</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Registra tus movimientos financieros con precisión.</p>
      </div>

      <Card className="border-none bg-card/30 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-6 space-y-8">
          {/* Alternador de Tipo */}
          <div className="flex p-1 bg-muted/40 rounded-2xl w-full">
            <button 
              className={cn("flex-1 h-11 rounded-xl text-xs font-bold transition-all duration-300", 
                type === "income" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground")}
              onClick={() => { setType("income"); setSelectedParent(null); setSelectedSub(null); }}
            >
              Ingreso
            </button>
            <button 
              className={cn("flex-1 h-11 rounded-xl text-xs font-bold transition-all duration-300", 
                type === "expense" ? "bg-background text-rose-500 shadow-sm" : "text-muted-foreground")}
              onClick={() => { setType("expense"); setSelectedParent(null); setSelectedSub(null); }}
            >
              Gasto
            </button>
          </div>

          {/* Costo / Monto */}
          <div className="space-y-3">
            <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Monto del Movimiento</Label>
            <div className="relative group px-1">
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-4xl font-black text-muted-foreground/30 group-focus-within:text-indigo-500/50 transition-colors">S/</span>
              <input 
                type="number" 
                inputMode="decimal"
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent border-none text-5xl font-black focus:ring-0 p-0 pl-16 outline-none placeholder:text-muted-foreground/20" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Categoría Principal */}
            <div className="space-y-2">
              <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                Categoría
              </Label>
              {isMobile ? (
                <Drawer open={openCat} onOpenChange={setOpenCat}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full h-14 justify-between px-4 rounded-2xl bg-muted/20 border-border/20 text-[15px] font-semibold hover:bg-muted/40 transition-all">
                      {selectedParentName || "Seleccionar categoría"}
                      <ChevronsUpDown className="size-4 opacity-30" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="rounded-t-[2.5rem] p-2">
                    <DrawerHeader>
                      <DrawerTitle>Categoría</DrawerTitle>
                    </DrawerHeader>
                    <CategorySelector />
                  </DrawerContent>
                </Drawer>
              ) : (
                <Popover open={openCat} onOpenChange={setOpenCat}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full h-14 justify-between px-4 rounded-2xl bg-muted/20 border-border/20 text-[15px] font-semibold hover:bg-muted/40 transition-all">
                      {selectedParentName || "Seleccionar categoría"}
                      <ChevronsUpDown className="size-4 opacity-30" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[--radix-popover-trigger-width] rounded-2xl overflow-hidden shadow-2xl border-border/20" align="start">
                    <CategorySelector />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Subcategoría */}
            {selectedParent && subCategories.length > 0 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  Subcategoría
                </Label>
                {isMobile ? (
                  <Drawer open={openSub} onOpenChange={setOpenSub}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="w-full h-14 justify-between px-4 rounded-2xl bg-indigo-500/5 border-indigo-500/10 text-[15px] font-semibold hover:bg-indigo-500/10 transition-all">
                        {selectedSubName || "Escoger..."}
                        <ChevronsUpDown className="size-4 opacity-30" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="rounded-t-[2.5rem] p-2">
                      <DrawerHeader>
                        <DrawerTitle>Subcategoría</DrawerTitle>
                      </DrawerHeader>
                      <SubcategorySelector />
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Popover open={openSub} onOpenChange={setOpenSub}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-14 justify-between px-4 rounded-2xl bg-indigo-500/5 border-indigo-500/10 text-[15px] font-semibold hover:bg-indigo-500/10 transition-all">
                        {selectedSubName || "Escoger..."}
                        <ChevronsUpDown className="size-4 opacity-30" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[--radix-popover-trigger-width] rounded-2xl overflow-hidden shadow-2xl border-border/20" align="start">
                      <SubcategorySelector />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )}
          </div>

          {/* Fecha y Detalle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-14 justify-start text-left font-semibold rounded-2xl bg-muted/20 border-border/20",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border/20" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Detalle</Label>
              <Input 
                placeholder="Ej. Almuerzo menú..." 
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="h-14 bg-muted/20 border-border/20 rounded-2xl text-[15px] font-semibold px-4" 
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              variant="ghost" 
              className="h-14 rounded-2xl font-bold text-muted-foreground hover:bg-muted/50"
              onClick={() => {
                setAmount(""); setDetail(""); setSelectedParent(null); setSelectedSub(null); setSelectedDate(new Date());
              }}
            >
              Limpiar
            </Button>
            <Button 
              className="h-14 rounded-2xl font-black text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "..." : "Guardar"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-[10px] text-muted-foreground/50 font-bold uppercase tracking-[0.1em]">
        Finanzas con Estética Fintech
      </p>
    </div>
  )
}
