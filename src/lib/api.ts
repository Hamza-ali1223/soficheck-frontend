import { buildUrl } from "./config";

export interface QueryResult {
    status: number;
    text: string;
}

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 2000;

/**
 * Query the API with automatic retry on network errors / 5xx.
 * Retries up to MAX_RETRIES times with exponential backoff (2s → 4s).
 * 4xx responses are NOT retried — they indicate client-side issues.
 */
export async function queryIdea(
    abstract: string,
    technologies: string,
): Promise<QueryResult> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60_000);

        try {
            const res = await fetch(buildUrl("/api/query"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ abstract, technologies }),
                signal: controller.signal,
            });

            clearTimeout(timeout);

            // 4xx = client error, don't retry
            if (res.status >= 400 && res.status < 500) {
                const text = await res.text();
                return { status: res.status, text };
            }

            // 5xx = server error, retry if attempts remain
            if (res.status >= 500) {
                lastError = new Error(`Server returned ${res.status}`);
                if (attempt < MAX_RETRIES) {
                    await delay(BASE_DELAY_MS * Math.pow(2, attempt));
                    continue;
                }
                const text = await res.text();
                return { status: res.status, text };
            }

            // 2xx / 3xx = success
            const text = await res.text();
            return { status: res.status, text };
        } catch (err: unknown) {
            clearTimeout(timeout);
            lastError = err;

            // AbortError (timeout) or network error — retry if attempts remain
            if (attempt < MAX_RETRIES) {
                await delay(BASE_DELAY_MS * Math.pow(2, attempt));
                continue;
            }
        }
    }

    // All retries exhausted — throw the last error
    throw lastError;
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
