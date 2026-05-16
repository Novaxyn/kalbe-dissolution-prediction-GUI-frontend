"use client"

import {useState, useEffect} from "react"
import { useRouter } from "next/navigation"
import DashboardLayput from "@/components/dashboard/DashboardLayout"

export default function DashboardPage() {
    const router = useRouter()
    const [role, setRole] = useState<"administrator" | "operator" | null>(null)

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
    return <DashboardLayput role={role} />
}