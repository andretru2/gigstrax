"use client";

import { type ClientPickerProps } from "@/types/index";
import { Button } from "../ui/button";
import { useQueryState } from "nuqs";
import { toTitleCase } from "@/lib/utils";
import { type ParsedSearchParams, modalOpenParser } from "../search-params";
import { cn } from "@/lib/utils";
import { handleSaveGig } from "@/lib/gig/handle-save-gig";
import { useTransition } from "react";

interface Props {
  client: ClientPickerProps;
  gigId?: string | undefined;
  searchParams?: ParsedSearchParams;
  className?: string;
}

export function ClientPickerSelect(props: Props) {
  const [open, setOpen] = useQueryState("modalOpen", modalOpenParser);
  const [isPending, startTransition] = useTransition();

  function handleSelect() {
    startTransition(() => {
      props.gigId &&
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
        "  w-full     hover:bg-primary hover:text-black ",
        props.className,
      )}
      onClick={() => {
        void handleSelect();
      }}
    >
      {toTitleCase(props.client.client)}
    </Button>
  );
}
