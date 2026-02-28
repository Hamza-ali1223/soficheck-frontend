import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    extractRating,
    getRatingLabel,
    parseSimilarProjects,
    parseExplanation,
    type RatingResult,
    type ParsedProject,
} from "@/lib/parse";

interface Props {
    responseText: string | null;
    isLoading: boolean;
    error: string | null;
}

function Icon({ name, className }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

/* ── Animated Score Ring ── */
function ScoreRing({ rating }: { rating: RatingResult }) {
    const r = 40;
    const circ = 2 * Math.PI * r;

    const isNumeric = rating.kind === "numeric";
    const isNa = rating.kind === "na";
    const value = isNumeric ? rating.value : 0;
    const fraction = isNumeric ? value / 10 : isNa ? 1 : 0;
    const offset = circ - fraction * circ;

    const ratingInfo = isNumeric ? getRatingLabel(value) : null;
    const label = isNa ? "Likely Unique" : ratingInfo?.label ?? "Unknown";

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-5">
                {/* Ring */}
                <div className="relative size-24 shrink-0 ring-glow">
                    <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r={r}
                            fill="none"
                            stroke="white"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circ}
                            initial={{ strokeDashoffset: circ }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">
                            {isNa ? "N/A" : isNumeric ? `${value}/10` : "—"}
                        </span>
                    </div>
                </div>

                {/* Text */}
                <div>
                    <p className="text-sm font-medium text-white/70">Uniqueness Score</p>
                    <p className="text-xl font-bold mt-0.5">{label}</p>
                    <p className="text-xs text-white/60 mt-1">
                        {isNa
                            ? "Your idea appears to be original."
                            : isNumeric
                                ? `Based on analysis of catalogues 16SW–20SW.`
                                : "Rating could not be determined."}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ── Project List Item ── */
function ProjectItem({ project, index }: { project: ParsedProject; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-default"
        >
            <div className="flex items-center justify-center size-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0 mt-0.5">
                <Icon name="description" className="text-amber-600 dark:text-amber-400 text-base" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
                    {project.title}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                    {project.catalogue && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {project.catalogue}
                        </span>
                    )}
                    {project.page && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            • Page {project.page}
                        </span>
                    )}
                </div>
                {project.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {project.description}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

/* ── Full Response Collapsible ── */
function FullResponseCollapsible({ text }: { text: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-t border-slate-100 dark:border-slate-700/50">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Icon name="unfold_more" className="text-base" />
                    Full response
                </span>
                <Icon
                    name={open ? "expand_less" : "expand_more"}
                    className="text-base transition-transform"
                />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <pre
                            className="px-6 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans"
                            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                        >
                            {text}
                        </pre>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── Main Component ── */
export default function AnalysisResultCard({ responseText, isLoading, error }: Props) {
    const [_key, setKey] = useState(0);

    // Trigger re-animation when new response arrives
    useEffect(() => {
        if (responseText) setKey((k) => k + 1);
    }, [responseText]);

    const rating = responseText ? extractRating(responseText) : null;
    const isBlocked = rating?.kind === "missing";
    const projects = responseText ? parseSimilarProjects(responseText) : [];
    const explanation = responseText ? parseExplanation(responseText) : null;

    return (
        <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-refined dark:shadow-refined-dark border border-slate-200/60 dark:border-slate-700/60 overflow-hidden lg:sticky lg:top-24">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 bg-primary/10 rounded-xl">
                            <Icon name="query_stats" className="text-primary text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Analysis Result
                        </h2>
                    </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                    {/* Loading skeleton */}
                    {isLoading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-28 bg-slate-100 dark:bg-slate-700/50 rounded-2xl" />
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-3/4" />
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
                            <div className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded-2xl" />
                        </div>
                    )}

                    {/* Error */}
                    {!isLoading && error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                            <Icon name="error" className="text-red-500 text-xl shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-300">Error</p>
                                <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && !error && !responseText && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="flex items-center justify-center size-16 bg-slate-100 dark:bg-slate-700/50 rounded-2xl mb-4">
                                <Icon name="query_stats" className="text-slate-400 text-3xl" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Submit your project to see analysis here.
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {!isLoading && responseText && rating && (
                        <motion.div
                            key={_key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-5"
                        >
                            {/* Blocked warning */}
                            {isBlocked && (
                                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                                    <Icon name="shield" className="text-amber-500 text-xl shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Request blocked by safety filter</p>
                                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-0.5">
                                            Your input was flagged. Review your abstract and try again.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Score panel */}
                            {!isBlocked && <ScoreRing rating={rating} />}

                            {/* Similar Projects */}
                            {projects.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Icon name="library_books" className="text-slate-400 text-lg" />
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Similar Projects
                                        </h3>
                                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                                            {projects.length} found
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {projects.map((p, i) => (
                                            <ProjectItem key={i} project={p} index={i} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Explanation */}
                            {explanation && (
                                <div className="relative bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-xl p-4 overflow-hidden">
                                    <Icon
                                        name="psychology"
                                        className="absolute -right-2 -bottom-2 text-6xl text-primary/10 dark:text-primary/15 pointer-events-none"
                                    />
                                    <div className="flex items-start gap-3 relative z-10">
                                        <div className="flex items-center justify-center size-8 bg-primary/10 rounded-lg shrink-0 mt-0.5">
                                            <Icon name="psychology" className="text-primary text-base" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-primary-dark dark:text-primary-light">
                                                AI Explanation
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                                {explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Full response collapsible */}
                {!isLoading && responseText && (
                    <FullResponseCollapsible text={responseText} />
                )}
            </div>
        </div>
    );
}
