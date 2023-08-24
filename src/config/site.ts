import type { MainNavItem, NavItem } from "@/types";
import { slugify } from "@/lib/utils";

const today = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format

export type DashboardConfig = {
  mainNav: MainNavItem[];
};

// export type SiteConfig = typeof siteConfig;

interface SiteConfig {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: MainNavItem[];
}

export const siteConfig: SiteConfig = {
  name: "Real Beard Santas",
  description: "",
  url: "",
  links: {
    twitter: "",
    github: "",
  },
  mainNav: [
    {
      title: "Home",
      href: "/dashboard/",
      icon: "home",
    },
    {
      title: "Gigs",
      href: "/dashboard/gigs",
      // items: [
      //   {
      //     title: "All",
      //     href: "/dashboard/gigs",
      //     description: "All Gigs",
      //     items: [],
      //   },
      //   {
      //     title: "Upcoming",
      //     href: `/dashboard/gigs?gigDate=${today}`,
      //     description: "Upcoming Gigs",
      //     items: [],
      //   },
      //   {
      //     title: "New",
      //     href: "/dashboard/gigs/new",
      //     description: "Create New Gig",
      //     items: [],
      //   },
      // ],
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
    // {
    //   title: "Invoices",
    //   href: "/dashboard/invoices",
    //   icon: "dollarSign",
    // },
  ],
};
