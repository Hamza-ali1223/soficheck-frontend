import { useState } from "react";
import { Textarea } from "@heroui/input";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody } from "@heroui/card";

interface IdeaFormProps {
    onSubmit: (abstract: string, technologies: string) => void;
    isLoading: boolean;
}

export default function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
    const [abstract, setAbstract] = useState("");
    const [technologies, setTechnologies] = useState("");
    const [touched, setTouched] = useState(false);

    const abstractTooShort = abstract.length > 0 && abstract.length < 30;
    const abstractEmpty = touched && abstract.trim().length === 0;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched(true);

        if (abstract.trim().length < 30) return;

        onSubmit(abstract.trim(), technologies.trim());
    }

    return (
        <Card className="w-full max-w-2xl border border-default-200 bg-white/70 dark:bg-default-50/50 backdrop-blur-sm shadow-lg">
            <CardBody className="p-5 sm:p-7">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Abstract */}
                    <Textarea
                        label="Abstract"
                        labelPlacement="outside"
                        placeholder="Paste or type your FYP project abstract here…"
                        description="Minimum 30 characters required."
                        minRows={5}
                        maxRows={12}
                        value={abstract}
                        onValueChange={(v) => {
                            setAbstract(v);
                            if (!touched) setTouched(true);
                        }}
                        isRequired
                        isDisabled={isLoading}
                        isInvalid={abstractEmpty || abstractTooShort}
                        errorMessage={
                            abstractEmpty
                                ? "Abstract is required."
                                : abstractTooShort
                                    ? `Too short — ${abstract.length}/30 characters.`
                                    : undefined
                        }
                        classNames={{
                            inputWrapper:
                                "bg-default-100/60 dark:bg-default-100/30 border-default-200",
                        }}
                    />

                    {/* Technologies */}
                    <Input
                        label="Technologies"
                        labelPlacement="outside"
                        placeholder="e.g. React, Node.js, MongoDB (optional)"
                        value={technologies}
                        onValueChange={setTechnologies}
                        isDisabled={isLoading}
                        classNames={{
                            inputWrapper:
                                "bg-default-100/60 dark:bg-default-100/30 border-default-200",
                        }}
                    />

                    {/* Submit */}
                    <Button
                        type="submit"
                        isDisabled={isLoading}
                        className="mt-1 bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                        size="lg"
                        fullWidth
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Spinner size="sm" color="white" />
                                Analyzing…
                            </span>
                        ) : (
                            "Check Similarity"
                        )}
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}
