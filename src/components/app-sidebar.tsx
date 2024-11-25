import { Home, Settings } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <SidebarTrigger shouldOpen={false} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive>
                                    <Home />
                                    <span className="sr-only">Home</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton>
                    <Settings />
                    <span className="sr-only">Settings</span>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
}
