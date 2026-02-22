"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Activity, Users, Camera, ShieldCheck, Loader2 } from "lucide-react"
import api from "@/lib/api"

export default function AnalyticsPage() {
    const [summary, setSummary] = useState({
        totalDetectionsToday: 0,
        totalAlertsToday: 0,
        mostActiveStream: 'None',
        peakHour: 12,
        automationRate: 0
    })
    const [timelineData, setTimelineData] = useState([])
    const [distributionData, setDistributionData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const [sumRes, timeRes, distRes] = await Promise.all([
                    api.get("/analytics/summary"),
                    api.get("/analytics/detections-timeline"),
                    api.get("/analytics/object-distribution")
                ])
                setSummary(sumRes.data)
                setTimelineData(timeRes.data)
                setDistributionData(distRes.data)
            } catch (error) {
                console.error("Failed to fetch analytics", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const stats = [
        { label: 'Total Sightings (Today)', value: summary.totalDetectionsToday.toLocaleString(), icon: Users, color: 'text-primary' },
        { label: 'Active Alerts (Today)', value: summary.totalAlertsToday.toLocaleString(), icon: Activity, color: 'text-red-500' },
        { label: 'Primary Node', value: summary.mostActiveStream, icon: Camera, color: 'text-blue-500' },
        { label: 'Automation Index', value: `${summary.automationRate}%`, icon: ShieldCheck, color: 'text-purple-500' },
    ]

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Aggregating Neural Data...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-syne tracking-tight">Neural Analytics</h1>
                <p className="text-muted-foreground font-space-mono text-xs uppercase tracking-wider mt-1">
                    Statistical insight into surveillance data
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-zinc-950 border-white/5 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-muted-foreground uppercase">{stat.label}</p>
                                    <p className="text-2xl font-bold font-syne mt-1">{stat.value}</p>
                                </div>
                                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-zinc-950 border-white/5 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="font-syne text-xl">Detection Density (24h)</CardTitle>
                        <CardDescription className="text-xs font-mono">Real-time object frequency across all hubs</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData}>
                                <defs>
                                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e94560" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e94560' }}
                                />
                                <Area type="monotone" dataKey="detections" stroke="#e94560" strokeWidth={2} fillOpacity={1} fill="url(#colorPrimary)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-white/5">
                    <CardHeader>
                        <CardTitle className="font-syne text-xl">Object Classification</CardTitle>
                        <CardDescription className="text-xs font-mono">Distribution of detected entities</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#ffffff60" fontSize={10} width={80} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" fill="#e94560" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
