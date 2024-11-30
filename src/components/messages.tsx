import React, { forwardRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Hexagon, CircleUserRound, ThumbsUp, ThumbsDown } from "lucide-react";
import { ServerLoader, LoadingStep } from "@/components/server-loader";

import { cn } from "@/lib/utils";
import { AvailabilityList } from "./availability-list";
import { Doctor, DoctorsList } from "./doctors-list";
import { Button } from "./ui/button";
import { FeedbackDialog } from "./feedback-dialog";
export type Availability = {
    startDateTime: string;
    endDateTime: string;
    isAvailable: boolean;
};

type RegularChatMessage = {
    id: string;
    text: string;
    role: "user" | "system";
    type: "chat-message";
};

type AvailabilityListMessage = {
    id: string;
    role: "system";
    type: "availability-list";
    availabilities: Availability[];
    messageAfter: string;
    messageBefore: string;
};

type DoctorsListMessage = {
    id: string;
    role: "system";
    type: "doctors-list";
    doctors: Doctor[];
    messageAfter: string;
    messageBefore: string;
};

export type ChatMessage =
    | RegularChatMessage
    | AvailabilityListMessage
    | DoctorsListMessage;

type MessagesProps = {
    messages: ChatMessage[];
    isLoading: boolean;
    loadingSteps: LoadingStep[];
    lastChatMessageRef?: React.RefObject<HTMLLIElement>;
    onSubmit: (message: string) => void;
};

const Message: React.FC<RegularChatMessage> = ({ text, role }) => {
    return (
        <div className="flex w-full gap-4">
            <div className="basis-8">
                <div className="flex flex-col items-center border p-1 rounded-md text-gray-600">
                    {role === "user" ? (
                        <CircleUserRound className="w-5 h-5" />
                    ) : (
                        <Hexagon className="w-5 h-5" />
                    )}
                    <span className="sr-only">
                        {role === "user" ? "You" : "Chat Bot"}
                    </span>
                </div>
            </div>

            {role === "user" ? (
                <p
                    className="font-medium text-gray-700"
                    dangerouslySetInnerHTML={{
                        __html: text,
                    }}
                />
            ) : (
                <div className="mt-1 prose prose-h1:text-3xl max-w-full basis-auto">
                    <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
                </div>
            )}
        </div>
    );
};

const getMessage = (message: ChatMessage) => {
    if (message.type === "chat-message") {
        return message.text;
    } else if (message.type === "availability-list") {
        return JSON.stringify(message.availabilities);
    } else if (message.type === "doctors-list") {
        return JSON.stringify(message.doctors);
    }

    return "";
};

export const Messages = forwardRef<HTMLUListElement, MessagesProps>(
    (
        { messages, isLoading, loadingSteps, lastChatMessageRef, onSubmit },
        ref,
    ) => {
        return (
            <ul
                ref={ref}
                className="max-w-3xl w-full mx-auto flex flex-col gap-4 pb-48"
            >
                {messages.map((message, messageIdx) => (
                    <li
                        key={message.id}
                        className={cn(
                            "flex flex-col items-start w-full",
                            message.role === "user" &&
                                messageIdx !== 0 &&
                                "pt-8 font-medium",
                        )}
                        ref={
                            messageIdx === messages.length - 2
                                ? lastChatMessageRef
                                : undefined
                        }
                    >
                        {message.type === "chat-message" && (
                            <Message {...message} />
                        )}

                        {message.type === "availability-list" && (
                            <AvailabilityList
                                availabilities={message.availabilities}
                                messageAfter={message.messageAfter}
                                messageBefore={message.messageBefore}
                                onSubmit={onSubmit}
                            />
                        )}

                        {message.type === "doctors-list" && (
                            <DoctorsList
                                doctors={message.doctors}
                                messageAfter={message.messageAfter}
                                messageBefore={message.messageBefore}
                                onSubmit={onSubmit}
                            />
                        )}

                        {message.role === "system" &&
                            messageIdx === messages.length - 1 && (
                                <div className="ml-10 mt-2 flex items-center gap-0">
                                    <FeedbackDialog
                                        feedback="positive"
                                        messageType={message.type}
                                        message={getMessage(message)}
                                        userMessage={
                                            (
                                                messages[
                                                    messageIdx - 1
                                                ] as RegularChatMessage
                                            ).text
                                        }
                                        messageBefore={
                                            message.type !== "chat-message"
                                                ? message.messageBefore
                                                : undefined
                                        }
                                        messageAfter={
                                            message.type !== "chat-message"
                                                ? message.messageAfter
                                                : undefined
                                        }
                                    >
                                        <Button
                                            className="text-gray-700"
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <ThumbsUp className="w-6 h-6" />
                                            <span className="sr-only">
                                                Like reponse
                                            </span>
                                        </Button>
                                    </FeedbackDialog>
                                    <FeedbackDialog
                                        feedback="negative"
                                        messageType={message.type}
                                        message={getMessage(message)}
                                        userMessage={
                                            (
                                                messages[
                                                    messageIdx - 1
                                                ] as RegularChatMessage
                                            ).text
                                        }
                                        messageBefore={
                                            message.type !== "chat-message"
                                                ? message.messageBefore
                                                : undefined
                                        }
                                        messageAfter={
                                            message.type !== "chat-message"
                                                ? message.messageAfter
                                                : undefined
                                        }
                                    >
                                        <Button
                                            className="text-gray-700"
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <ThumbsDown className="w-6 h-6" />
                                            <span className="sr-only">
                                                Dislike reponse
                                            </span>
                                        </Button>
                                    </FeedbackDialog>
                                </div>
                            )}
                    </li>
                ))}
                {isLoading && <ServerLoader steps={loadingSteps} />}
            </ul>
        );
    },
);
