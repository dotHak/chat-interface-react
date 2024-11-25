import { Hexagon, CircleCheckBig } from "lucide-react";
import Loader from "@/components/ui/loader";

export type LoadingStep = {
    id: string;
    message: string;
    state: "loading" | "done";
};

type ServerLoaderProps = {
    steps: LoadingStep[];
};

export const ServerLoader: React.FC<ServerLoaderProps> = ({ steps }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="basis-8">
                    <div className="w-fit flex flex-col h-fit items-center border p-1 rounded-md text-gray-600">
                        <Hexagon className="w-5 h-5" />
                        <span className="sr-only">Bot</span>
                    </div>
                </div>

                <p className="text-md font-medium mt-1">Processing Prompt</p>
            </div>

            <div className="flex gap-4">
                <div className="basis-8">
                    <span className="sr-only">Placeholder</span>
                </div>
                <div className="w-full max-w-3xl h-fit border rounded-xl bg-muted shadow-sm">
                    <ul className="p-2 flex flex-col gap-1.5">
                        {steps.map((step) => (
                            <li
                                key={step.id}
                                className="flex text-gray-700 gap-3 items-center"
                            >
                                {step.state === "loading" ? (
                                    <Loader />
                                ) : (
                                    <CircleCheckBig className="w-4 h-4 text-gray-500" />
                                )}
                                <p>{step.message}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
