import { useEffect, useState } from "react";

function Icon({ name, className }: { name: string; className?: string }) {
    return (
        <span className={`material-symbols-outlined ${className ?? ""}`}>
            {name}
        </span>
    );
}

export default function Header() {
    const [dark, setDark] = useState(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "dark") return true;
        if (stored === "light") return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    function toggleTheme() {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    }

    return (
        <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-9 bg-primary/10 rounded-xl shadow-inner">
                            <Icon name="verified" className="text-primary text-xl" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            SOFI Check
                        </span>
                    </div>

                    {/* Center nav */}
                    <nav className="hidden sm:flex items-center gap-1">
                        <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-xl transition-colors">
                            Dashboard
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            About
                        </button>
                    </nav>

                    {/* Right */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center size-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                        aria-label="Toggle theme"
                    >
                        <Icon name={dark ? "dark_mode" : "light_mode"} className="text-xl" />
                    </button>
                </div>
            </div>
        </header>
    );
}
