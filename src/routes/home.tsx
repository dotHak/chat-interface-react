import { Hexagon } from "lucide-react";
import { ChatPrompt } from "@/components/chat-prompt";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React from "react";

const services = [
    "I want to book an apointment.",
    "What can you do for me?",
    "What are the available services?",
    "Who can help with a toothache?",
    "I have a toothache and I would like to book an appointment.",
];

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [defaultPrompt, setDefaultPrompt] = React.useState("");

    return (
        <div className="w-full h-full grid grid-cols-1 grid-rows-12">
            <div className="flex flex-col justify-center items-center row-span-10">
                <div className="w-fit p-2 rounded-xl border-4 shadow-md shadow-secondary">
                    <Hexagon className="w-10 h-10" />
                </div>

                <h2 className="text-4xl font-bold mt-16 text-slate-800">
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
                            className="text-slate-800 rounded-full"
                            onClick={() => {
                                setDefaultPrompt(service);
                            }}
                        >
                            {service}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="row-span-2 flex justify-center items-end pb-8">
                <ChatPrompt
                    defaultPrompt={defaultPrompt}
                    onHandleSubmit={(data) => {
                        navigate("/chat", { state: { prompt: data.prompt } });
                    }}
                />
            </div>
        </div>
    );
};
