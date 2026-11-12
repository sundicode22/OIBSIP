import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Carrot,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Pizza,
  ShoppingBag,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const customerNavigation: NavGroup[] = [
  {
    label: "Order",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Menu", url: "/menu", icon: Pizza },
      { title: "Build your own", url: "/build", icon: ChefHat },
      { title: "My orders", url: "/orders", icon: ShoppingBag },
    ],
  },
];

export const adminNavigation: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Orders", url: "/admin/orders", icon: ClipboardList },
    ],
  },
  {
    label: "Kitchen",
    items: [
      { title: "Menu pizzas", url: "/admin/pizzas", icon: Pizza },
      { title: "Inventory", url: "/admin/inventory", icon: Boxes },
      { title: "Ingredients", url: "/admin/ingredients", icon: Carrot },
    ],
  },
];

export function findNavItem(groups: NavGroup[], pathname: string) {
  return groups
    .flatMap((group) => group.items)
    .find((item) => (item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)));
}
