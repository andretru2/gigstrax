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
      className=" rounded-md bg-card text-foreground outline -outline-offset-2 outline-accent "
      disabled={isPending}
      isLoading={isPending}
      content="flex flex-row items-center gap-2"
    >
      <Icons.add className="mr-2 h-3 w-3" />
      {isPending ? "Adding..." : "New Gig"}
    </Button>
  );
}
