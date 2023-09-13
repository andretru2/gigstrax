"use client";

import { Button } from "../ui/button";
import { create } from "@/app/_actions/gig";

import { useTransition, useState } from "react";
// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";

export default function GigCreateButton() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const id = await create();
        router.push(`/dashboard/gigs/${id}`);
      } catch (error) {
        console.error("Error creating gig:", error);
      }

      //   const idx = await create();
      //   //   void router.push(`/dashboard/gigs/${id}`);
      //   console.log("create", idx);
      //   void redirect(`/dashboard/gigs/${idx}`);
      //   setIsLoading(false);
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="rounded-none border-l-2 border-primary text-primary"
      disabled={isPending}
      isLoading={isPending}
      content="flex flex-row items-center gap-2"
    >
      <Icons.add className="mr-2 h-4 w-4" />
      {isPending ? "Adding..." : "New Gig"}
    </Button>
  );
}
