"use client";

// import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface Props {
  gigId: string;
  className?: string;
}

export function GigDetailTabs({ gigId }: Props) {
  // const pathName = usePathname();

  return (
    <Tabs defaultValue={gigId}>
      <TabsList>
        <TabsTrigger value={gigId} asChild>
          <Link href={`/dashboard/gigs/${gigId}`}>Overview</Link>
        </TabsTrigger>
        <TabsTrigger value="documents" asChild>
          <Link href={`/dashboard/gigs/${gigId}/documents`}>Documents</Link>
        </TabsTrigger>
        <TabsTrigger value="multi-event" asChild>
          <Link href={`/dashboard/gigs/${gigId}/multi-event`}>Multi-Event</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
