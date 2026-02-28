import { buildUrl } from "./config";

export interface QueryResult {
    status: number;
    text: string;
}

/**
 * Submit an FYP idea to the backend for similarity analysis.
 * Uses a 30-second AbortController timeout.
 */
export async function queryIdea(
    abstract: string,
    technologies: string,
): Promise<QueryResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
        const res = await fetch(buildUrl("/api/query"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ abstract, technologies }),
            signal: controller.signal,
        });

        const text = await res.text();
        return { status: res.status, text };
    } finally {
        clearTimeout(timeout);
    }
}
