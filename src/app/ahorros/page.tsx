import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, Target, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Ahorros() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Ahorros 💰</h1>
        <p className="text-muted-foreground">Gestiona tus fondos de emergencia y metas de ahorro.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Fondo de Emergencia</CardTitle>
            <PiggyBank className="size-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">S/ 8,400.00</p>
              <p className="text-sm text-muted-foreground mt-1">Meta: S/ 12,000.00</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "70%" }} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>70% completado</span>
              <span className="text-primary font-medium">S/ 3,600.00 restantes</span>
            </div>
            <Button className="w-full gap-2 mt-2 shadow-lg shadow-primary/20">
              <ArrowUpRight className="size-4" />
              Aportar a Meta
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Meta: Viaje 2024</CardTitle>
            <Target className="size-6 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">S/ 4,000.00</p>
              <p className="text-sm text-muted-foreground mt-1">Meta: S/ 5,000.00</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "80%" }} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>80% completado</span>
              <span className="text-amber-500 font-medium">S/ 1,000.00 restantes</span>
            </div>
            <Button variant="outline" className="w-full border-amber-500/20 hover:bg-amber-500/10 text-amber-500 mt-2">
              Ver Detalles
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
