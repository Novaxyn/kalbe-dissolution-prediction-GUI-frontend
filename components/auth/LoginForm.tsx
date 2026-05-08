"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginInput from "./LoginInput";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if(!res.ok) {
                throw new Error(data.message || "Failed to login");
            }
            
            localStorage.setItem("token", data.token);
            console.log("Login Success: ", data);
            router.push("/dashboard")
            
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
            setTimeout(() => {
                if(error) {
                    setError("");
                }
            })
        }
    }

    return(
        <div className="w-full">
            <div className="text-white text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-center">
                <h2>Welcome</h2>
            </div>

            {/* LOGIN INPUTS */}
            <LoginInput label="Username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <LoginInput label="Password" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && (
                <p className="text-red-300 text-sm mb-3 text-center">{error}</p>
            )}
            
            <button onClick={handleLogin} disabled={loading} className="w-full mt-5 bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold py-2 rounded-md transition">{loading ? "Signing in..." : "Sign In"}</button>
            <p className="text-xs text-gray-200 text-center mt-4">Are you new? <br /> Ask your administrator to register a new member</p>
        </div>
    )
}