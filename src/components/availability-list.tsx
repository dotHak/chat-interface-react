import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Availability as AvailabilityStr } from "@/components/messages";
import { Hexagon, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

dayjs.extend(customParseFormat);
dayjs().format();

export type Availability = {
    startDateTime: dayjs.Dayjs;
    endDateTime: dayjs.Dayjs;
    isAvailable: boolean;
};

type AvailabilitySlots = {
    [day: string]: Availability[];
};

function getAvailableSlots(availabilityStr: AvailabilityStr[]) {
    const availability = availabilityStr.map((av) => ({
        startDateTime: dayjs(av.startDateTime, "YYYY-MM-DD HH:mm:ss"),
        endDateTime: dayjs(av.endDateTime, "YYYY-MM-DD HH:mm:ss"),
        isAvailable: av.isAvailable,
    }));

    const slots: AvailabilitySlots = {};
    for (let i = 0; i < availability.length; i++) {
        const avOrUnav = availability[i];

        while (
            avOrUnav.endDateTime.diff(avOrUnav.startDateTime, "minute") > 30
        ) {
            const slot = {
                startDateTime: avOrUnav.startDateTime,
                endDateTime: avOrUnav.startDateTime.add(30, "minute"),
                isAvailable: avOrUnav.isAvailable,
            };
            const day = slot.startDateTime.format("YYYY-MM-DD");
            if (!slots[day]) {
                slots[day] = [];
                slots[day].push(slot);
            } else {
                slots[day].push(slot);
            }
            avOrUnav.startDateTime = avOrUnav.startDateTime.add(30, "minute");
        }

        if (avOrUnav.endDateTime.diff(avOrUnav.startDateTime, "minute") <= 30) {
            const day = avOrUnav.startDateTime.format("YYYY-MM-DD");
            if (!slots[day]) {
                slots[day] = [];
                slots[day].push(avOrUnav);
            } else {
                slots[day].push(avOrUnav);
            }
        }
    }
    return slots;
}

type AvailabilityListProps = {
    availabilities: AvailabilityStr[];
    messageAfter: string;
    messageBefore: string;
    onSubmit: (slot: string) => void;
};

export const AvailabilityList: React.FC<AvailabilityListProps> = ({
    availabilities,
    messageAfter,
    messageBefore,
    onSubmit,
}) => {
    const [slots, days] = React.useMemo(() => {
        const slots = getAvailableSlots(availabilities);
        const days = Object.keys(slots);

        return [slots, days];
    }, []);
    const [currentDay, setCurrentDay] = React.useState(0);
    const [currentAvailableSlots, setCurrentAvailableSlots] = React.useState<
        number | null
    >(null);
    const [submitted, setSubmitted] = React.useState(false);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-start gap-4 w-full">
                <div className="basis-8">
                    <div className="flex flex-col items-center border p-1 rounded-md text-gray-600">
                        <Hexagon className="w-5 h-5" />
                        <span className="sr-only">Chat Bot</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="mt-1 prose prose-h1:text-3xl max-w-full basis-auto">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {messageBefore}
                        </Markdown>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Button
                                size="icon"
                                variant={"ghost"}
                                onClick={() =>
                                    setCurrentDay((prev) => prev - 1)
                                }
                                disabled={currentDay === 0}
                                className={cn(days.length <= 1 && "hidden")}
                            >
                                <ChevronLeft />
                                <span className="sr-only">Previous</span>
                            </Button>

                            <span className="text-gray-800 font-medium">
                                {dayjs(days[currentDay], "YYYY-MM-DD").format(
                                    "dddd, MMMM D",
                                )}
                            </span>

                            <Button
                                variant={"ghost"}
                                size="icon"
                                onClick={() =>
                                    setCurrentDay((prev) => prev + 1)
                                }
                                disabled={currentDay === days.length - 1}
                                className={cn(days.length <= 1 && "hidden")}
                            >
                                <ChevronRight />
                                <span className="sr-only">Next</span>
                            </Button>
                        </div>

                        <ul className="flex gap-4 flex-wrap">
                            {slots[days[currentDay]].map((slot, slotIdx) => (
                                <li
                                    key={`${slot.startDateTime.toISOString()}-${slot.endDateTime.toISOString()}`}
                                >
                                    <Slot
                                        startDateTime={slot.startDateTime}
                                        endDateTime={slot.endDateTime}
                                        isAvailable={slot.isAvailable}
                                        onClick={() =>
                                            setCurrentAvailableSlots(slotIdx)
                                        }
                                        isActive={
                                            currentAvailableSlots === slotIdx
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-4 prose prose-h1:text-3xl max-w-full basis-auto">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {messageAfter}
                        </Markdown>
                    </div>
                    <div className="my-4">
                        <Button
                            disabled={
                                currentAvailableSlots === null || submitted
                            }
                            onClick={() => {
                                if (currentAvailableSlots !== null) {
                                    setSubmitted(true);
                                    onSubmit(
                                        `I want to book on ${days[currentDay]} from ${slots[days[currentDay]][currentAvailableSlots].startDateTime.format("hh:mm A")} to ${slots[days[currentDay]][currentAvailableSlots].endDateTime.format("hh:mm A")}`,
                                    );
                                }
                            }}
                        >
                            Send selected time slot
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Slot: React.FC<
    Availability & {
        onClick?: () => void;
        isActive: boolean;
    }
> = ({ startDateTime, endDateTime, isAvailable, onClick, isActive }) => {
    return (
        <Button
            className={cn(
                "w-38 text-gray-700 hover:border-green-400 hover:bg-background xl:w-40",
                isActive
                    ? "bg-green-50 text-green-900 border-green-400"
                    : "bg-background text-gray-700 border-input",
            )}
            variant="outline"
            disabled={!isAvailable}
            onClick={onClick}
        >
            {startDateTime.format("hh:mm A")} - {endDateTime.format("hh:mm A")}
        </Button>
    );
};
