import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
    abstract: string;
    setAbstract: (v: string) => void;
    technologies: string;
    setTechnologies: (v: string) => void;
    isLoading: boolean;
    onSubmit: (abstract: string, technologies: string) => void;
    onClear: () => void;
}

function Icon({ name, className }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

export default function ProjectDetailsCard({
    abstract,
    setAbstract,
    technologies,
    setTechnologies,
    isLoading,
    onSubmit,
    onClear,
}: Props) {
    const [touched, setTouched] = useState(false);
    const charCount = abstract.length;
    const tooShort = touched && charCount > 0 && charCount < 30;
    const isEmpty = touched && charCount === 0;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched(true);
        if (abstract.trim().length < 30) return;
        onSubmit(abstract.trim(), technologies.trim());
    }

    function handleClear() {
        setTouched(false);
        onClear();
    }

    return (
        <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-refined dark:shadow-refined-dark border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Project Details
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                Define your project for uniqueness analysis
                            </p>
                        </div>
                        <div className="flex items-center justify-center size-10 bg-primary/10 rounded-xl">
                            <Icon name="edit_square" className="text-primary text-xl" />
                        </div>
                    </div>
                </div>

                {/* Card body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Technologies */}
                    <div>
                        <label htmlFor="tech" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Core Technologies
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Icon name="code" className="text-slate-400 text-xl" />
                            </div>
                            <input
                                id="tech"
                                type="text"
                                placeholder="e.g., React, Node.js, MongoDB"
                                value={technologies}
                                onChange={(e) => setTechnologies(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Abstract */}
                    <div>
                        <label htmlFor="abstract" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Project Abstract
                        </label>
                        <textarea
                            id="abstract"
                            rows={6}
                            placeholder="Describe your project idea, objectives, and methodology in detail..."
                            value={abstract}
                            onChange={(e) => {
                                setAbstract(e.target.value);
                                if (!touched) setTouched(true);
                            }}
                            disabled={isLoading}
                            className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none disabled:opacity-50 ${isEmpty || tooShort
                                ? "border-red-400 dark:border-red-500"
                                : "border-slate-200 dark:border-slate-700"
                                }`}
                        />
                        <div className="flex items-center justify-between mt-1.5 px-1">
                            <div>
                                {isEmpty && (
                                    <p className="text-xs text-red-500">Abstract is required.</p>
                                )}
                                {tooShort && (
                                    <p className="text-xs text-red-500">
                                        Too short — {charCount}/30 characters.
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-slate-400">{charCount} characters</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={isLoading}
                            className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Clear Form
                        </button>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg shadow-primary/25 transition-all disabled:opacity-70"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Analyzing…
                                </>
                            ) : (
                                <>
                                    <Icon name="analytics" className="text-lg" />
                                    Analyze Uniqueness
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
}
