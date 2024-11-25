import { ChatMessage, Availability } from "@/components/messages";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { LoadingStep } from "@/components/server-loader";
import { createId } from "@paralleldrive/cuid2";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export const useSocketMessages = ({
    lastChatMessageRef,
    lastPrompt,
    clientId,
}: {
    lastChatMessageRef: React.RefObject<HTMLLIElement | null>;
    clientId: string;
    lastPrompt: string | undefined;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
        `${import.meta.env.VITE_BACKEND_WS_URI}/${clientId}`,
        {
            shouldReconnect: () => true,
            reconnectAttempts: 100,
            reconnectInterval: 1000,
        },
    );
    const navigate = useNavigate();

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

                    setTimeout(
                        () =>
                            lastChatMessageRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            }),
                        100,
                    );
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
                    setTimeout(
                        () =>
                            lastChatMessageRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            }),
                        100,
                    );
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
                    setTimeout(
                        () =>
                            lastChatMessageRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            }),
                        100,
                    );
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
    }, [lastMessage?.data]);

    useEffect(() => {
        if (lastPrompt) {
            if (readyState === ReadyState.OPEN) {
                if (chatHistory.length === 0) {
                    setChatHistory((prevChat) =>
                        prevChat.concat({
                            id: createId(),
                            text: lastPrompt,
                            role: "user",
                            type: "chat-message",
                        }),
                    );

                    sendJsonMessage({
                        message: lastPrompt,
                        restart: true,
                    });
                    window.history.replaceState({}, "");
                }
            }
        } else {
            navigate("/");
        }
    }, [readyState, lastPrompt]);

    return {
        chatHistory,
        isLoading,
        loadingSteps,
        sendMessage: (message: string) => {
            sendJsonMessage({ message, restart: false });
        },
        setChatHistory,
    };
};
