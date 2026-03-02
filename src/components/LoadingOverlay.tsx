import { useState, useEffect } from "react";

const MESSAGES = [
    "Scanning catalogues…",
    "Cross-referencing projects…",
    "Analyzing uniqueness…",
    "Almost there…",
];

function Icon({ name, className }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

export default function LoadingOverlay() {
    const [msgIndex, setMsgIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setMsgIndex((i) => (i + 1) % MESSAGES.length);
                setFade(true);
            }, 300);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Spinner */}
            <div className="relative size-16 mb-6">
                <svg className="animate-spin size-full" viewBox="0 0 50 50" fill="none">
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="4"
                        fill="none"
                    />
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        className="stroke-indigo-600 dark:stroke-indigo-400"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="80 45"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name="query_stats" className="text-indigo-600 dark:text-indigo-400 text-xl" />
                </div>
            </div>

            {/* Cycling message */}
            <p
                className={`text-sm font-medium text-gray-500 dark:text-slate-400 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
                    }`}
            >
                {MESSAGES[msgIndex]}
            </p>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-4">
                {MESSAGES.map((_, i) => (
                    <div
                        key={i}
                        className={`size-1.5 rounded-full transition-all duration-300 ${i <= msgIndex
                                ? "bg-indigo-600 dark:bg-indigo-400 scale-100"
                                : "bg-gray-300 dark:bg-gray-700 scale-75"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
