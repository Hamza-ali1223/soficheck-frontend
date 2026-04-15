import { useState, useEffect } from "react";
import { buildUrl } from "@/lib/config";

type Status = "checking" | "online" | "offline";

export default function ServerStatus() {
    const [status, setStatus] = useState<Status>("checking");

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(buildUrl("/api/health"), {
                    method: "GET",
                    signal: controller.signal,
                });
                // Any response (even 4xx/5xx) means the server is reachable
                if (res.ok) {
                    const text = await res.text();
                    // If we got a string response, server is healthy
                    if (text) {
                        setStatus("online");
                        return;
                    }
                }
                // Server responded but not healthy
                setStatus("online");
            } catch {
                setStatus("offline");
            }
        })();

        return () => controller.abort();
    }, []);

    const config: Record<Status, { icon: string; label: string; dot: string; text: string; bg: string; border: string }> = {
        checking: {
            icon: "sync",
            label: "Checking server...",
            dot: "bg-amber-400 animate-pulse",
            text: "text-amber-700 dark:text-amber-300",
            bg: "bg-amber-50/60 dark:bg-amber-900/15",
            border: "border-amber-200/50 dark:border-amber-700/30",
        },
        online: {
            icon: "check_circle",
            label: "Server online",
            dot: "bg-emerald-500",
            text: "text-emerald-700 dark:text-emerald-300",
            bg: "bg-emerald-50/60 dark:bg-emerald-900/15",
            border: "border-emerald-200/50 dark:border-emerald-700/30",
        },
        offline: {
            icon: "cloud_off",
            label: "Server offline",
            dot: "bg-red-500",
            text: "text-red-700 dark:text-red-300",
            bg: "bg-red-50/60 dark:bg-red-900/15",
            border: "border-red-200/50 dark:border-red-700/30",
        },
    };

    const c = config[status];

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${c.bg} ${c.border} backdrop-blur-sm transition-all duration-500`}
        >
            {/* Pulsing dot */}
            <span className={`size-2 rounded-full ${c.dot} shrink-0`} />

            {/* Label */}
            <span className={`text-xs font-medium ${c.text} tracking-wide`}>
                {c.label}
            </span>
        </div>
    );
}
