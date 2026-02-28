import { Card, CardBody } from "@heroui/card";

export default function Header() {
    return (
        <section className="flex flex-col items-center text-center gap-4">
            {/* Title */}
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent">
                        SOFI
                    </span>{" "}
                    <span className="text-foreground">Check</span>
                </h1>
                <p className="mt-2 text-lg sm:text-xl text-default-500 font-medium">
                    Software Final Year Project Idea Checker
                </p>
            </div>

            {/* Description Card */}
            <Card
                className="max-w-2xl border border-default-200 bg-default-50/60 dark:bg-default-100/40 backdrop-blur-sm"
                shadow="sm"
            >
                <CardBody className="px-5 py-4">
                    <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                        SOFI Check compares your Final Year Project (FYP) idea against past
                        university project catalogues from{" "}
                        <span className="font-semibold text-foreground">16SW</span> to{" "}
                        <span className="font-semibold text-foreground">20SW</span>.
                        The <span className="font-semibold text-foreground">21SW</span>{" "}
                        batch is not included because its catalogue is not
                        available yet. Enter your abstract and technologies below to receive
                        a similarity analysis.
                    </p>
                </CardBody>
            </Card>
        </section>
    );
}
