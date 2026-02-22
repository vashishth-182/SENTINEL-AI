"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldAlert, Video, BarChart2, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    return (
        <div className="flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <ShieldAlert className="w-6 h-6 text-primary mr-2" />
                <span className="font-syne font-bold text-xl tracking-wide text-foreground">SENTINEL</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/command-center" className="block">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50">
                        <Video className="w-4 h-4 mr-3" />
                        Live Streams
                    </Button>
                </Link>
                <Link href="/analytics" className="block">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50">
                        <BarChart2 className="w-4 h-4 mr-3" />
                        Analytics
                    </Button>
                </Link>
                <Link href="/alerts" className="block">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50">
                        <Bell className="w-4 h-4 mr-3" />
                        Alerts
                    </Button>
                </Link>
                <Link href="/settings" className="block">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50">
                        <Settings className="w-4 h-4 mr-3" />
                        Configuration
                    </Button>
                </Link>
            </nav>

            <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center mb-4 px-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-xs text-emerald-500 font-mono tracking-wider">SYSTEM ONLINE</span>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
