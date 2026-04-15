export const apiBaseUrl: string | undefined = import.meta.env.VITE_API_BASE_URL;

export function buildUrl(path: string): string {
    if (!apiBaseUrl) {
        throw new Error("VITE_API_BASE_URL is not set");
    }
    const base = apiBaseUrl.replace(/\/+$/, "");
    const segment = path.replace(/^\/+/, "");
    return `${base}/${segment}`;
}
