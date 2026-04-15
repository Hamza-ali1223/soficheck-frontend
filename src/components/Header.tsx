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
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#121212]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo + Brand */}
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600/10 dark:bg-indigo-400/10 p-2 rounded-lg flex items-center justify-center">
                        <Icon name="verified_user" className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        SOFI Check
                    </h1>
                </div>

                {/* Dark mode toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <Icon
                            name={dark ? "light_mode" : "dark_mode"}
                            className="text-gray-500 dark:text-slate-400"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}
