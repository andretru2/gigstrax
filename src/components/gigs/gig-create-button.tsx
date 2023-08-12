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
      const id = await create();
      //   void router.push(`/dashboard/gigs/${id}`);
      void redirect(`/dashboard/gigs/${id}`);
    });
  };

  return (
    <Button onClick={handleClick} isLoading={isLoading}>
      Create
    </Button>
  );
}
