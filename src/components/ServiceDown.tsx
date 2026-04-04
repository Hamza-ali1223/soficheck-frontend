const githubUrl = import.meta.env.VITE_GITHUB_URL || "#";
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "";

function Icon({ name, className }: { name: string; className?: string }) {
    return (
        <span className={`material-symbols-outlined ${className ?? ""}`}>
            {name}
        </span>
    );
}

export default function ServiceDown() {
    return (
        <main className="flex-1 w-full">
            {/* ── Hero / Status Banner ── */}
            <section className="text-center pt-16 md:pt-24 pb-12 px-4 animate-fade-in-up">
                <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 mb-6 ring-glow">
                    <Icon
                        name="cloud_off"
                        className="text-5xl text-indigo-600 dark:text-indigo-400"
                    />
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Service Temporarily Unavailable
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    SOFI Check's backend is currently offline. The Azure free-trial
                    credits that powered this service have expired.
                </p>
            </section>

            {/* ── Info Cards ── */}
            <section className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-6 mb-16">
                {/* What happened */}
                <div
                    className="relative rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="bg-indigo-600/10 dark:bg-indigo-400/10 p-2 rounded-xl">
                            <Icon
                                name="info"
                                className="text-indigo-600 dark:text-indigo-400 text-xl"
                            />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            What Happened?
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                        SOFI Check was built to help the{" "}
                        <strong className="text-gray-900 dark:text-white">
                            23 Batch Software Engineering
                        </strong>{" "}
                        students of{" "}
                        <strong className="text-gray-900 dark:text-white">
                            Mehran University of Engineering &amp; Technology
                        </strong>{" "}
                        verify the uniqueness of their Final Year Project ideas. The service
                        ran on Azure free-trial credits, which have now expired.
                    </p>
                </div>

                {/* Personal check */}
                <div
                    className="relative rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="bg-indigo-600/10 dark:bg-indigo-400/10 p-2 rounded-xl">
                            <Icon
                                name="support_agent"
                                className="text-indigo-600 dark:text-indigo-400 text-xl"
                            />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            Need a Personal Check?
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
                        If you still need your project idea checked for uniqueness, you can
                        reach out to the developer for a local system check at{" "}
                        <strong className="text-gray-900 dark:text-white">
                            Rs 200 PKR
                        </strong>
                        .
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        {contactEmail && (
                            <a
                                href={`mailto:${contactEmail}`}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-400 cta-glow transition-all"
                            >
                                <Icon name="mail" className="text-lg" />
                                Contact Developer
                            </a>
                        )}
                        {githubUrl !== "#" && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-slate-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="shrink-0"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                View on GitHub
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Gallery ── */}
            <section
                className="max-w-4xl mx-auto px-4 mb-16 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        How It Used to Look
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                        A preview of the SOFI Check interface when the service was active
                    </p>
                </div>
                <div className="relative rounded-2xl border border-indigo-200/60 dark:border-indigo-400/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-2 md:p-3 shadow-result dark:shadow-result-dark overflow-hidden">
                    <img
                        src="/gallery/homepage-preview.png"
                        alt="SOFI Check homepage preview showing the Project Uniqueness Checker interface"
                        className="w-full rounded-xl"
                        loading="lazy"
                    />
                </div>
            </section>

            {/* ── About / Footer ── */}
            <footer className="max-w-3xl mx-auto px-4 py-16">
                <div
                    className="relative rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-8 shadow-sm animate-fade-in-up"
                    style={{ animationDelay: "0.4s" }}
                >
                    {/* Header row */}
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="bg-indigo-600/10 dark:bg-indigo-400/10 p-2 rounded-xl">
                            <Icon
                                name="person"
                                className="text-indigo-600 dark:text-indigo-400 text-xl"
                            />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                                Built by Hamza Ali
                            </h4>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                                Open source project
                            </p>
                        </div>
                    </div>

                    {/* Purpose */}
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
                        I built SOFI Check to help our batch easily research and verify the
                        uniqueness of their Final Year Project ideas. Save time, avoid
                        duplicates, and start your FYP with confidence.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        {githubUrl !== "#" && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white/10 text-white text-sm font-medium rounded-full hover:bg-gray-800 dark:hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="shrink-0"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                View on GitHub
                            </a>
                        )}
                        {contactEmail && (
                            <a
                                href={`mailto:${contactEmail}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-slate-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Icon name="mail" className="text-lg" />
                                {contactEmail}
                            </a>
                        )}
                    </div>
                </div>
            </footer>
        </main>
    );
}
