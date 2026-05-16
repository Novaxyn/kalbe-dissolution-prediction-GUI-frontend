"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [role, setRole] = useState<"administrator" | "operator" | null>(null)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            router.push("/login")
        } else {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]))
                setRole(payload.role)
            } catch {
                router.push("/login")
            }
        }
    }, [])

    if (!role) return null

    return (
        <div className="min-h-screen flex flex-col">
            <DashboardHeader role={role} />
            <div className="flex-1">{children}</div>
        </div>
    )
}