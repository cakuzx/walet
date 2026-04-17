"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, TrendingDown, PiggyBank, Droplets, Wallet, ReceiptText, ChevronRight,
  Activity
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { format, startOfMonth, endOfMonth, subDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  defs, linearGradient, stop 
} from "recharts"

export default function Dashboard() {
  const [data, setData] = useState({
    incomeMonth: 0,
    expenseMonth: 0,
    totalBalance: 0,
    waterIntake: 0,
    recentTransactions: [] as any[],
    weeklyData: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    const now = new Date()
    const monthStart = format(startOfMonth(now), "yyyy-MM-dd")
    const monthEnd = format(endOfMonth(now), "yyyy-MM-dd")
    const today = format(now, "yyyy-MM-dd")

    try {
      // 1. Transacciones del mes
      const { data: monthData } = await supabase
        .from("transactions")
        .select("amount, type")
        .gte("date", monthStart)
        .lte("date", monthEnd)

      let inc = 0
      let exp = 0
      monthData?.forEach(t => {
        if (t.type === "income") inc += Number(t.amount)
        else exp += Number(t.amount)
      })

      // 2. Balance Total (Histórico)
      const { data: allData } = await supabase
        .from("transactions")
        .select("amount, type")

      let totalInc = 0
      let totalExp = 0
      allData?.forEach(t => {
        if (t.type === "income") totalInc += Number(t.amount)
        else totalExp += Number(t.amount)
      })

      // 3. Hidratación hoy
      const { count: waterCount } = await supabase
        .from("water_intake")
        .select("*", { count: 'exact', head: true })
        .eq("intake_date", today)

      // 4. Últimos movimientos
      const { data: recent } = await supabase
        .from("transactions")
        .select(`
          *,
          categories (name)
        `)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3)

      // 5. Datos Semanales (Gastos últimos 7 días)
      const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i))
      const startDate7 = format(last7Days[0], "yyyy-MM-dd")
      
      const { data: transactions7 } = await supabase
        .from("transactions")
        .select("amount, date, type")
        .eq("type", "expense")
        .gte("date", startDate7)

      const weekly = last7Days.map(day => {
        const dateStr = format(day, "yyyy-MM-dd")
        const dailyTotal = transactions7
          ?.filter(t => t.date === dateStr)
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0
        
        return {
          day: format(day, "eee", { locale: es }).toUpperCase(),
          amount: dailyTotal
        }
      })

      setData({
        incomeMonth: inc,
        expenseMonth: exp,
        totalBalance: totalInc - totalExp,
        waterIntake: waterCount || 0,
        recentTransactions: recent || [],
        weeklyData: weekly
      })
    } catch (error) {
      console.error("Error fetching dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20 px-1">
      {/* Saludo */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          ¡Hola, Usuario! 👋
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Tienes un {data.totalBalance >= 0 ? 'excedente' : 'déficit'} de S/ {Math.abs(data.totalBalance).toLocaleString()} en tu patrimonio global.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Ingresos Mes */}
        <Card className="bg-indigo-500/5 border-border/10 rounded-[2rem] hover:bg-indigo-500/[0.08] transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
             <TrendingUp className="size-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
              <TrendingUp className="size-3" /> Ingresos Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">S/ {data.incomeMonth.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Actualizado hoy</p>
          </CardContent>
        </Card>

        {/* Gastos Mes */}
        <Card className="bg-rose-500/5 border-border/10 rounded-[2rem] hover:bg-rose-500/[0.08] transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
             <TrendingDown className="size-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 flex items-center gap-2">
              <TrendingDown className="size-3" /> Gastos Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">S/ {data.expenseMonth.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Controlando flujo</p>
          </CardContent>
        </Card>

        {/* Ahorros/Balance */}
        <Card className="bg-amber-500/5 border-border/10 rounded-[2rem] hover:bg-amber-500/[0.08] transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
             <PiggyBank className="size-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2">
              <Wallet className="size-3" /> Balance Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">S/ {data.totalBalance.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Patrimonio Neto</p>
          </CardContent>
        </Card>

        {/* Hidratación */}
        <Card className="bg-sky-500/5 border-border/10 rounded-[2rem] hover:bg-sky-500/[0.08] transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
             <Droplets className="size-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 flex items-center gap-2">
              <Droplets className="size-3" /> Hidratación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{data.waterIntake} / 10</div>
            <div className="w-full bg-sky-500/10 h-1 rounded-full mt-2 overflow-hidden">
               <div className="bg-sky-500 h-full transition-all duration-1000" style={{ width: `${(data.waterIntake / 10) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Resumen Semanal (Picos) */}
        <Card className="lg:col-span-4 bg-card/10 border-border/10 rounded-[2.5rem] backdrop-blur-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
              <Activity className="size-4 text-indigo-500" />
              Gastos Semanales
            </CardTitle>
            <div className="text-[10px] font-black text-muted-foreground bg-indigo-500/10 px-3 py-1 rounded-full">
              Último 7d
            </div>
          </CardHeader>
          <CardContent className="h-[280px] p-0 pt-4 pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: 'currentColor', opacity: 0.6 }}
                  className="text-muted-foreground"
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgb(20 20 25 / 0.9)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                  labelStyle={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}
                  itemStyle={{ fontSize: '14px', fontWeight: '900', color: '#6366f1' }}
                  formatter={(value: any) => [`S/ ${Number(value).toLocaleString()}`, 'Gasto']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Últimos Movimientos */}
        <Card className="lg:col-span-3 bg-card/10 border-border/10 rounded-[2.5rem] backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-50">Últimos Movimientos</CardTitle>
            <Link href="/gastos">
              <ChevronRight className="size-4 text-muted-foreground hover:text-indigo-400 transition-colors" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center bg-muted/50",
                        item.type === 'income' ? 'text-indigo-400' : 'text-rose-400'
                      )}>
                        <ReceiptText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate tracking-tight">{item.detail || item.categories?.name || "Movimiento"}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                          {format(new Date(item.date), "dd MMM", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-black tracking-tighter shrink-0",
                      item.type === 'income' ? 'text-indigo-400' : 'text-rose-400'
                    )}>
                      {item.type === 'income' ? '+' : '-'} S/ {Number(item.amount).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-20">
                   <p className="text-[10px] font-black uppercase tracking-widest">Sin actividad reciente</p>
                </div>
              )}
            </div>
            {data.recentTransactions.length > 0 && (
              <Link href="/gastos" className="block text-center mt-6 text-[10px] font-black uppercase tracking-widest text-indigo-400/60 hover:text-indigo-400 transition-colors">
                 Ver todo el registro
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
