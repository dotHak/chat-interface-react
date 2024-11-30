import { Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

const services = [
    "I want to book an apointment.",
    "What can you do for me?",
    "What are the available services?",
    "Who can help with a toothache?",
    "I have a toothache and I would like to book an appointment.",
];

type ChatHomeProps = {
    setDefaultPrompt: (prompt: string) => void;
};

export const ChatHome: React.FC<ChatHomeProps> = ({ setDefaultPrompt }) => {
    return (
        <div className="px-4 flex flex-col basis-full justify-center items-center row-span-10">
            <div className="w-fit p-2 rounded-xl border-4 shadow-md shadow-secondary">
                <Hexagon className="w-10 h-10" />
            </div>

            <h2 className="text-2xl text-center font-bold mt-16 text-slate-800 md:text-4xl">
                How can I help you today?
            </h2>

            <h3 className="text-lg text-slate-600 font-medium mt-24">
                Ask about:
            </h3>

            <div className="flex flex-wrap justify-center items-center gap-4 mt-8 max-w-xl">
                {services.map((service) => (
                    <Button
                        key={service}
                        variant="outline"
                        className="text-gray-800 h-fit rounded-full text-xs text-wrap md:text-sm"
                        onClick={() => {
                            setDefaultPrompt(service);
                        }}
                    >
                        {service}
                    </Button>
                ))}
            </div>
        </div>
    );
};
