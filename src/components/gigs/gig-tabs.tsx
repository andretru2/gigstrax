"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  className?: string;
}

export default function GigTabs(props: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "Upcoming",
      href: "/dashboard/gigs?status=Upcoming",
    },
    {
      title: "Recently Created",
      href: "/dashboard/gigs?status=RecentylCreated",
    },
    {
      title: "Past",
      href: "/dashboard/gigs?status=Past",
    },
    {
      title: "New Gig",
      href: "/dashboard/gigs?status=CreateNew",
    },
  ];

  return (
    <Tabs
      {...props}
      className={cn("w-full overflow-x-auto", props.className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.href}
            className={cn(
              pathname === tab.href && "bg-background text-foreground shadow-sm"
            )}
            onClick={() => router.push(tab.href)}
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
