"use client"

import {useState} from "react"
import UploadBox from "./UploadBox";
import Popup from "../PopUp";

export default function PredictionPanel() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [popup, setPopup] = useState({
        show: false,
        message: ""
    });


    const handleUpload = async () => {
        if (!file) {
            setPopup({
                show: true,
                message: "Please select a file"
            });
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("dataset", file)

            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json();
            if(!res.ok) {
                throw new Error(data.message || "Upload Failed");
            }
            console.log("Upload Success: ", data);
            } catch (err: any) {
                console.log("Upload Failed: ", err.message);
                setError(err.message);

                setPopup({
                    show: true,
                    message: err.message
                });

            } finally {
                setLoading(false);
        }

        const handleDownload = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/predictions/download`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to download report");
                }

                const blob = await res.blob();

                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "prediction-report.pdf";
                a.click();

                window.URL.revokeObjectURL(url);

            } catch (err: any) {
                setPopup({
                    show: true,
                    message: err.message
                });
            }
        }

    }
    return (

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-start">
            <h2 className="font-semibold mb-2">
                Upload/ <span className="text-blue-500">Choose uploaded dataset</span>
            </h2>

            <p className="text-sm text-gray-500 mb-10">
                Please make sure the file format meets the requirement.
                Only .xlsx, .xls, or .csv is allowed.
            </p>

            <UploadBox file={file} setFile={setFile} />

            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {error}
                </p>
                )
            }

            
            <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="mt-6 bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Uploading..." : "RUN PREDICTION MODEL"}
            </button>


            <Popup
                isOpen={popup.show}
                message={popup.message}
                onClose={() => setPopup({ show: false, message: "" })}
            />          
        </div>
        
    )
}
