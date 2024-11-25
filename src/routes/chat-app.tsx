import { ChatPrompt } from "@/components/chat-prompt";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { useLocation } from "react-router-dom";
import { createId } from "@paralleldrive/cuid2";

import { Messages, ChatMessage } from "@/components/messages";
import { useSocketMessages } from "@/hooks/use-socket-messages";

const sendSocketMessage = (
    message: string,
    setChatHistory: (value: React.SetStateAction<ChatMessage[]>) => void,
    sendMessage: (mesage: string) => void,
    scrollEl: HTMLUListElement | null,
) => {
    setChatHistory((prevChat) =>
        prevChat.concat({
            id: createId(),
            text: message.replace(/\n/g, "<br>"),
            role: "user",
            type: "chat-message",
        }),
    );

    setTimeout(
        () =>
            scrollEl?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            }),
        100,
    );

    sendMessage(message);
};

export const ChatApp: React.FC = () => {
    const clientId = React.useRef(createId());
    const location = useLocation();
    const lastChatMessageRef = React.useRef<HTMLLIElement>(null);
    const {
        chatHistory,
        isLoading,
        loadingSteps,
        sendMessage,
        setChatHistory,
    } = useSocketMessages({
        clientId: clientId.current,
        lastPrompt: location.state?.prompt,
        lastChatMessageRef: lastChatMessageRef,
    });
    const scrollAreaRef = React.useRef<HTMLUListElement>(null);

    return (
        <div className="px-4 w-full h-full max-h-screen flex flex-col justify-center items-center xl:px-0">
            <ScrollArea className="basis-full w-full pt-6 flex justify-center">
                <Messages
                    messages={chatHistory}
                    isLoading={isLoading}
                    loadingSteps={loadingSteps}
                    ref={scrollAreaRef}
                    lastChatMessageRef={lastChatMessageRef}
                    onSubmit={(message) => {
                        sendSocketMessage(
                            message,
                            setChatHistory,
                            sendMessage,
                            scrollAreaRef.current,
                        );
                    }}
                />
            </ScrollArea>

            <div className="basis-auto w-full bottom-0 z-10 flex justify-center items-end pb-4">
                <ChatPrompt
                    onHandleSubmit={({ prompt }) => {
                        sendSocketMessage(
                            prompt,
                            setChatHistory,
                            sendMessage,
                            scrollAreaRef.current,
                        );
                    }}
                />
            </div>
        </div>
    );
};
