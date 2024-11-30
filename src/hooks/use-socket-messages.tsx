import { ChatMessage, Availability } from "@/components/messages";
import useWebSocket from "react-use-websocket";
import { LoadingStep } from "@/components/server-loader";
import { createId } from "@paralleldrive/cuid2";

import React, { useState, useEffect, useCallback } from "react";
import { Doctor } from "@/components/doctors-list";

type ServerResponse =
    | {
          type: "loading-state";
          state: "loading";
          message: string;
      }
    | {
          type: "loading-state";
          state: "done";
      }
    | {
          type: "chat-message";
          message: string;
          role: "system" | "user";
          state: "success" | "error";
      }
    | {
          type: "availability-list";
          availability: Availability[];
          role: "system";
          state: "success" | "error";
          messageAfter: string;
          messageBefore: string;
      }
    | {
          type: "doctors-list";
          doctors: Doctor[];
          role: "system";
          state: "success" | "error";
          messageAfter: string;
          messageBefore: string;
      };

const isServerLoaderStep = (data: unknown): data is ServerResponse => {
    return (
        typeof data === "object" &&
        data !== null &&
        "type" in data &&
        (data.type === "loading-state" ||
            data.type === "chat-message" ||
            data.type === "availability-list" ||
            data.type === "doctors-list")
    );
};

const sendSocketMessage = (
    message: string,
    setChatHistory: (value: React.SetStateAction<ChatMessage[]>) => void,
    sendMessage: (mesage: string) => void,
    scrollEl: React.RefObject<HTMLUListElement | null>,
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
            scrollEl.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "end",
            }),
        100,
    );

    sendMessage(message);
};

export const useSocketMessages = ({
    lastChatMessageRef,
    clientId,
    scrollAreaRef,
}: {
    lastChatMessageRef: React.RefObject<HTMLLIElement | null>;
    scrollAreaRef: React.RefObject<HTMLUListElement | null>;
    clientId: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const { sendJsonMessage, lastMessage } = useWebSocket(
        `${import.meta.env.VITE_BACKEND_WS_URI}/${clientId}`,
        {
            shouldReconnect: () => true,
            reconnectAttempts: 100,
            reconnectInterval: 1000,
        },
    );
    const scrollLastMessageIntoView = useCallback(() => {
        setTimeout(
            () =>
                lastChatMessageRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start",
                }),
            200,
        );
    }, [lastChatMessageRef]);

    useEffect(() => {
        if (lastMessage?.data) {
            const data = JSON.parse(lastMessage.data);
            if (isServerLoaderStep(data)) {
                if (data.type === "chat-message") {
                    setIsLoading(false);
                    setLoadingSteps([]);
                    setChatHistory((prevChat) =>
                        prevChat.concat({
                            id: createId(),
                            text: data.message,
                            role: data.role,
                            type: data.type,
                        }),
                    );

                    scrollLastMessageIntoView();
                } else if (data.type === "availability-list") {
                    setIsLoading(false);
                    setLoadingSteps([]);

                    setChatHistory((prevChat) =>
                        prevChat.concat({
                            id: createId(),
                            role: data.role,
                            type: data.type,
                            messageBefore: data.messageBefore,
                            messageAfter: data.messageAfter,
                            availabilities: data.availability,
                        }),
                    );
                    scrollLastMessageIntoView();
                } else if (data.type === "doctors-list") {
                    setIsLoading(false);
                    setLoadingSteps([]);

                    setChatHistory((prevChat) =>
                        prevChat.concat({
                            id: createId(),
                            role: data.role,
                            type: data.type,
                            messageBefore: data.messageBefore,
                            messageAfter: data.messageAfter,
                            doctors: data.doctors,
                        }),
                    );

                    scrollLastMessageIntoView();
                } else if (
                    data.type === "loading-state" &&
                    data.state === "done"
                ) {
                    setIsLoading(false);
                    setLoadingSteps([]);
                } else if (
                    data.type === "loading-state" &&
                    data.state === "loading"
                ) {
                    setIsLoading(true);
                    setLoadingSteps((prevSteps) => {
                        if (prevSteps.length === 0) {
                            return [
                                {
                                    state: "loading",
                                    message: data.message,
                                    id: createId(),
                                },
                            ];
                        } else {
                            prevSteps[prevSteps.length - 1].state = "done";

                            return prevSteps.concat({
                                state: "loading",
                                message: data.message,
                                id: createId(),
                            });
                        }
                    });
                }
            }
        }
    }, [lastMessage?.data, scrollLastMessageIntoView]);

    return {
        chatHistory,
        isLoading,
        loadingSteps,
        sendMessage: (message: string, restart: boolean = false) => {
            sendSocketMessage(
                message,
                setChatHistory,
                (msg) => {
                    sendJsonMessage({ message: msg, restart });
                },
                scrollAreaRef,
            );
        },
        setChatHistory,
    };
};
