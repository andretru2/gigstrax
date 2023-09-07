"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import GigCreateButton from "@/components/gigs/gig-create-button";
import ClientCreate from "./client-create";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "../icons";

interface Props {
  className?: string;
}

export default function ClientTabs(props: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "All",
      href: "/dashboard/clients?",
    },
    {
      title: "Recently Created",
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
      defaultValue="/dashboard/clients?tab=recentlyCreated"
      className={cn("[&>*]:w-82 w-full overflow-x-auto", props.className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.href}
            className={cn(
              // pathname === tab.href && "bg-background text-foreground shadow-sm"
              pathname?.includes(tab.href) &&
                "bg-primary text-foreground shadow-sm",
              ""
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
            pathname?.includes("createNew") &&
              "bg-background text-foreground shadow-sm"
          )}
          asChild
        >
          <Popover>
            <PopoverTrigger>
              <div className="flex flex-row items-center gap-1 border-l-2 border-primary px-2 text-primary">
                <Icons.add className="h-5 w-5" />
                New Client
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <ClientCreate goto={true} />
            </PopoverContent>
          </Popover>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
