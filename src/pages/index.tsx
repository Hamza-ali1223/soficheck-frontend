import { useState } from "react";
import { Alert } from "@heroui/alert";

import DefaultLayout from "@/layouts/default";
import Header from "@/components/Header";
import IdeaForm from "@/components/IdeaForm";
import ResultPanel from "@/components/ResultPanel";
import { apiBaseUrl } from "@/lib/config";
import { queryIdea } from "@/lib/api";
import { detectResponseType, type ResponseType } from "@/lib/responseType";

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [responseType, setResponseType] = useState<ResponseType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Guard: env var must be set
  if (!apiBaseUrl) {
    return (
      <DefaultLayout>
        <section className="flex justify-center py-16 px-4">
          <Alert
            color="danger"
            title="Configuration Error"
            description="VITE_API_BASE_URL is not set. Create a .env file in the project root with VITE_API_BASE_URL=http://localhost:8081 and restart the dev server."
          />
        </section>
      </DefaultLayout>
    );
  }

  async function handleSubmit(abstract: string, technologies: string) {
    setIsLoading(true);
    setError(null);
    setResponseText(null);
    setResponseType(null);

    try {
      const result = await queryIdea(abstract, technologies);

      if (result.status < 200 || result.status >= 300) {
        setError(`Server returned status ${result.status}. Please try again.`);
        return;
      }

      setResponseText(result.text);
      setResponseType(detectResponseType(result.text));
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out after 30 seconds. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-8 py-8 md:py-12 px-4">
        <Header />
        <IdeaForm onSubmit={handleSubmit} isLoading={isLoading} />
        <ResultPanel
          responseText={responseText}
          responseType={responseType}
          error={error}
        />
      </section>
    </DefaultLayout>
  );
}
