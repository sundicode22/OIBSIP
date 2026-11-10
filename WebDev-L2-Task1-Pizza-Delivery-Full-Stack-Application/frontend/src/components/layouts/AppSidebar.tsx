import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  UsersIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CircleStackIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useLogout } from "@/features/auth";

export function AppSidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const logout = useLogout();
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const mainNav = [
    { title: "Dashboard", url: "/", icon: HomeIcon },
    { title: "Users (Table & Dialog)", url: "/users", icon: UsersIcon },
  ];

  const pizzaNav = [
    { title: "Menu / Pizzas", url: "/pizzas", icon: SparklesIcon },
    { title: "Ingredients", url: "/ingredients", icon: CircleStackIcon },
    { title: "Orders", url: "/orders", icon: ShoppingBagIcon },
  ];

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="justify-between">
        {isOpen && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              🍕
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">PizzaPortal</span>
              <span className="text-[10px] text-muted-foreground">Operations</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mx-auto"
          onClick={toggleSidebar}
          title={isOpen ? "Minimize sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          ) : (
            <ChevronDoubleRightIcon className="h-4 w-4" />
          )}
        </Button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <div className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
                title={!isOpen ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.title}</span>}
              </NavLink>
            ))}
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <div className="flex flex-col gap-1">
            {pizzaNav.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
                title={!isOpen ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.title}</span>}
              </NavLink>
            ))}
          </div>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <div className="flex flex-col gap-1">
            <NavLink
              to="/admin-login"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
              title={!isOpen ? "Admin Portal" : undefined}
            >
              <ShieldCheckIcon className="h-5 w-5 shrink-0" />
              {isOpen && <span>Admin Portal</span>}
            </NavLink>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="justify-between">
        {isOpen ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col truncate pr-2">
              <span className="text-xs font-semibold truncate">{user?.name || "Demo User"}</span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={logout}
              title="Sign Out"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mx-auto text-muted-foreground hover:text-destructive"
            onClick={logout}
            title="Sign Out"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
