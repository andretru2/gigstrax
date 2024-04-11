"use client";

import { Button } from "../ui/button";
import { createGig } from "@/app/_actions/gig";
import { useTransition } from "react";
import { Icons } from "../icons";
// import { useRouter } from "next/navigation";

export function GigCreateButton() {
  const [isPending, startTransition] = useTransition();

  // const router = useRouter();

  // const handleClick = () => {
  //   startTransition(async () => {
  //     try {
  //       const id = await createGig();
  //       useGigStore.setState({ client: undefined });
  //       router.push(`/dashboard/gigs/${id}`);
  //     } catch (error) {
  //       console.error("Error creating gig:", error);
  //     }
  //   });
  // };

  const handleClick = () => {
    startTransition(() => {
      try {
        void createGig();
        // router.push(`/dashboard/gigs/${res.id}`);
      } catch (error) {
        console.error("Error creating gig:", error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className=" flex flex-row  gap-1 rounded-md bg-card  text-foreground outline -outline-offset-2 outline-accent"
      disabled={isPending}
      isLoading={isPending}
      // content=""
    >
      <Icons.add className=" h-3 w-3" />
      {isPending ? "Adding..." : "New Gig"}
    </Button>
  );
}
