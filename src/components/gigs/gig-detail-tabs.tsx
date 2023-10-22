"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  gigId: string;
  className?: string;
}

export default function GigDetailTabs({ gigId, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "Gig Details",
      href: `/dashboard/gigs/${gigId}`,
    },
    {
      title: "Documents",
      href: `/dashboard/gigs/${gigId}/documents`,
    },
  ];

  return (
    <Tabs
      {...props}
      defaultValue={`/dashboard/gigs/${gigId}`}
      className={cn("w-full   overflow-x-auto", props.className)}
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
                "bg-accent text-foreground shadow-sm"
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
