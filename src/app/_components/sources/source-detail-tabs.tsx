"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  id: string;
  className?: string;
}

export function SourceDetailTabs({ id, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "Overview",
      href: `/dashboard/sources/${id}`,
    },
    {
      title: "Gigs",
      href: `/dashboard/sources/${id}/gigs`,
    },
    {
      title: "Documents",
      href: `/dashboard/sources/${id}/documents`,
    },
  ];

  return (
    <Tabs
      {...props}
      defaultValue={`/dashboard/sources/${id}`}
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
                "bg-accent text-foreground shadow-sm",
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
