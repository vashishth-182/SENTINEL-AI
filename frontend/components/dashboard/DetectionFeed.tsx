"use client"

import { useEffect, useState } from "react"
import { Activity, Clock, User, Car, Box, ShieldAlert } from "lucide-react"
import api from "@/lib/api"

interface Detection {
    id: string
    object_class: string
    confidence: number
    timestamp: string
}

export function DetectionFeed() {
    const [detections, setDetections] = useState<Detection[]>([])

    const fetchDetections = async () => {
        try {
            const response = await api.get("/detections/?limit=20")
            setDetections(response.data)
        } catch (error) {
            console.error("Failed to fetch detections:", error)
        }
    }

    useEffect(() => {
        fetchDetections()
        const interval = setInterval(fetchDetections, 5000) // Polling every 5 seconds
        return () => clearInterval(interval)
    }, [])

    const getIcon = (cls: string) => {
        switch (cls.toLowerCase()) {
            case 'person': return <User className="w-4 h-4" />
            case 'car':
            case 'truck': return <Car className="w-4 h-4" />
            default: return <Box className="w-4 h-4" />
        }
    }

    return (
        <div className="bg-zinc-950/50 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-primary animate-pulse" />
                    <h2 className="font-syne font-bold text-sm uppercase tracking-wider">Neural Event Feed</h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Live Syncing</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {detections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                        <ShieldAlert className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-[10px] uppercase font-mono tracking-widest">No Events Found</p>
                    </div>
                ) : (
                    detections.map((det) => (
                        <div key={det.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.06] transition-all">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                                    {getIcon(det.object_class)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide font-syne">{det.object_class}</p>
                                    <p className="text-[9px] font-mono text-zinc-500">{(det.confidence * 100).toFixed(1)}% Confidence</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-mono text-zinc-400 flex items-center justify-end">
                                    <Clock className="w-2 h-2 mr-1" />
                                    {new Date(det.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
