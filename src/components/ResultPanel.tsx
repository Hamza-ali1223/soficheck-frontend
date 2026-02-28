import { Alert } from "@heroui/alert";
import { Card, CardBody } from "@heroui/card";
import type { ResponseType } from "@/lib/responseType";

interface ResultPanelProps {
    responseText: string | null;
    responseType: ResponseType | null;
    error: string | null;
}

const alertConfig: Record<
    ResponseType,
    { color: "success" | "warning" | "primary"; title: string }
> = {
    successNumeric: {
        color: "primary",
        title: "Analysis received",
    },
    successUnique: {
        color: "success",
        title: "No similar projects found (Unique)",
    },
    blocked: {
        color: "warning",
        title: "Request could not be processed",
    },
};

export default function ResultPanel({
    responseText,
    responseType,
    error,
}: ResultPanelProps) {
    if (!responseText && !error) return null;

    return (
        <div className="w-full max-w-2xl flex flex-col gap-4">
            {/* Error alert */}
            {error && (
                <Alert color="danger" title="Error" description={error} />
            )}

            {/* Response type alert */}
            {responseType && (
                <Alert
                    color={alertConfig[responseType].color}
                    title={alertConfig[responseType].title}
                />
            )}

            {/* Plain-text result */}
            {responseText && (
                <Card className="border border-default-200 bg-white/70 dark:bg-default-50/50 backdrop-blur-sm shadow-md">
                    <CardBody className="p-5 sm:p-6">
                        <pre
                            className="text-sm text-foreground leading-relaxed font-sans"
                            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                        >
                            {responseText}
                        </pre>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
