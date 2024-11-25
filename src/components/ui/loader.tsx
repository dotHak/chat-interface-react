import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export const Loader = ({ className }: { className?: string }) => {
    return (
        <LoaderCircle
            className={cn("w-5 h-5 text-lime-500/60 animate-spin", className)}
        />
    );
};

export default Loader;
