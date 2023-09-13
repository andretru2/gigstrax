"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GigCreateButton from "@/components/gigs/gig-create-button";

interface Props {
  className?: string;
}

export default function GigTabs(props: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "All",
      href: "/dashboard/gigs?tab=all",
    },
    {
      title: "Upcoming",
      href: "/dashboard/gigs?tab=upcoming",
    },
    {
      title: "Recent",
      href: "/dashboard/gigs?tab=recentlyCreated",
    },
    {
      title: "Past",
      href: "/dashboard/gigs?tab=past",
    },

    // {
    //   title: "New Gig",
    //   href: "/dashboard/gigs?tab=createNew",
    // },
  ];

  return (
    <Tabs
      {...props}
      defaultValue="/dashboard/gigs?tab=upcoming"
      className={cn("w-full overflow-x-auto", props.className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.href}
            className={cn(
              "grid  w-32 grid-cols-4 self-center rounded-md border-2 border-secondary-200 text-foreground",

              // pathname === tab.href && "bg-background text-foreground shadow-sm"
              pathname?.includes(tab.href) &&
                "bg-primary text-foreground shadow-sm "
            )}
            onClick={() => router.push(tab.href)}
          >
            {tab.title}
          </TabsTrigger>
        ))}
        <TabsTrigger // This is the new tab for GigCreateButton
          key="createNew"
          value=""
          className={cn(
            "grid   grid-cols-1 self-center rounded-md border-2 border-secondary-200 text-foreground",

            pathname?.includes("createNew") &&
              "bg-background text-foreground shadow-sm"
          )}
          asChild
        >
          <GigCreateButton />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
