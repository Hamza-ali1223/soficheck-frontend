import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

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
        <Card
            classNames={{
                base: [
                    /* Light */
                    "bg-indigo-input-bg border border-indigo-600/10 border-t-4 border-t-indigo-600 rounded-xl shadow-sm",
                    /* Dark */
                    "dark:bg-input-card-dark dark:border-gray-800 dark:border-t-indigo-400 dark:shadow-lg dark:shadow-black/50",
                    "sticky top-24 overflow-hidden",
                ].join(" "),
            }}
            shadow="none"
        >
            <CardBody className="p-8">
                {/* Card header */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        Project Details
                    </h3>
                    <Icon name="edit_square" className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 p-1 rounded-md" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Technologies */}
                    <div>
                        <label htmlFor="tech" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            Core Technologies
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xl">code</span>
                            <input
                                id="tech"
                                type="text"
                                placeholder="e.g. React, Python, TensorFlow"
                                value={technologies}
                                onChange={(e) => setTechnologies(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-input-dark border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-text-primary dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 dark:focus:ring-indigo-400/50 dark:focus:border-indigo-400 transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Abstract */}
                    <div>
                        <label htmlFor="abstract" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            Project Abstract
                        </label>
                        <textarea
                            id="abstract"
                            rows={8}
                            placeholder="Paste your detailed abstract here..."
                            value={abstract}
                            onChange={(e) => {
                                setAbstract(e.target.value);
                                if (!touched) setTouched(true);
                            }}
                            disabled={isLoading}
                            className={`w-full p-4 bg-white dark:bg-input-dark border rounded-xl text-sm text-text-primary dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 dark:focus:ring-indigo-400/50 dark:focus:border-indigo-400 transition-all resize-none disabled:opacity-50 ${isEmpty || tooShort
                                ? "border-red-400 dark:border-red-500"
                                : "border-gray-200 dark:border-gray-700"
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
                            <p className="text-xs text-gray-400">{charCount} characters</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-3 pt-4">
                        <Button
                            type="button"
                            variant="bordered"
                            onPress={handleClear}
                            isDisabled={isLoading}
                            className="font-medium text-gray-600 dark:text-slate-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-white/5 dark:hover:text-white rounded-xl"
                        >
                            Clear Form
                        </Button>

                        <Button
                            type="submit"
                            isDisabled={isLoading}
                            className="cta-glow font-bold px-8 py-3 bg-indigo-600 dark:bg-indigo-400 text-white shadow-lg shadow-indigo-600/25 dark:shadow-indigo-400/20 rounded-xl flex items-center justify-center gap-2"
                            size="lg"
                            startContent={
                                isLoading ? (
                                    <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <Icon name="analytics" className="text-lg" />
                                )
                            }
                        >
                            {isLoading ? "Checking…" : "Check Similarity"}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
