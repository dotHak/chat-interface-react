import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { WandSparkles, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";

const FormSchema = z.object({
    prompt: z.string().min(1, {
        message: "prompt must be at least 10 characters.",
    }),
});

type InputPrompt = z.infer<typeof FormSchema>;

export function ChatPrompt({
    onHandleSubmit,
    defaultPrompt,
}: {
    onHandleSubmit: (data: InputPrompt) => void;
    defaultPrompt?: string;
}) {
    const [shouldAllSubmit, setShouldAllowSubmit] = useState(false);
    const form = useForm<InputPrompt>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            prompt: defaultPrompt || "",
        },
    });
    const formRef = useRef<HTMLFormElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const { ref, ...restProps } = form.register("prompt");

    function onSubmit(data: InputPrompt) {
        onHandleSubmit({
            prompt: data.prompt.trim(),
        });
        form.setValue("prompt", "");
        setShouldAllowSubmit(false);
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "fit-content";
        }
    }

    useEffect(() => {
        if (defaultPrompt) {
            form.setValue("prompt", defaultPrompt);
            setShouldAllowSubmit(true);
        }
    }, [defaultPrompt]);

    return (
        <div className="w-full max-w-3xl h-fit border rounded-xl bg-muted shadow-sm">
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full px-4 py-2"
            >
                <span className="place-self-start mt-2">
                    <WandSparkles className="w-5 h-5 text-gray-700" />
                </span>
                <label className="sr-only">
                    Please enter your chat prompt.
                </label>
                <Textarea
                    placeholder="Ask AI a question or book appointment with a doctor."
                    className="min-h-fit max-h-32 resize-none focus-visible:ring-0 border-none shadow-none"
                    {...restProps}
                    ref={(tRef) => {
                        ref(tRef);
                        textAreaRef.current = tRef;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            formRef.current?.requestSubmit();
                        }
                    }}
                    onInput={(e) => {
                        const textarea = e.target as HTMLTextAreaElement;
                        textarea.style.height = "auto";
                        textarea.style.height = `${textarea.scrollHeight}px`;
                    }}
                    rows={1}
                />
                <button
                    className="bg-transparent text-lime-500 disabled:bg-transparent disabled:text-gray-400 place-self-end mb-2"
                    disabled={!form.formState.isValid && !shouldAllSubmit}
                    type="submit"
                >
                    <Send className="w-6 h-6" />
                    <span className="sr-only">Submit</span>
                </button>
            </form>
        </div>
    );
}
