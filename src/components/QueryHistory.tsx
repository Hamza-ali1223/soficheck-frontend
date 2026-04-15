import { useState } from "react";
import type { HistoryEntry } from "@/lib/useHistory";
import { extractRating } from "@/lib/parse";

function Icon({ name, className }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

function formatTime(ts: number): string {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " " +
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ScoreBadge({ responseText }: { responseText: string }) {
    const rating = extractRating(responseText);
    if (rating.kind === "numeric") {
        const color =
            rating.value <= 3
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : rating.value <= 6
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        return (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
                {rating.value}/10
            </span>
        );
    }
    if (rating.kind === "na") {
        return (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                Unique
            </span>
        );
    }
    return null;
}

interface Props {
    history: HistoryEntry[];
    onSelect: (entry: HistoryEntry) => void;
    onClear: () => void;
}

export default function QueryHistory({ history, onSelect, onClear }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    if (history.length === 0) return null;

    return (
        <div className="max-w-2xl mx-auto mb-8">
            {/* Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer w-full"
            >
                <Icon name="history" className="text-lg" />
                Recent Queries ({history.length})
                <Icon
                    name="expand_more"
                    className={`text-lg ml-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Collapsible list */}
            {isOpen && (
                <div className="mt-3 space-y-2 animate-fade-in-up">
                    {history.map((entry) => (
                        <button
                            key={entry.id}
                            onClick={() => onSelect(entry)}
                            className="w-full text-left flex items-center gap-3 p-3 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-xl hover:border-indigo-600/30 dark:hover:border-indigo-400/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group"
                        >
                            <div className="bg-indigo-600/10 dark:bg-indigo-400/10 p-2 rounded-lg shrink-0">
                                <Icon name="article" className="text-indigo-600 dark:text-indigo-400 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {entry.abstract.slice(0, 80)}{entry.abstract.length > 80 ? "…" : ""}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400 dark:text-slate-500">
                                        {formatTime(entry.timestamp)}
                                    </span>
                                    {entry.technologies && (
                                        <span className="text-xs text-gray-400 dark:text-slate-500">
                                            • {entry.technologies.slice(0, 30)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ScoreBadge responseText={entry.responseText} />
                            <Icon name="chevron_right" className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm" />
                        </button>
                    ))}

                    {/* Clear button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors mt-2 cursor-pointer"
                    >
                        <Icon name="delete" className="text-sm" />
                        Clear History
                    </button>
                </div>
            )}
        </div>
    );
}
