"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Camera, RefreshCcw } from "lucide-react"
import api from "@/lib/api"
import { VideoFeed } from "@/components/video/VideoFeed"
import { DetectionFeed } from "@/components/dashboard/DetectionFeed"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Stream {
    id: string
    name: string
    url: string
    status: 'active' | 'inactive' | 'error'
}

export default function DashboardPage() {
    const [streams, setStreams] = useState<Stream[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newStream, setNewStream] = useState({ name: "", url: "" })
    const router = useRouter()

    const fetchStreams = async () => {
        try {
            setIsLoading(true)
            const response = await api.get("/streams/")
            setStreams(response.data)
        } catch (error: any) {
            console.error("Failed to fetch streams:", error)
            if (error.response?.status === 401 || error.response?.status === 403) {
                router.push("/login")
            } else {
                toast.error("Failed to load camera feeds")
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }
        fetchStreams()
    }, [])

    const handleAddStream = async () => {
        if (!newStream.name || !newStream.url) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            setIsAdding(true)
            // Adding status: "active" so the AI worker picks it up immediately
            const response = await api.post("/streams/", { ...newStream, status: "active" })
            setStreams([...streams, response.data])
            setNewStream({ name: "", url: "" })
            toast.success("Camera feed added successfully", {
                description: "AI Worker has been notified and is initializing analysis."
            })
        } catch (error) {
            toast.error("Failed to add camera feed")
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-syne tracking-tight">Command Center</h1>
                    <p className="text-muted-foreground font-space-mono text-xs uppercase tracking-wider mt-1">
                        System status: Active • Encrypted Feed
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchStreams}
                        disabled={isLoading}
                        className="border-white/10"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 font-bold font-syne tracking-wide">
                                <Plus className="mr-2 h-4 w-4" /> ADD CAMERA
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-white/10">
                            <DialogHeader>
                                <DialogTitle className="font-syne text-2xl">Add New Stream</DialogTitle>
                                <DialogDescription className="font-space-mono text-xs">
                                    Register a new RTSP or HTTP video source for AI analysis.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Camera Identification (Name)</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Lobby Entrance"
                                        className="bg-white/5 border-white/10"
                                        value={newStream.name}
                                        onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="url">Stream Source (RTSP/HTTP URL)</Label>
                                    <Input
                                        id="url"
                                        placeholder="rtsp://admin:pass@192.168.1.10:554/live"
                                        className="bg-white/5 border-white/10 font-mono text-xs"
                                        value={newStream.url}
                                        onChange={(e) => setNewStream({ ...newStream, url: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    className="w-full bg-primary font-bold font-syne"
                                    onClick={handleAddStream}
                                    disabled={isAdding}
                                >
                                    {isAdding ? <Loader2 className="animate-spin" /> : "INITIALIZE CAMERA"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                    </div>
                    <p className="font-space-mono text-xs uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                        Synchronizing Feeds...
                    </p>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 overflow-hidden">
                    {/* Main Camera Grid */}
                    <div className="xl:col-span-3 overflow-y-auto pr-2 custom-scrollbar">
                        {streams.length === 0 ? (
                            <div className="min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02] space-y-4">
                                <Camera className="w-12 h-12 text-muted-foreground opacity-20" />
                                <div className="text-center">
                                    <p className="font-syne font-bold text-xl">No active cameras detected</p>
                                    <p className="font-space-mono text-xs text-muted-foreground mt-1">Connect your first video stream to begin monitoring</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
                                {streams.map((stream) => (
                                    <VideoFeed key={stream.id} {...stream} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side Event Feed */}
                    <div className="xl:col-span-1 hidden xl:block h-full pb-8">
                        <DetectionFeed />
                    </div>
                </div>
            )}
        </div>
    )
}
