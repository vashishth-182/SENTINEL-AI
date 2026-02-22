"use client"

import { useEffect, useState } from "react"
import { ShieldAlert, Bell, Clock, MoreVertical, Trash2 } from "lucide-react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Alert {
    id: string
    stream_name: string
    alert_type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    created_at: string
    resolved: boolean
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchAlerts = async () => {
        try {
            setIsLoading(true)
            const response = await api.get("/alerts/")
            setAlerts(response.data)
        } catch (error) {
            toast.error("Failed to load alerts")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
    }, [])

    const handleResolve = async (id: string) => {
        try {
            await api.patch(`/alerts/${id}/resolve`)
            toast.success("Alert resolved")
            fetchAlerts()
        } catch (error) {
            toast.error("Failed to resolve alert")
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/50'
            case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/50'
            case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
            default: return 'bg-blue-500/20 text-blue-500 border-blue-500/50'
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-syne tracking-tight">Incidents & Alerts</h1>
                    <p className="text-muted-foreground font-space-mono text-xs uppercase tracking-wider mt-1">
                        Real-time security bypass notifications
                    </p>
                </div>
                <Button variant="outline" className="border-white/10 font-mono text-xs">MARK ALL AS RESOLVED</Button>
            </div>

            <div className="grid gap-4">
                {alerts.length === 0 ? (
                    <div className="h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                        <Clock className="w-12 h-12 text-zinc-800 mb-2" />
                        <p className="font-mono text-xs text-zinc-600 uppercase">Clear Sky • No Incidents Reported</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <Card key={alert.id} className={`bg-zinc-950/50 border-white/5 hover:border-primary/20 transition-all overflow-hidden relative group ${alert.resolved ? 'opacity-50' : ''}`}>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.severity === 'critical' ? 'bg-red-500' :
                                alert.severity === 'high' ? 'bg-orange-500' : 'bg-primary'
                                }`}></div>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-3 rounded-xl ${getSeverityColor(alert.severity)}`}>
                                            <ShieldAlert className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg font-syne uppercase tracking-tight">{alert.alert_type}</h3>
                                            <p className="text-xs text-zinc-400 mt-1">{alert.description}</p>
                                            <div className="flex items-center space-x-3 text-[10px] text-muted-foreground font-mono mt-3">
                                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(alert.created_at).toLocaleString()}</span>
                                                <span>•</span>
                                                <span className="text-primary font-bold uppercase">{alert.stream_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {!alert.resolved && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 font-mono text-[9px]"
                                                onClick={() => handleResolve(alert.id)}
                                            >
                                                RESOLVE
                                            </Button>
                                        )}
                                        <Badge variant="outline" className={`${getSeverityColor(alert.severity)} uppercase font-mono text-[10px]`}>
                                            {alert.severity}
                                        </Badge>
                                        <Button size="icon" variant="ghost" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
