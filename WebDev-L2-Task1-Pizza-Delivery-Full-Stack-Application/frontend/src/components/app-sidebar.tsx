import * as React from "react";
import { Pizza } from "lucide-react";
import { Link } from "react-router-dom";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminNavigation, customerNavigation } from "@/components/layouts/navigation";
import { useLogout } from "@/features/auth";
import { useSession } from "@/lib/session";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAdmin } = useSession();
  const logout = useLogout();

  return (
    <Sidebar
      collapsible="icon"
      className="shadow-[1px_0_12px_-4px_rgba(16,24,40,0.12)] group-data-[side=left]:border-r-0"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Pizza Inc.">
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Pizza className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Pizza Inc.</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {isAdmin ? "Admin console" : "Fresh & hot delivery"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={isAdmin ? adminNavigation : customerNavigation} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} onLogout={logout} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
