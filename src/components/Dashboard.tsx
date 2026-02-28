import { useState } from "react";

import ProjectDetailsCard from "@/components/ProjectDetailsCard";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { apiBaseUrl } from "@/lib/config";
import { queryIdea } from "@/lib/api";

function Icon({ name, className }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [responseText, setResponseText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [abstract, setAbstract] = useState("");
    const [technologies, setTechnologies] = useState("");

    async function handleSubmit(abs: string, tech: string) {
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
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === "AbortError") {
                setError("Request timed out after 30 seconds. Please try again.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    function handleClear() {
        setAbstract("");
        setTechnologies("");
        setResponseText(null);
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
        <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-4">
                        <div className="size-1.5 bg-primary rounded-full" />
                        <span className="text-xs font-semibold text-primary tracking-widest uppercase">
                            FYP Uniqueness Engine
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Project Uniqueness Checker
                    </h1>
                    <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Analyze your Final Year Project against catalogues{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">16SW–20SW</span>
                    </p>
                </div>

                {/* Grid */}
                <div className="grid lg:grid-cols-12 gap-8">
                    <ProjectDetailsCard
                        abstract={abstract}
                        setAbstract={setAbstract}
                        technologies={technologies}
                        setTechnologies={setTechnologies}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                        onClear={handleClear}
                    />
                    <AnalysisResultCard
                        responseText={responseText}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </div>
        </main>
    );
}
