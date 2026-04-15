import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Accordion, AccordionItem } from "@heroui/accordion";
import LoadingOverlay from "@/components/LoadingOverlay";

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

/* ── Copy button ── */
function CopyButton({ responseText }: { responseText?: string | null }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (!responseText) return;
        try {
            await navigator.clipboard.writeText(responseText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* clipboard not available */ }
    }, [responseText]);

    if (!responseText) return null;

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
            title="Copy results"
        >
            <Icon
                name={copied ? "check" : "content_copy"}
                className={`text-sm ${copied ? "text-green-300" : "text-white/70 hover:text-white"}`}
            />
        </button>
    );
}

/* ── Result Header — Light: gradient  |  Dark: charcoal with glow ── */
function ResultHeader({ rating, responseText }: { rating?: RatingResult | null; responseText?: string | null }) {
    const r = 32;
    const circ = 2 * Math.PI * r;

    const hasRating = rating && rating.kind !== "missing";
    const isNumeric = rating?.kind === "numeric";
    const isNa = rating?.kind === "na";
    const value = isNumeric ? rating.value : 0;
    const fraction = isNumeric ? value / 10 : isNa ? 1 : 0;
    const offset = circ - fraction * circ;

    const ratingInfo = isNumeric ? getRatingLabel(value) : null;
    const label = isNa ? "Likely Unique" : ratingInfo?.label ?? "Unknown";

    return (
        <div className={[
            /* Light: indigo gradient */
            "bg-gradient-to-br from-indigo-600 to-[#4338ca]",
            /* Dark: charcoal with subtle border */
            "dark:from-[#252525] dark:to-[#252525] dark:border-b dark:border-indigo-400/20",
            "p-5 sm:p-8 text-white relative overflow-hidden",
        ].join(" ")}>
            {/* Dark decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl sm:text-2xl font-black text-white">Analysis Result</h3>
                    {hasRating && <CopyButton responseText={responseText} />}
                </div>

                {/* Score ring + badge — only when we have a valid rating */}
                {hasRating && (
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Score Ring */}
                        <div className="relative size-16 sm:size-20 flex items-center justify-center ring-glow shrink-0">
                            <svg className="size-full -rotate-90" viewBox="0 0 80 80">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r={r}
                                    fill="transparent"
                                    className="stroke-white/20 dark:stroke-gray-700"
                                    strokeWidth="8"
                                />
                                <motion.circle
                                    cx="40"
                                    cy="40"
                                    r={r}
                                    fill="transparent"
                                    className="stroke-white dark:stroke-indigo-400"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={circ}
                                    initial={{ strokeDashoffset: circ }}
                                    animate={{ strokeDashoffset: offset }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                />
                            </svg>
                            <span className="absolute text-lg sm:text-xl font-bold text-white">
                                {isNa ? "N/A" : isNumeric ? `${value}/10` : "—"}
                            </span>
                        </div>

                        {/* Status Badge */}
                        <div className={[
                            "backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border",
                            /* Light */
                            "bg-white/20 border-white/30 text-white",
                            /* Dark */
                            "dark:bg-indigo-400/20 dark:border-indigo-400/30 dark:text-indigo-300",
                        ].join(" ")}>
                            {label}
                        </div>
                    </div>
                )}
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
            className="group flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl project-card-hover transition-all cursor-pointer"
        >
            <div className="bg-indigo-600/10 dark:bg-indigo-400/10 p-3 rounded-lg group-hover:bg-white dark:group-hover:bg-indigo-400/20 transition-colors">
                <Icon name="description" className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.title}
                </p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                    {project.catalogue && (
                        <span className="text-xs text-gray-500 dark:text-slate-500">
                            {project.catalogue}
                        </span>
                    )}
                    {project.page && (
                        <span className="text-xs text-gray-400 dark:text-slate-500">
                            • Page {project.page}
                        </span>
                    )}
                </div>
                {project.description && (
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 line-clamp-2">
                        {project.description}
                    </p>
                )}
            </div>
            <Icon name="chevron_right" className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
        </motion.div>
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
        <div className="lg:col-span-6 w-full min-w-0">
            <Card
                fullWidth
                classNames={{
                    base: [
                        "w-full",
                        /* Light */
                        "bg-white border-2 border-result-border rounded-xl shadow-2xl shadow-indigo-600/10",
                        /* Dark */
                        "dark:bg-result-card-dark dark:border-gray-800 dark:shadow-2xl dark:shadow-black/50",
                        "overflow-hidden",
                    ].join(" "),
                }}
                shadow="none"
            >
                {/* ── Header — always shown ── */}
                {!isLoading && responseText && rating && !isBlocked ? (
                    <ResultHeader rating={rating} responseText={responseText} />
                ) : (
                    <ResultHeader />
                )}

                {/* ── Card body ── */}
                <CardBody className="p-8">
                    {/* Loading */}
                    {isLoading && <LoadingOverlay />}

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
                            <div className="flex items-center justify-center size-16 bg-gray-100 dark:bg-gray-700/30 rounded-2xl mb-4">
                                <Icon name="query_stats" className="text-gray-400 dark:text-slate-500 text-3xl" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                Submit your project to see analysis here.
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {!isLoading && responseText && rating && (
                        <AnimatePresence>
                            <motion.div
                                key={_key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-0"
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

                                {/* ② Similar Projects */}
                                {projects.length > 0 && (
                                    <>
                                        <div className="mb-8">
                                            <h4 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-4">
                                                Similar Projects Found
                                            </h4>
                                            <div className="space-y-3">
                                                {projects.map((p, i) => (
                                                    <ProjectItem key={i} project={p} index={i} />
                                                ))}
                                            </div>
                                        </div>

                                        {explanation && (
                                            <Divider className="bg-gray-100 dark:bg-gray-800 my-2" />
                                        )}
                                    </>
                                )}

                                {/* ③ AI Explanation */}
                                {explanation && (
                                    <div className="relative bg-indigo-50/60 dark:bg-[#262626] border border-indigo-600/10 dark:border-indigo-400/20 rounded-xl p-6 overflow-hidden">
                                        {/* Decorative blurred circle */}
                                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-600/5 dark:bg-indigo-400/10 rounded-full blur-2xl" />

                                        <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400 relative z-10">
                                            <Icon name="auto_awesome" className="text-xl" />
                                            <h4 className="font-bold">AI Explanation</h4>
                                        </div>
                                        <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed relative z-10 font-medium">
                                            {explanation}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </CardBody>

                {/* Full response collapsible — HeroUI Accordion */}
                {!isLoading && responseText && (
                    <div className="border-t border-gray-100 dark:border-gray-800">
                        <Accordion
                            variant="light"
                            className="px-0"
                            itemClasses={{
                                base: "px-6",
                                title: "text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider",
                                trigger: "py-3",
                                content: "pb-4",
                                indicator: "hidden",
                            }}
                        >
                            <AccordionItem
                                key="full-response"
                                aria-label="Full response"
                                title="Full Analysis Response"
                                startContent={
                                    <Icon name="expand_more" className="text-gray-400 text-base" />
                                }
                            >
                                <pre
                                    className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-sans"
                                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                                >
                                    {responseText}
                                </pre>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </Card>
        </div>
    );
}
