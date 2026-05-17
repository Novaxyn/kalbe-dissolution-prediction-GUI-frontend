import kalbeLogo from "@/public/images/kalbe-logo.png"

import LoginForm from "./LoginForm"

export default function LoginCard() {
    return(
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* LEFT */}
            <div className="hidden md:flex md:w-7/10 bg-gray-50 items-center justify-center">
                <img src={kalbeLogo.src} alt="kalbe-logo" className="w-92 object-contain" />
            </div>

            {/* RIGHT */}
            <div className="w-full md:w-1/2 bg-green-800 flex items-center justify-center px-6">
                <div className="w-full max-w-sm px-8 py-10 flex flex-col justify-center min-h-screen md:min-h-0">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}