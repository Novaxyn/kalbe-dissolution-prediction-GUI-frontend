import PredictionPanel from "./PredictionPanel";
import ResultPanel from "./ResultPanel";

export default function DashboardLayput({role}: {role: "administrator" | "operator"}) {
    return (
        <div className="min-h screen flex flex-col">
            <div className="flex flex-col md:flex-row bg-white w-full h-[calc(100vh-80px)]">
                <PredictionPanel /> 
                <ResultPanel  hasResult={false} /> 
            </div>
        </div>
    )
}