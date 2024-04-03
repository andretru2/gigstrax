"use client";

import { type ClientPickerProps } from "@/types/index";
import { Button } from "../ui/button";
// import { saveGig } from "@/app/_actions/gig";
import { useQueryState } from "nuqs";
import { toTitleCase } from "@/lib/utils";
import { type ParsedSearchParams } from "../search-params";
import { modalOpenParser } from "../search-params";
import { cn } from "@/lib/utils";
// import { useTransition } from "react";
import { handleSaveGig } from "@/lib/gig/handle-save-gig";
import { use, useTransition } from "react";

interface Props {
  gigId: string;
  client: ClientPickerProps;
  searchParams?: ParsedSearchParams;
  className?: string;
}

export function GigClientPickerSelect(props: Props) {
  const [open, setOpen] = useQueryState("modalOpen", modalOpenParser);
  const [isPending, startTransition] = useTransition();

  function handleSelect() {
    startTransition(() => {
      void handleSaveGig({
        id: props.gigId,
        key: "clientId",
        value: props.client.id,
      });
      void setOpen(!open);
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      isLoading={isPending}
      disabled={isPending}
      className={cn(
        props.className,
        "  w-full justify-start   p-2 text-left hover:bg-primary hover:text-black ",
      )}
      onClick={() => {
        void handleSelect();
      }}
    >
      {toTitleCase(props.client.client)}
    </Button>
  );
}
