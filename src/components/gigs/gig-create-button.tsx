"use client";

import { Button } from "../ui/button";
import { create } from "@/app/_actions/gig";

import { useTransition, useState } from "react";
// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

export default function GigCreateButton() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //   const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const id = await create();

        //const id = await create({ data: { clientId: null } });

        console.log("create", id);
        void redirect(`/dashboard/gigs/${id}`);
      } catch (error) {
        console.error("Error creating gig:", error);
      } finally {
        setIsLoading(false);
      }

      //   const idx = await create();
      //   //   void router.push(`/dashboard/gigs/${id}`);
      //   console.log("create", idx);
      //   void redirect(`/dashboard/gigs/${idx}`);
      //   setIsLoading(false);
    });
  };

  return (
    <Button onClick={handleClick} isLoading={isLoading}>
      Create
    </Button>
  );
}
