import { Loader2 } from "lucide-react";

export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full space-y-8 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer pulsating ring */}
                <div className="absolute w-24 h-24 border-4 border-red-500/20 rounded-full animate-ping"></div>
                {/* Middle spinning ring */}
                <div className="absolute w-20 h-20 border-t-4 border-r-4 border-red-500 rounded-full animate-spin"></div>
                {/* Inner static logo placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 relative z-10">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center px-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 animate-pulse">
                    Preparing Dashboard
                </h2>
                <p className="text-slate-500 text-sm max-w-[280px] leading-relaxed">
                    We're fetching the latest platform data for you. Please hold on a moment.
                </p>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
