import { useState, useCallback, useEffect } from "react";

export interface HistoryEntry {
    id: string;
    timestamp: number;
    abstract: string;
    technologies: string;
    responseText: string;
}

const STORAGE_KEY = "sofi-history";
const MAX_ENTRIES = 10;

function loadHistory(): HistoryEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveHistory(entries: HistoryEntry[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useHistory() {
    const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

    // Sync with localStorage on changes
    useEffect(() => {
        saveHistory(history);
    }, [history]);

    const addEntry = useCallback(
        (abstract: string, technologies: string, responseText: string) => {
            const entry: HistoryEntry = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                abstract,
                technologies,
                responseText,
            };
            setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
        },
        [],
    );

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { history, addEntry, clearHistory };
}
