import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import Loader from "./ui/loader";
import toast from "react-hot-toast";

const postfeedback = async (
    feedback: string,
    comments: string,
    message: string,
    message_type: string,
    user_message: string,
    message_before?: string,
    message_after?: string,
) => {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            feedback,
            comments,
            message,
            message_type,
            message_before,
            message_after,
            user_message,
        }),
    });
};

type FeedbackDialogProps = {
    children: React.ReactNode;
    feedback: "positive" | "negative";
    message: string;
    messageType: string;
    messageBefore?: string;
    messageAfter?: string;
    userMessage: string;
};

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
    children,
    feedback,
    message,
    messageType,
    messageBefore,
    messageAfter,
    userMessage,
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [comments, setComments] = React.useState("");
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>{children}</DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            {feedback === "positive"
                                ? "I like the response."
                                : "I don't like the response."}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {feedback === "positive"
                            ? "Positive Feedback"
                            : "Negative Feedback"}
                    </DialogTitle>
                    <DialogDescription>
                        Help us improve by sharing your thoughts.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-4">
                    <Label htmlFor="name" className="text-right sr-only">
                        Feedback
                    </Label>
                    <Textarea
                        cols={8}
                        id="feedback"
                        className="min-h-32"
                        onChange={(e) => setComments(e.target.value)}
                        value={comments}
                        placeholder="Enter your feedback here..."
                    />
                </div>
                <DialogFooter>
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        onClick={async () => {
                            setIsSubmitting(true);
                            const response = await postfeedback(
                                feedback,
                                comments,
                                message,
                                messageType,
                                userMessage,
                                messageBefore ?? "",
                                messageAfter ?? "",
                            );
                            if (response.ok) {
                                setIsSubmitting(false);
                                setOpen(false);
                                toast.success("Feedback submitted");
                                setComments("");
                            } else {
                                toast.error("Failed to submit feedback");
                                setIsSubmitting(false);
                            }
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader />
                                <span>
                                    {feedback === "positive"
                                        ? "Submitting positive feedback"
                                        : "Submitting negative feedback"}
                                </span>
                            </>
                        ) : feedback === "positive" ? (
                            "Submit positive feedback"
                        ) : (
                            "Submit negative feedback"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
