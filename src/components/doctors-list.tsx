import { Hexagon } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type Doctor = {
    name: string;
    title: string;
};

type DoctorsListProps = {
    doctors: Doctor[];
    messageBefore: string;
    messageAfter: string;
    onSubmit: (message: string) => void;
};

const FormSchema = z.object({
    doctorIdx: z.coerce.number(),
});

export const DoctorsList: React.FC<DoctorsListProps> = ({
    doctors,
    messageBefore,
    messageAfter,
    onSubmit: onSubmitProp,
}) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    const [submitted, setSubmitted] = React.useState(false);
    function onSubmit(data: z.infer<typeof FormSchema>) {
        const doctor = doctors[data.doctorIdx];
        const message = `I would like to see ${doctor.name}`;
        onSubmitProp(message);
        setSubmitted(true);
    }

    return (
        <div>
            <div className="flex items-start gap-4 w-full">
                <div className="basis-8">
                    <div className="flex flex-col items-center border p-1 rounded-md text-gray-600">
                        <Hexagon className="w-5 h-5" />
                        <span className="sr-only">Chat Bot</span>
                    </div>
                </div>

                <div>
                    <div className="mt-1 prose prose-h1:text-3xl max-w-full basis-auto">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {messageBefore}
                        </Markdown>
                    </div>

                    <div>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6 mt-4 w-full"
                            >
                                <FormField
                                    control={form.control}
                                    name="doctorIdx"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>
                                                <span className="sr-only">
                                                    Select a doctor
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    className="flex flex-col space-y-1"
                                                >
                                                    {doctors.map(
                                                        (doctor, index) => (
                                                            <FormItem
                                                                key={`doctor-${index}-${doctor.name}`}
                                                                className="flex items-center space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        value={String(
                                                                            index,
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal text-sm text-gray-800">
                                                                    <span className="font-semibold">
                                                                        {
                                                                            doctor.name
                                                                        }
                                                                    </span>
                                                                    ,
                                                                    <span className="ml-1">
                                                                        {
                                                                            doctor.title
                                                                        }
                                                                    </span>
                                                                </FormLabel>
                                                            </FormItem>
                                                        ),
                                                    )}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="mt-4 prose prose-h1:text-3xl max-w-full basis-auto">
                                    <Markdown remarkPlugins={[remarkGfm]}>
                                        {messageAfter}
                                    </Markdown>
                                </div>

                                <Button
                                    disabled={
                                        form.formState.isSubmitting ||
                                        !form.formState.isValid ||
                                        submitted
                                    }
                                    className="mt-4"
                                    type="submit"
                                >
                                    Send selected doctor
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
