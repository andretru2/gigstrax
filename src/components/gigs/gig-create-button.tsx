"use client";

import { Button } from "../ui/button";
import { create } from "@/app/_actions/gig";
import { useTransition, useState } from "react";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";
import { useGigStore } from "@/app/_store/gig";

export default function GigCreateButton() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const id = await create();
        useGigStore.setState({ client: undefined });
        router.push(`/dashboard/gigs/${id}`);
      } catch (error) {
        console.error("Error creating gig:", error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className=" rounded-md border-2 border-primary  bg-card text-foreground "
      disabled={isPending}
      isLoading={isPending}
      content="flex flex-row items-center gap-2"
    >
      <Icons.add className="mr-2 h-3 w-3" />
      {isPending ? "Adding..." : "New Gig"}
    </Button>
  );
}
