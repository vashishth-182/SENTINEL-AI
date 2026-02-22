"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldAlert, ArrowRight, UserCog } from "lucide-react"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid z-0 opacity-20 pointer-events-none"></div>

      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="z-10 text-center space-y-8 max-w-4xl px-4">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="p-4 bg-primary/10 rounded-3xl ring-1 ring-primary/20 backdrop-blur-sm">
            <ShieldAlert className="w-16 h-16 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-bold font-syne tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            SENTINEL AI
          </h1>
          <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full w-fit mx-auto">
            <p className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Neural Security Grid v1.0</p>
          </div>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto font-space-mono leading-relaxed">
          Automated real-time video surveillance intelligence for the next generation of security.
          <br />
          <span className="text-primary font-bold">Never Blinks. Never Sleeps.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href={isLoggedIn ? "/command-center" : "/login"}>
            <Button size="lg" className="h-16 px-10 text-lg font-bold tracking-wide bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(233,69,96,0.5)] transition-all hover:scale-105 group font-syne">
              {isLoggedIn ? "ACCESS COMMAND CENTER" : "INITIALIZE SECURITY PORTAL"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          {!isLoggedIn && (
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-16 px-10 text-lg border-white/10 hover:bg-white/5 font-syne">
                Operator Login
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center justify-center space-x-8 pt-8">
          <div className="text-center">
            <p className="text-2xl font-bold font-mono">99.9%</p>
            <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Accuracy</p>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono">15ms</p>
            <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Latency</p>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono">24/7</p>
            <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Uptime</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center w-full flex flex-col items-center justify-center space-y-2 opacity-30">
        <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All Systems Nominal</span>
        </div>
        <div className="text-[9px] text-muted-foreground/50 font-mono">
          CORTEX-X12 CONNECTION SECURED // ENCRYPTION AES-256-GCM
        </div>
      </div>
    </div>
  )
}
