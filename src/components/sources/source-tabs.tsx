"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import GigCreateButton from "@/components/gigs/gig-create-button";
import SourceCreate from "./source-create";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Icons } from "../icons";

interface Props {
  className?: string;
}

export default function SourceTabs(props: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "All",
      href: "/dashboard/sources?tab=all",
    },
    {
      title: "Recent",
      href: "/dashboard/sources?tab=recentlyCreated",
    },
  ];

  return (
    <Tabs
      {...props}
      defaultValue="/dashboard/sources?tab=all"
      className={cn("w-full overflow-x-auto", props.className)}
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
                "bg-primary text-foreground shadow-sm"
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
            pathname?.includes("createNew") &&
              "bg-background text-foreground shadow-sm"
          )}
          asChild
        >
          <Popover>
            <PopoverTrigger>
              <div className="flex flex-row items-center gap-1 border-l-2 border-primary px-2 text-primary">
                <Icons.add className="h-5 w-5" />
                New Source
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <SourceCreate goto={true} />
            </PopoverContent>
          </Popover>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
