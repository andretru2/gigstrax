"use client";

import { type SourcePickerProps, type SantaType } from "@/types/index";
import { Button } from "../ui/button";
import { useQueryState } from "nuqs";
import { toTitleCase } from "@/lib/utils";
import { type ParsedSearchParams, modalOpenParser } from "../search-params";
import { cn } from "@/lib/utils";
import { handleSaveGig } from "@/lib/gig/handle-save-gig";
import { useTransition } from "react";

interface Props {
  source: SourcePickerProps;
  gigId?: string | undefined;
  searchParams?: ParsedSearchParams;
  className?: string;
  role: SantaType;
}

export function SourcePickerSelect(props: Props) {
  const [open, setOpen] = useQueryState(
    props.role === "RBS" ? "modalOpenSanta" : "modalOpenMrsSanta",
    modalOpenParser,
  );
  const [isPending, startTransition] = useTransition();

  function handleSelect() {
    startTransition(() => {
      props.gigId &&
        void handleSaveGig({
          id: props.gigId,
          key: props.role === "RBS" ? "santaId" : "mrsSantaId",
          value: props.source.id,
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
      {props.source.role && toTitleCase(props.source.role)}
    </Button>
  );
}
