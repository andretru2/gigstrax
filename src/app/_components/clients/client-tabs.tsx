"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import GigCreateButton from "@/components/gigs/gig-create-button";
import { ClientPickerCreate } from "./client-picker-create";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "../icons";

interface Props {
  className?: string;
}

export function ClientTabs(props: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "All",
      href: "/dashboard/clients?tab=all",
    },
    {
      title: "Recent",
      href: "/dashboard/clients?tab=recentlyCreated",
    },
    // {
    //   title: "New Client ",
    //   href: "/dashboard/clients?tab=createNew",
    // },
  ];

  return (
    <Tabs
      {...props}
      defaultValue="/dashboard/clients?tab=all"
      className={cn(" w-full overflow-x-auto", props.className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.href}
            className={cn(
              "grid  w-32 grid-cols-4 self-center rounded-md  text-foreground",

              // pathname === tab.href && "bg-background text-foreground shadow-sm"
              pathname?.includes(tab.href) &&
                "bg-primary text-foreground shadow-sm",
              "",
            )}
            onClick={() => router.push(tab.href)}
          >
            {tab.title}
          </TabsTrigger>
        ))}
        <TabsTrigger
          key="createNew"
          value=""
          className={cn(
            "grid   grid-cols-1 self-center rounded-md  text-foreground",

            pathname?.includes("createNew") &&
              "bg-background text-foreground shadow-sm",
          )}
          asChild
        >
          <Popover>
            <PopoverTrigger>
              <div className="text-md flex flex-row items-center gap-1 rounded-md bg-card px-3 py-2 text-foreground  outline -outline-offset-2 outline-accent">
                <Icons.add className="h-3 w-3" />
                New Client
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <ClientPickerCreate goto={true} />
            </PopoverContent>
          </Popover>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
