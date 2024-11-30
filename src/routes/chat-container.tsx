import { ChatPrompt } from "@/components/chat-prompt";
import React from "react";
import { createId } from "@paralleldrive/cuid2";

import { useSocketMessages } from "@/hooks/use-socket-messages";
import { ChatHome } from "./chat-home";
import { ChatMessages } from "./chat-messages";

export const ChatContainer: React.FC = () => {
    const clientId = React.useRef(createId());
    const lastChatMessageRef = React.useRef<HTMLLIElement>(null);
    const scrollAreaRef = React.useRef<HTMLUListElement>(null);
    const [defaultPrompt, setDefaultPrompt] = React.useState("");
    const { chatHistory, isLoading, loadingSteps, sendMessage } =
        useSocketMessages({
            clientId: clientId.current,
            lastChatMessageRef: lastChatMessageRef,
            scrollAreaRef: scrollAreaRef,
        });

    return (
        <div className="px-4 w-full h-full max-h-screen flex flex-col justify-center items-center xl:px-0">
            {chatHistory.length > 0 ? (
                <ChatMessages
                    chatHistory={chatHistory}
                    isLoading={isLoading}
                    loadingSteps={loadingSteps}
                    sendMessage={sendMessage}
                    scrollAreaRef={scrollAreaRef}
                    lastChatMessageRef={lastChatMessageRef}
                />
            ) : (
                <ChatHome setDefaultPrompt={setDefaultPrompt} />
            )}
            <div className="basis-auto w-full bottom-0 z-10 flex justify-center items-end pb-4">
                <ChatPrompt
                    defaultPrompt={defaultPrompt}
                    onHandleSubmit={({ prompt }) => {
                        sendMessage(prompt, chatHistory.length === 0);
                    }}
                />
            </div>
        </div>
    );
};
