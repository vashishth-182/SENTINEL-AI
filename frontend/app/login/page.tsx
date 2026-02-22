"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert, Loader2, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import api from "@/lib/api"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Backend expects form-data for login (OAuth2 standard in FastAPI)
            const formData = new FormData()
            formData.append("username", email)
            formData.append("password", password)

            const response = await api.post("/auth/login", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const { access_token } = response.data
            localStorage.setItem("token", access_token)

            toast.success("Login successful!", {
                description: "Welcome back to Sentinel Command Center."
            })

            router.push("/command-center")
        } catch (error: any) {
            console.error("Login failed:", error)
            toast.error("Authentication failed", {
                description: error.response?.data?.detail || "Please check your credentials and try again."
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl z-10 shadow-2xl animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
                            <ShieldAlert className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-syne font-bold tracking-tight">Access Control</CardTitle>
                    <CardDescription className="text-muted-foreground font-space-mono text-xs uppercase tracking-widest">
                        Identity verification required
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Operator Identification (Email)</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@agency.gov"
                                    required
                                    className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Security Protocol (Password)</Label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold font-syne tracking-wide bg-primary hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(233,69,96,0.3)]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    VERIFYING...
                                </>
                            ) : (
                                "INITIALIZE SESSION"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center">
                    <div className="text-xs text-muted-foreground font-mono">
                        SECURE PORTAL PIN: 8000-AUTH-SSL
                    </div>
                </CardFooter>
            </Card>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] text-muted-foreground/50 font-mono uppercase tracking-[0.2em]">
                <span>Encrypted Tunnel: ESTABLISHED</span>
                <span>Sentinel v1.0.0</span>
            </div>
        </div>
    )
}
