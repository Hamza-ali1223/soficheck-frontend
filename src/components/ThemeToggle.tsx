import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "dark") return true;
        if (stored === "light") return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    function toggle() {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    }

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="fixed top-5 right-6 z-50 flex items-center justify-center size-10 rounded-xl bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-lg border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
            {/* Sun icon (light mode) */}
            <svg
                className={`size-5 transition-all duration-300 absolute ${dark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <circle cx="12" cy="12" r="5" className="stroke-teal-500" />
                <path className="stroke-teal-500" strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            {/* Moon icon (dark mode) */}
            <svg
                className={`size-5 transition-all duration-300 absolute ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path className="stroke-teal-400" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
        </button>
    );
}
