"use client"

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Maximize, Shield, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { toast } from "sonner"

interface VideoFeedProps {
    id: string
    name: string
    url: string
    status: 'active' | 'inactive' | 'error'
}

export function VideoFeed({ id, name, url, status }: VideoFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(status === 'active')
    const [detections, setDetections] = useState<any[]>([])

    // Fetch real detections for this stream
    useEffect(() => {
        let isMounted = true
        const fetchStreamDetections = async () => {
            if (status !== 'active') return
            try {
                const response = await api.get(`/detections/?limit=5&stream_id=${id}`)
                if (isMounted) setDetections(response.data)
            } catch (error) {
                console.error("Detections poll failed:", error)
            }
        }

        const interval = setInterval(fetchStreamDetections, 1000) // 1Hz polling for performance
        return () => {
            isMounted = false
            clearInterval(interval)
        }
    }, [id, status])

    useEffect(() => {
        if (videoRef.current) {
            if (status === 'active') {
                videoRef.current.play().catch(console.error)
            } else {
                videoRef.current.pause()
            }
        }
    }, [status])

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play().catch(console.error)
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleFullScreen = () => {
        const element = videoRef.current || videoContainerRef.current
        if (!element) return
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            element.requestFullscreen()
        }
    }

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to remove ${name}?`)) {
            try {
                await api.delete(`/streams/${id}`)
                toast.success("Stream removed")
                window.location.reload() // Or use a state management trigger
            } catch (error) {
                toast.error("Failed to delete stream")
            }
        }
    }

    const isWebcam = url.match(/^\d+$/) || url.startsWith('0')
    const liveStreamUrl = `${process.env.NEXT_PUBLIC_API_URL}/live/${id}`

    const videoContainerRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={videoContainerRef} className="relative group rounded-xl overflow-hidden border border-white/5 bg-zinc-950 aspect-video shadow-2xl transition-all hover:border-primary/30">
            {/* Video Feed */}
            <div className="absolute inset-0 z-0 bg-black">
                {isWebcam ? (
                    <img
                        src={liveStreamUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if live stream fails
                            // e.currentTarget.style.display = 'none'
                        }}
                    />
                ) : url.startsWith('rtsp://') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border-2 border-dashed border-white/5">
                        <Shield className="w-12 h-12 text-zinc-800 mb-2 animate-pulse" />
                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Secure RTSP Tunnel</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        src={url}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                )}

                {/* Cyber Scanline Effect */}
                {status === 'active' && (
                    <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                        <div className="w-full h-[2px] bg-primary/20 absolute top-0 animate-scanline shadow-[0_0_15px_rgba(233,69,96,0.5)]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent opacity-50"></div>
                    </div>
                )}
            </div>

            {/* Status Indicator (Top Left) */}
            <div className="absolute top-4 left-4 z-10">
                <div className={`flex items-center space-x-2 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md transition-all ${status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : status === 'error'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`}></span>
                    <span className="tracking-[0.1em] uppercase font-mono">{status === 'active' ? 'Live Stream' : status}</span>
                </div>
            </div>

            {/* Camera Info (Top Right) */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-right">
                    <p className="text-[11px] font-bold font-syne text-white uppercase tracking-wider">{name}</p>
                    <p className="text-[9px] font-mono text-zinc-400">UID: {id.slice(0, 8)}</p>
                </div>
            </div>

            {/* AI Bounding Boxes (Real Data) */}
            {status === 'active' && detections.map((det) => {
                if (!det.bbox_json) return null;
                const { x1, y1, x2, y2 } = det.bbox_json;
                return (
                    <div
                        key={det.id}
                        className="absolute z-10 border-2 border-primary/60 bg-primary/10 rounded-sm pointer-events-none transition-all duration-300"
                        style={{
                            left: `${x1 * 100}%`,
                            top: `${y1 * 100}%`,
                            width: `${(x2 - x1) * 100}%`,
                            height: `${(y2 - y1) * 100}%`
                        }}
                    >
                        <div className="absolute -top-5 left-0 bg-primary/80 text-white text-[8px] px-1 py-0.5 rounded-t-sm font-mono uppercase whitespace-nowrap">
                            {det.object_class} [{(det.confidence * 100).toFixed(0)}%]
                        </div>
                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white"></div>
                    </div>
                )
            })}

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all font-mono text-[10px]"
                        onClick={togglePlay}
                    >
                        {isPlaying ? "||" : "▶"}
                    </Button>
                </div>

                <div className="flex space-x-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all"
                        onClick={toggleFullScreen}
                    >
                        <Maximize className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 bg-black/40 backdrop-blur-md border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
