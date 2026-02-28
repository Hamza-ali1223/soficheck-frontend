export type ResponseType = "successNumeric" | "successUnique" | "blocked";

/**
 * Detect the type of backend response based on its content.
 *
 * - successUnique  => contains "Similarity Rating:" and "N/A"
 * - successNumeric => contains "Similarity Rating:" and "/10"
 * - blocked        => no "Similarity Rating:" line at all
 */
export function detectResponseType(text: string): ResponseType {
    const lower = text.toLowerCase();
    const hasRating = lower.includes("similarity rating:");

    if (!hasRating) return "blocked";

    if (lower.includes("similarity rating:") && lower.includes("n/a")) {
        return "successUnique";
    }

    if (lower.includes("/10")) {
        return "successNumeric";
    }

    // Has rating line but doesn't match known patterns — treat as numeric
    return "successNumeric";
}
