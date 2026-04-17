import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hidratacion() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Hidratación 💧</h1>
        <p className="text-muted-foreground">Cada vaso cuenta. Mantente saludable hoy.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1 bg-primary/5 border-primary/20 flex flex-col items-center justify-center p-8 text-center shadow-inner">
          <div className="relative">
            <Droplets className="size-20 text-primary drop-shadow-lg" />
            <div className="absolute inset-x-0 bottom-0 text-2xl font-black text-primary-foreground transform translate-y-2">6</div>
          </div>
          <div className="mt-6">
            <p className="text-4xl font-black">6 / 10</p>
            <p className="text-sm text-muted-foreground font-medium mt-1">Vasos hoy</p>
          </div>
          <Button className="mt-8 size-16 rounded-full shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
            <span className="text-2xl font-bold">+1</span>
          </Button>
        </Card>

        <Card className="md:col-span-2 bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Historial de Hoy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "08:30 AM", status: "Realizado" },
              { time: "10:15 AM", status: "Realizado" },
              { time: "12:45 PM", status: "Realizado" },
              { time: "02:30 PM", status: "Realizado" },
              { time: "03:45 PM", status: "Realizado" },
              { time: "05:10 PM", status: "Realizado" },
            ].map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="size-4 text-blue-500" />
                  </div>
                  <span className="font-medium">{entry.time}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold">
                  <CheckCircle2 className="size-4" />
                  {entry.status}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
