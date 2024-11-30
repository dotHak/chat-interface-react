import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Messages, ChatMessage } from "@/components/messages";
import { LoadingStep } from "@/components/server-loader";

type ChatMessagesProps = {
    chatHistory: ChatMessage[];
    isLoading: boolean;
    loadingSteps: LoadingStep[];
    sendMessage: (message: string) => void;
    scrollAreaRef: React.RefObject<HTMLUListElement>;
    lastChatMessageRef: React.RefObject<HTMLLIElement>;
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
    chatHistory,
    isLoading,
    loadingSteps,
    sendMessage,
    scrollAreaRef,
    lastChatMessageRef,
}) => {
    return (
        <ScrollArea className="basis-full w-full pt-6 flex justify-center scroll-smooth">
            <Messages
                messages={chatHistory}
                isLoading={isLoading}
                loadingSteps={loadingSteps}
                ref={scrollAreaRef}
                lastChatMessageRef={lastChatMessageRef}
                onSubmit={(message) => sendMessage(message)}
            />
        </ScrollArea>
    );
};
