"use client";

import { Button } from "../ui/button";
import { create } from "@/app/_actions/gig";

import { useTransition, useState } from "react";
// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { Icons } from "../icons";

export default function GigCreateButton() {
  const [isPending, startTransition] = useTransition();

  //   const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const id = await create();
        console.log("create", id);
        void redirect(`/dashboard/gigs/${id}`);
      } catch (error) {
        console.error("Error creating gig:", error);
      } finally {
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
      variant="default"
      onClick={handleClick}
      className="opacity-80"
      disabled={isPending}
      isLoading={isPending}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      {isPending ? "Adding..." : "New Gig"}
    </Button>
  );
}
