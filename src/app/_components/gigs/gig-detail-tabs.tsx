"use client";

import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { TabsContent } from "@radix-ui/react-tabs";

interface Props {
  gigId: string;
  className?: string;
}

export function GigDetailTabs({ gigId, ...props }: Props) {
  const pathName = usePathname();

  return (
    <Tabs value={pathName.split("/").at(-1)}>
      <TabsList>
        <TabsTrigger value={gigId} asChild>
          <Link href={`/dashboard/gigs/${gigId}`}>Overview</Link>
        </TabsTrigger>
        <TabsTrigger value="documents" asChild>
          <Link href={`/dashboard/gigs/${gigId}/documents`}>Documents</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
