import { useState, useEffect, useRef, useCallback } from "react";

import ProjectDetailsCard from "@/components/ProjectDetailsCard";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import QueryHistory from "@/components/QueryHistory";
import ServerStatus from "@/components/ServerStatus";
import { apiBaseUrl } from "@/lib/config";
import { queryIdea } from "@/lib/api";
import { useHistory, type HistoryEntry } from "@/lib/useHistory";


function Icon({ name, className }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

/* ── Draft auto-save helpers ── */
const DRAFT_KEY = "sofi-draft";

function loadDraft(): { abstract: string; technologies: string } {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return { abstract: "", technologies: "" };
        return JSON.parse(raw);
    } catch {
        return { abstract: "", technologies: "" };
    }
}

export default function Dashboard() {
    const draft = loadDraft();
    const [isLoading, setIsLoading] = useState(false);
    const [responseText, setResponseText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [abstract, setAbstract] = useState(draft.abstract);
    const [technologies, setTechnologies] = useState(draft.technologies);
    const { history, addEntry, clearHistory } = useHistory();
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    /* ── Auto-save draft to localStorage (debounced 500ms) ── */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({ abstract, technologies }));
        }, 500);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [abstract, technologies]);

    /* ── Submit handler with double-submit guard ── */
    const handleSubmit = useCallback(
        async (abs: string, tech: string) => {
            if (isLoading) return; // prevent double-submit
            setIsLoading(true);
            setError(null);
            setResponseText(null);

            try {
                const result = await queryIdea(abs, tech);
                if (result.status < 200 || result.status >= 300) {
                    setError(`Server returned status ${result.status}. Please try again.`);
                    return;
                }
                setResponseText(result.text);
                addEntry(abs, tech, result.text);
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    setError("Request timed out after 60 seconds. The server may be overloaded — please try again.");
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, addEntry],
    );

    /* ── Clear form + draft ── */
    function handleClear() {
        setAbstract("");
        setTechnologies("");
        setResponseText(null);
        setError(null);
        localStorage.removeItem(DRAFT_KEY);
    }

    /* ── Restore from history ── */
    function handleHistorySelect(entry: HistoryEntry) {
        setAbstract(entry.abstract);
        setTechnologies(entry.technologies);
        setResponseText(entry.responseText);
        setError(null);
    }

    // Missing env var guard
    if (!apiBaseUrl) {
        return (
            <section className="flex-1 flex items-center justify-center p-8">
                <div className="flex items-start gap-3 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl max-w-lg">
                    <Icon name="error" className="text-red-500 text-xl shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">Configuration Error</p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            VITE_API_BASE_URL is not set. Create a <code className="px-1 py-0.5 bg-red-100 dark:bg-red-800/30 rounded text-xs">.env</code> file with <code className="px-1 py-0.5 bg-red-100 dark:bg-red-800/30 rounded text-xs">VITE_API_BASE_URL=http://localhost:8081</code> and restart.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            {/* ─── Hero Section ─── */}
            <section className="text-center mb-16">
                <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                    Project Uniqueness Checker
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-4">
                    Analyze your Final Year Project against catalogues{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">16SW–21SW</span>{" "}
                    to ensure academic integrity and originality.
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-900/15 border border-blue-200/50 dark:border-blue-700/30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5 shadow-[0_0_12px_rgba(59,130,246,0.15)] dark:shadow-[0_0_12px_rgba(96,165,250,0.2)]">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    21SW catalogue has been added! Results now include projects from 16SW–21SW.
                </p>
                <br />
                <ServerStatus />
            </section>

            {/* ─── How It Works ─── */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-200/40 dark:border-indigo-800/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M2 17l10 5 10-5" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12l10 5 10-5" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">How It Works</h3>
                    </div>
                    <ul className="space-y-2.5 text-sm text-gray-600 dark:text-slate-300">
                        <li className="flex items-start gap-2.5">
                            <span className="flex items-center justify-center size-5 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 text-xs font-bold shrink-0 mt-0.5">1</span>
                            Enter your project's core technologies and abstract
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="flex items-center justify-center size-5 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 text-xs font-bold shrink-0 mt-0.5">2</span>
                            Our AI cross-references against FYP catalogues 16SW–21SW
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="flex items-center justify-center size-5 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 text-xs font-bold shrink-0 mt-0.5">3</span>
                            Get a Similarity Score and get to know which projects are similar to your idea from the existing catalogues.
                        </li>
                    </ul>
                </div>
            </div>

            {/* ─── Query History ─── */}
            <QueryHistory
                history={history}
                onSelect={handleHistorySelect}
                onClear={clearHistory}
            />

            {/* ─── Grid — 4/6 split ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                {/* Left column: Input (40%) */}
                <div className="lg:col-span-4">
                    <ProjectDetailsCard
                        abstract={abstract}
                        setAbstract={setAbstract}
                        technologies={technologies}
                        setTechnologies={setTechnologies}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                        onClear={handleClear}
                    />
                </div>

                {/* Right column: Result (60%) */}
                <AnalysisResultCard
                    responseText={responseText}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </main>
    );
}
