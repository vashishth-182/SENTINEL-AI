"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Cpu, Database, BellRing, Loader2, Save } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function ConfigurationPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [neuralSettings, setNeuralSettings] = useState({
        threshold: "0.5",
        hardware_acceleration: true,
        motion_tracking: true
    })
    const [storageSettings, setStorageSettings] = useState({
        retention_days: "30",
        quality: "hd"
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get("/settings/")
                response.data.forEach((s: any) => {
                    if (s.category === 'neural_engine') setNeuralSettings(s.settings)
                    if (s.category === 'storage') setStorageSettings(s.settings)
                })
            } catch (error) {
                console.error("Failed to load settings", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        try {
            setIsSaving(true)
            await Promise.all([
                api.post("/settings/", { category: 'neural_engine', settings: neuralSettings }),
                api.post("/settings/", { category: 'storage', settings: storageSettings })
            ])
            toast.success("System Protocol Updated")
        } catch (error) {
            toast.error("Failed to update protocol")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Accessing Secure Config...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-5xl pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-syne tracking-tight">System Configuration</h1>
                    <p className="text-muted-foreground font-space-mono text-xs uppercase tracking-wider mt-1">
                        Internal protocol and neural hardware settings
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 font-bold font-syne uppercase tracking-wider px-6"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-zinc-950 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Cpu className="w-16 h-16" />
                        </div>
                        <CardHeader>
                            <CardTitle className="font-syne">Neural Engine Settings</CardTitle>
                            <CardDescription className="text-xs font-mono">Adjust AI sensitivity and vision parameters</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-mono text-zinc-400 uppercase">Detection Threshold (Confidence)</Label>
                                    <Select
                                        defaultValue={neuralSettings.threshold}
                                        onValueChange={(v) => setNeuralSettings({ ...neuralSettings, threshold: v })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Select threshold" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10">
                                            <SelectItem value="0.3">0.3 (High Recall)</SelectItem>
                                            <SelectItem value="0.5">0.5 (Balanced)</SelectItem>
                                            <SelectItem value="0.8">0.8 (Extreme Precision)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold">Hardware Acceleration</Label>
                                        <p className="text-xs text-muted-foreground font-mono">Utilize CUDA/TensorRT cores for inference</p>
                                    </div>
                                    <Switch
                                        checked={neuralSettings.hardware_acceleration}
                                        onCheckedChange={(c) => setNeuralSettings({ ...neuralSettings, hardware_acceleration: c })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold">Motion Tracking</Label>
                                        <p className="text-xs text-muted-foreground font-mono">Enable optical flow for persistent IDs</p>
                                    </div>
                                    <Switch
                                        checked={neuralSettings.motion_tracking}
                                        onCheckedChange={(c) => setNeuralSettings({ ...neuralSettings, motion_tracking: c })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950 border-white/5">
                        <CardHeader>
                            <CardTitle className="font-syne">Database Storage</CardTitle>
                            <CardDescription className="text-xs font-mono">Retention policy for recorded incidents</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-mono text-zinc-400 uppercase">Frame Retention (Days)</Label>
                                    <Input
                                        type="number"
                                        value={storageSettings.retention_days}
                                        onChange={(e) => setStorageSettings({ ...storageSettings, retention_days: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-mono text-zinc-400 uppercase">Quality Tier</Label>
                                    <Select
                                        defaultValue={storageSettings.quality}
                                        onValueChange={(v) => setStorageSettings({ ...storageSettings, quality: v })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10">
                                            <SelectItem value="sd">SD (Optimized)</SelectItem>
                                            <SelectItem value="hd">HD (Standard)</SelectItem>
                                            <SelectItem value="uhd">4K (Archival)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-950 border-white/5">
                        <CardHeader>
                            <div className="flex items-center space-x-2 text-primary">
                                <BellRing className="w-4 h-4" />
                                <CardTitle className="font-syne text-lg uppercase tracking-wider">Alerts</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: 'Push Notifications', status: true },
                                { label: 'Cloud Storage Proxy', status: true },
                                { label: 'Bypass Warnings', status: false },
                                { label: 'System Pings', status: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.label}</span>
                                    <Switch defaultChecked={item.status} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(233,69,96,0.1)]">
                        <CardHeader>
                            <div className="flex items-center space-x-2 text-primary">
                                <Shield className="w-4 h-4" />
                                <CardTitle className="font-syne text-lg uppercase tracking-wider">Security</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full border-white/10 font-mono text-[9px] h-8">GENERATE API TOKEN</Button>
                            <p className="text-[9px] font-mono text-zinc-500 text-center uppercase tracking-tighter">
                                Access keys are rotated every 24 hours
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
