import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Inversiones() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inversiones 📈</h1>
          <p className="text-muted-foreground">Monitorea el crecimiento de tu patrimonio.</p>
        </div>
        <div className="flex items-center gap-4 bg-card/40 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Balance Total</p>
            <p className="text-2xl font-bold">S/ 25,300.20</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Rendimiento</p>
            <p className="text-xl font-semibold text-emerald-500">+12.5%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              HAPI (Bolsa)
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-none">+8%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">S/ 12,000.00</p>
            <p className="text-xs text-muted-foreground mt-1">Diversificado en ETFs</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Cripto
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-none">+25%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">S/ 4,500.00</p>
            <p className="text-xs text-muted-foreground mt-1">BTC, ETH & SOL</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Plazo Fijo
              <Badge variant="secondary" className="text-[10px]">+6.5% Fix</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">S/ 8,800.20</p>
            <p className="text-xs text-muted-foreground mt-1">Banco Interbank</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/40 backdrop-blur-sm border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle>Composición del Portafolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 w-full flex items-center gap-1 rounded-xl overflow-hidden shadow-inner">
            <div className="h-full bg-primary hover:opacity-80 transition-opacity" style={{ width: "47%" }} />
            <div className="h-full bg-emerald-500 hover:opacity-80 transition-opacity" style={{ width: "18%" }} />
            <div className="h-full bg-amber-500 hover:opacity-80 transition-opacity" style={{ width: "35%" }} />
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary" />
              <span className="text-muted-foreground font-medium">Bolsa (47%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground font-medium">Cripto (18%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground font-medium">Plazo Fijo (35%)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
