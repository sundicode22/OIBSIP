import { useQuery } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { apiClient } from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { adminNavigation, customerNavigation, findNavItem } from "./navigation";

function ApiStatus() {
  const { isSuccess, isError } = useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => (await apiClient.get<{ status: string }>("/health")).data,
    refetchInterval: 30_000,
    retry: false,
  });

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-normal",
        isError && "bg-red-50 text-red-700",
        isSuccess && "bg-green-50 text-green-700",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full bg-muted-foreground",
          isSuccess && "bg-green-500",
          isError && "bg-red-500",
        )}
      />
      {isError ? "API offline" : isSuccess ? "API online" : "Checking API"}
    </Badge>
  );
}

export function RootLayout() {
  const { pathname } = useLocation();
  const { isAdmin } = useSession();
  const current = findNavItem(isAdmin ? adminNavigation : customerNavigation, pathname);

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 bg-background/90 px-4 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 size-9" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  {isAdmin ? "Admin" : "Pizza Inc."}
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{current?.title ?? "Not found"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ApiStatus />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
