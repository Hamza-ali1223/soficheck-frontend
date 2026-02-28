// ── Rating ──

export type RatingResult =
    | { kind: "numeric"; value: number }
    | { kind: "na" }
    | { kind: "missing" };

export function extractRating(text: string): RatingResult {
    if (!text.toLowerCase().includes("similarity rating")) {
        return { kind: "missing" };
    }
    if (/similarity\s*rating\s*:\s*n\s*\/?\s*a/i.test(text)) {
        return { kind: "na" };
    }
    const m = text.match(/similarity\s*rating\s*:\s*(\d+)\s*(?:\/\s*10)?/i);
    if (m) {
        return { kind: "numeric", value: parseInt(m[1], 10) };
    }
    return { kind: "missing" };
}

export function getRatingLabel(value: number): {
    label: string;
    color: "green" | "yellow" | "red";
} {
    if (value <= 3) return { label: "Likely Unique", color: "green" };
    if (value <= 6) return { label: "Some Overlap", color: "yellow" };
    return { label: "High Similarity", color: "red" };
}

// ── Projects ──

export interface ParsedProject {
    title: string;
    catalogue?: string;
    page?: string;
    description?: string;
}

export function parseSimilarProjects(text: string): ParsedProject[] {
    const projects: ParsedProject[] = [];
    const blocks = text.split(/project\s*\d+\s*:/i).slice(1);

    for (const block of blocks) {
        const t = block.match(/title\s*:\s*(.+)/i);
        const c = block.match(/catalogue\s*:\s*(.+)/i);
        const p = block.match(/page\s*:\s*(.+)/i);
        const d = block.match(/(?:short\s+)?description\s*:\s*(.+)/i);

        if (t) {
            projects.push({
                title: t[1].trim(),
                catalogue: c?.[1]?.trim(),
                page: p?.[1]?.trim(),
                description: d?.[1]?.trim(),
            });
        }
    }

    return projects.slice(0, 3);
}

// ── Explanation ──

export function parseExplanation(text: string): string | null {
    const patterns = [
        /how\s+these\s+projects?\s+(?:are|is)\s+similar[^:]*:\s*([\s\S]+?)(?=\n\n(?:project\s+\d|similarity\s+rating)|$)/i,
        /explanation\s*:\s*([\s\S]+?)(?=\n\n(?:project\s+\d|similarity\s+rating)|$)/i,
        /how\s+it\s+relates[^:]*:\s*([\s\S]+?)(?=\n\n(?:project\s+\d|similarity\s+rating)|$)/i,
    ];
    for (const p of patterns) {
        const m = text.match(p);
        if (m?.[1]?.trim()) return m[1].trim();
    }
    return null;
}
