import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatContainer } from "@/routes/chat-container";
import { Toaster } from "react-hot-toast";

export function Layout() {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="relative w-full">
                <SidebarTrigger
                    shouldOpen
                    hideWhenOpen
                    className="absolute inset-0 z-30"
                />
                <ChatContainer />
            </main>
            <Toaster position="top-right" reverseOrder={false} />
        </SidebarProvider>
    );
}
