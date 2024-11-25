import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

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
                <Outlet />
            </main>
        </SidebarProvider>
    );
}
