import type { NavItem } from "@/types";
// import { Icons } from "@/components/icons";

export type DashboardConfig = {
  sidebarNav: NavItem[];
};

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Home",
      href: "/dashboard/",
      icon: "home",
    },
    {
      title: "Gigs",
      href: "/dashboard/gigs",
      icon: "luggage",
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: "client",
    },
    {
      title: "Sources",
      href: "/dashboard/sources",
      icon: "billing",
    },
    {
      title: "Purchases",
      href: "/dashboard/purchases",
      icon: "dollarSign",
    },
  ],
};
