export default function ResultPanel({ hasResult = false }) {

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

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full md:w-1/2 p-8 border-l flex flex-col">
            <h2 className="font-semibold mb-4">
                DISSOLUTION PROFILE RESULT
            </h2>

            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm text-center">
                Result will be displayed here once the prediction model has been run
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleDownload}
                    disabled={!hasResult}
                    className="bg-green-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-600"

                >
                    DOWNLOAD REPORT
                </button>
            </div>
        </div>
    )
}