"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, ReceiptText, TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { cn } from "@/lib/utils"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { es } from "date-fns/locale"

type Transaction = {
  id: string
  type: "income" | "expense"
  amount: number
  date: string
  detail: string
  category_id: string
  categories: {
    name: string
    parent_id: string | null
    parent: {
      name: string
    } | null
  }
}

type CategorySummary = {
  name: string
  value: number
  color: string
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", 
  "#10b981", "#06b6d4", "#3b82f6", "#84cc16", "#f97316"
]


type Category = {
  id: string
  name: string
  parent_id: string | null
}

export default function Gastos() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchData()
  }, [selectedMonth, selectedYear])

  const fetchData = async () => {
    setLoading(true)
    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
    const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0]

    // 1. Cargar todas las categorías para mapeo robusto
    const { data: catData } = await supabase.from("categories").select("*")
    if (catData) setCategories(catData)

    // 2. Cargar transacciones
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        categories!category_id (
          name,
          parent_id
        )
      `)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false })

    if (error) {
      toast.error("Error al cargar datos: " + error.message)
    } else {
      setTransactions(data as any || [])
    }
    setLoading(false)
  }

  // Funciones auxiliares de mapeo
  const getParentName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId)
    if (!cat) return "General"
    if (!cat.parent_id) return cat.name // Ya es categoría principal
    
    // Si tiene padre, buscar el nombre del padre
    const parent = categories.find(c => c.id === cat.parent_id)
    return parent ? parent.name : cat.name
  }

  const totals = transactions.reduce((acc, current) => {
    if (current.type === "income") acc.income += Number(current.amount)
    else acc.expense += Number(current.amount)
    return acc
  }, { income: 0, expense: 0 })

  const chartData = useMemo(() => {
    if (categories.length === 0 || transactions.length === 0) return []
    
    return transactions
      .filter(t => t.type === "expense")
      .reduce((acc: CategorySummary[], current) => {
        const catName = getParentName(current.category_id)
        const existing = acc.find(i => i.name === catName)
        if (existing) {
          existing.value += Number(current.amount)
        } else {
          acc.push({ name: catName, value: Number(current.amount), color: COLORS[acc.length % COLORS.length] })
        }
        return acc
      }, [])
      .sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  const filteredTransactions = transactions.filter(t => 
    t.detail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getParentName(t.category_id).toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Agrupamiento por Día
  const groupedTransactions = filteredTransactions.reduce((acc, t) => {
    const dateKey = t.date
    if (!acc[dateKey]) acc[dateKey] = { items: [], total: 0 }
    acc[dateKey].items.push(t)
    acc[dateKey].total += t.type === 'income' ? Number(t.amount) : -Number(t.amount)
    return acc
  }, {} as Record<string, { items: Transaction[], total: number }>)

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a))

  const formatHeaderDate = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return "Hoy"
    if (isYesterday(date)) return "Ayer"
    return format(date, "EEEE, d 'de' MMMM", { locale: es })
  }

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header y Filtros */}
      <div className="flex flex-col gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2 text-foreground">
            Registro <ReceiptText className="text-indigo-500 size-6" />
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Analiza tus finanzas con precisión visual.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex bg-muted/20 p-1 rounded-2xl shrink-0 border border-border/10 backdrop-blur-md">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent border-none text-[13px] font-bold px-3 py-2 focus:ring-0 outline-none appearance-none"
            >
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1} className="bg-card text-foreground">{name}</option>
              ))}
            </select>
            <div className="w-px h-4 bg-border/20 self-center mx-1" />
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent border-none text-[13px] font-bold px-3 py-2 focus:ring-0 outline-none appearance-none"
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y} className="bg-card text-foreground">{y}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-border/10 bg-muted/20 rounded-2xl text-sm font-medium focus:bg-muted/40 transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Tarjetas de Balance */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-indigo-500/5 border-border/10 rounded-[2rem] backdrop-blur-xl">
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <TrendingUp className="size-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ingresos</span>
            </div>
            <p className="text-2xl font-black text-indigo-100">S/ {totals.income.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-500/5 border-border/10 rounded-[2rem] backdrop-blur-xl">
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-rose-400">
              <TrendingDown className="size-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gastos</span>
            </div>
            <p className="text-2xl font-black text-rose-100">S/ {totals.expense.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Desglose */}
      {chartData.length > 0 ? (
        <Card className="border-border/10 bg-card/20 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Wallet className="size-4 text-indigo-500" />
                Agrupado por Padre
              </h3>
              <Badge variant="outline" className="rounded-full border-border/10 text-[10px] font-bold px-3 py-1 bg-muted/20">
                Gastos
              </Badge>
            </div>
            
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(20, 20, 25, 0.9)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 px-2">
              {chartData.slice(0, 4).map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[11px] font-bold text-muted-foreground truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : !loading && (
        <Card className="py-20 text-center border-dashed border-border/20 bg-transparent rounded-[2.5rem]">
          <CardContent className="flex flex-col items-center gap-4 text-muted-foreground/30">
            <Calendar className="size-16 opacity-10" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Sin actividad registrada</p>
          </CardContent>
        </Card>
      )}

      {/* Lista de Movimientos Agrupados */}
      <div className="space-y-8 px-1">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted/20 rounded-md" />
                <div className="h-20 bg-muted/20 rounded-[2rem]" />
              </div>
            ))}
          </div>
        ) : sortedDates.length > 0 ? (
          sortedDates.map((dateStr) => {
            const group = groupedTransactions[dateStr]
            return (
              <div key={dateStr} className="space-y-3">
                <div className="flex items-center justify-between px-3">
                  <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-70">
                    {formatHeaderDate(dateStr)}
                  </h3>
                  <p className={cn(
                    "text-[11px] font-black tracking-tighter",
                    group.total >= 0 ? "text-indigo-400" : "text-rose-400"
                  )}>
                    {group.total >= 0 ? '+' : ''} S/ {group.total.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {group.items.map((t) => (
                    <Card key={t.id} className="bg-card/20 border-border/5 border-t-border/10 hover:bg-card/30 transition-all rounded-[2rem] overflow-hidden group">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 leading-tight min-w-0">
                          <div className={cn(
                            "size-12 rounded-2xl flex items-center justify-center transition-all bg-muted/30 group-hover:scale-110 shrink-0",
                            t.type === 'income' ? "text-indigo-400" : "text-rose-400"
                          )}>
                            <ReceiptText className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-[15px] tracking-tight truncate">
                              {t.detail || t.categories?.name || "Movimiento"}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-black uppercase text-indigo-400/80 tracking-widest truncate">
                                {getParentName(t.category_id)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className={cn(
                            "font-black text-lg tracking-tighter",
                            t.type === 'income' ? "text-indigo-400" : "text-rose-400"
                          )}>
                            {t.type === 'income' ? '+' : '-'} S/ {Number(t.amount).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-20 text-center">
             <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">Lista vacía</p>
          </div>
        )}
      </div>
    </div>
  )
}
