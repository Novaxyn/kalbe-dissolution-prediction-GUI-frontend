"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import kalbeLogo from "@/public/images/kalbe-logo.png"
import userIcon from "@/public/images/user-icon.png"
import Link from "next/link"

type User = {
    password: string
}

type Props = {
    role: "administrator" | "operator";
    user: User[];
}

const menuItems = [
    {
        label: "PREDICTION MODEL",
        path: "/dashboard",
        roles: ["administrator", "operator"],
    },
    {
        label: "FILE MANAGEMENT",
        path: "/dashboard/fileManagement",
        roles: ["administrator", "operator"],
    },
    {
        label: "USER MANAGEMENT",
        path: "/dashboard/userManagement",
        roles: ["administrator"],
    },
    {
        label: "LOG ACTIVITY",
        path: "/dashboard/logActivity",
        roles: ["administrator"],
    },
]

export default function DashboardHeader({role, user}: Props) {
    const [username, setUsername] = useState("")
    const [menu, setMenu] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [popup, setPopup] = useState({
        show: false,
        message: ""
    });

    const pathname = usePathname()

    const getClass = (path: string) => {
        return pathname === path ? "text-green-700" : "text-gray-500 hover:text-green-700"
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token) {
            try{
                const payload = JSON.parse(atob(token.split(".")[1]))
                setUsername(payload.username)
            } catch (err) {
                console.log("Invalid token")
            }
        }
    }, [])
    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    const handleChangePassword = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API}/api/users/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({password: newPassword})
            })

            const data = await res.json()

            if(!res.ok) {
                throw new Error(data.message || "Failed to change password")
            }

            setPopup({
                show: true,
                message: "User deactivated"
            });

            setShowConfirm(false);
            setNewPassword("");
            window.location.reload();
        } catch (error) {
            console.log(error);
            setPopup({
                show: true,
                message: "Failed to change password"
            });
        }
    }
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white">
            
            {/* LOGO + MENU */}
            <div className="flex items-center gap-6">
                <img
                    src={kalbeLogo.src}
                    alt="kalbe-logo"
                    className="h-10 w-auto object-contain"
                />

                <div className="flex gap-6 text-sm font-medium">
                    {menuItems
                        .filter(item => item.roles.includes(role))
                        .map(item => (
                            <Link key={item.path} href={item.path}>
                                <span
                                    className={`${getClass(item.path)} cursor-pointer`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        ))
                    }
                </div>
            </div>

            {/* USER */}
            <div
                className="relative flex items-center gap-2 cursor-pointer"
                onMouseEnter={() => setMenu(true)}
                onMouseLeave={() => setMenu(false)}
            >
                <img
                    src={userIcon.src}
                    alt="user"
                    className="w-10 h-10 rounded-full"
                />

                <span className="text-sm font-medium">
                    {username}
                </span>

                {menu && (
                    <div className="absolute right-0 top-full w-44 bg-white shadow-md rounded-md border z-50 overflow-hidden">

                        <button
                            onClick={() => {
                                setShowConfirm(true);
                                setMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                            Change Password
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                        >
                            Logout
                        </button>

                    </div>
                )}
            </div>

            {/* CHANGE PASSWORD MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">

                        <h2 className="text-xl font-bold mb-4">
                            Change Password
                        </h2>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    setNewPassword("");
                                }}
                                className="px-4 py-2 rounded-md border hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* POPUP */}
            {popup.show && (
                <div className="fixed top-5 right-5 bg-white border shadow-lg px-4 py-3 rounded-lg z-50">
                    {popup.message}
                </div>
            )}
        </div>
    )
}